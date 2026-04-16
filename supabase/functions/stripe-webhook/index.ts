import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.1.1?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req: Request) => {
  const signature = req.headers.get("Stripe-Signature");
  
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    return new Response("Webhook secret not set", { status: 400 });
  }

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    // Initialisez Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      
      const customerEmail = session.customer_details?.email;
      const clientReferenceId = session.client_reference_id; // Si passé lors de la création du checkout

      console.log(`Paiement réussi pour: ${customerEmail}`);

      let userId = clientReferenceId;

      if (!userId && customerEmail) {
        // Optionnel : chercher par email si on ne passe pas le client_reference_id
        const { data: profiles, error } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("email", customerEmail)
          .limit(1);
        
        if (!error && profiles && profiles.length > 0) {
          userId = profiles[0].id;
        }
      }

      if (userId) {
        console.log(`Mise à jour du statut premium pour l'utilisateur: ${userId}`);
        const { error } = await supabaseClient
          .from("profiles")
          .update({ 
            is_premium: true,
            stripe_payment_id: session.payment_intent || null
          })
          .eq("id", userId);

        if (error) {
          console.error("Erreur lors de la mise à jour Supabase", error);
          return new Response("Database Error", { status: 500 });
        }
      } else {
        console.log("Impossible de trouver l'utilisateur avec l'email", customerEmail);
        return new Response("User not found", { status: 400 });
      }
    } 
    else if (event.type === "charge.refunded" || event.type === "customer.subscription.deleted") {
      const dataObject = event.data.object as any;
      const customerEmail = dataObject.billing_details?.email || dataObject.customer_email || dataObject.email || dataObject.receipt_email;
      
      console.log(`Annulation ou remboursement intercepté.`);

      if (customerEmail) {
        console.log(`Révocation pour l'email: ${customerEmail}`);
        const { error } = await supabaseClient
          .from("profiles")
          .update({ is_premium: false })
          .eq("email", customerEmail);

        if (error) {
          console.error("Erreur lors de la révocation du statut premium", error);
          return new Response("Database Error", { status: 500 });
        }
        console.log("Statut premium révoqué avec succès.");
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
