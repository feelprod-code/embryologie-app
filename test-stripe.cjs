const Stripe = require('stripe');
const stripe = Stripe('mk_1TBJy1FZLk6A75YEfpllgpJ3');

async function test() {
  try {
    const links = await stripe.paymentLinks.list({ limit: 1 });
    console.log("Success:", links.data.length > 0 ? "Found links" : "No links");
  } catch (error) {
    console.error("Error:", error.message);
  }
}
test();
