import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.1.1?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAILS = [
  'guillaumephilippe1968@gmail.com',
  'marc@damoiseaux.be',
  'vip@feelprod.com'
];

serve(async (req: Request) => {
  // Gestion du preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Client pour récupérer les infos de l'utilisateur qui fait l'appel
    const supabaseUserClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    
    if (userError || !user || !user.email) {
      throw new Error("Invalid or missing user authentication");
    }

    if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      throw new Error("Permission denied. Admin access only.");
    }

    const body = await req.json();
    const targetUserId = body.userId;

    if (!targetUserId) {
      throw new Error("Target userId is missing from request body");
    }

    // Client Admin (Service Role) pour lire/écrire les profils des autres
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Récupérer le profil cible
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("stripe_payment_id, email, first_name, is_active")
      .eq("id", targetUserId)
      .single();

    if (profileError || !profile) {
      throw new Error("Target user profile not found");
    }

    if (!profile.stripe_payment_id) {
      throw new Error("Ce profil ne possède aucun identifiant de paiement Stripe enregistré.");
    }

    // 2. Déclencher le remboursement complet via Stripe
    console.log(`Initiation du remboursement pour ${profile.email} (payment_intent: ${profile.stripe_payment_id})`);
    
    const refund = await stripe.refunds.create({
      payment_intent: profile.stripe_payment_id,
      reason: 'requested_by_customer'
    });

    // 3. Mettre à jour la base de données pour annuler les accès Premium
    console.log(`Remboursement Stripe réussi. Révocation des accès en base de données.`);
    
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        is_premium: false,
        stripe_payment_id: null,
        access_tier: null
      })
      .eq("id", targetUserId);

    if (updateError) {
      console.error("Erreur lors de l'annulation des accès en DB, mais Stripe a remboursé:", updateError);
      throw new Error("Le client a été remboursé mais l'annulation locale a échoué.");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Remboursement réussi et accès révoqué.",
        refundId: refund.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error("Refund error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
