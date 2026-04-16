const stripe = require('stripe')('mk_1TBJy1FZLk6A75YEfpllgpJ3');
stripe.paymentLinks.list({ limit: 1 })
  .then(res => console.log("OK", res))
  .catch(err => console.error("ERR", err.message));
