import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.1.1?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Inspect balance
    const balance = await stripe.balance.retrieve();
    
    // 2. Inspect external bank accounts on the account
    let accountInfo: any = null;
    let payoutSchedule: any = null;
    let scheduleUpdateResult: any = null;
    try {
      accountInfo = await stripe.accounts.retrieve();
      payoutSchedule = accountInfo.settings?.payouts?.schedule;
      
      // Try to set schedule to daily automatic if not already
      if (payoutSchedule && payoutSchedule.interval !== 'daily') {
        try {
          const updated = await stripe.accounts.update(accountInfo.id, {
            settings: {
              payouts: {
                schedule: {
                  interval: 'daily'
                }
              }
            }
          });
          scheduleUpdateResult = { success: true, newSchedule: updated.settings?.payouts?.schedule };
        } catch (schedErr: any) {
          scheduleUpdateResult = { error: schedErr.message };
        }
      }
    } catch (accErr: any) {
      accountInfo = { error: accErr.message };
    }

    // 3. List recent payouts
    let recentPayouts: any = [];
    try {
      const pList = await stripe.payouts.list({ limit: 5 });
      recentPayouts = pList.data;
    } catch (pErr: any) {
      recentPayouts = { error: pErr.message };
    }

    // 4. If action === 'trigger_payout' or if requested, attempt a manual payout
    let payoutResult: any = null;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    
    const eurAvailable = balance.available.find((b: any) => b.currency === 'eur');
    const availableAmount = eurAvailable ? eurAvailable.amount : 0; // en centimes

    if (body.action === 'trigger_payout') {
      if (availableAmount > 0) {
        try {
          const payout = await stripe.payouts.create({
            amount: availableAmount,
            currency: 'eur',
            description: 'Virement de solde FeelProd vers LCL Pro'
          });
          payoutResult = { success: true, payout };
        } catch (payoutErr: any) {
          payoutResult = { error: payoutErr.message };
        }
      } else {
        payoutResult = { message: "Aucun solde disponible immédiatement (fonds en cours de transfert Stripe)." };
      }
    }

    return new Response(
      JSON.stringify({
        balance,
        availableEur: availableAmount / 100,
        pendingEur: (balance.pending?.find((b: any) => b.currency === 'eur')?.amount || 0) / 100,
        account: accountInfo,
        payoutSchedule,
        scheduleUpdateResult,
        recentPayouts,
        payoutResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
