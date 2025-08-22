
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    const items = body.items || [];
    if (!items.length) return { statusCode: 400, body: JSON.stringify({ error: 'No items' }) };

    const line_items = items.map(i => ({
      price_data: {
        currency: 'inr',
        product_data: { name: i.title },
        unit_amount: Math.round(i.price) * 100
      },
      quantity: i.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: process.env.URL + '/?success=1',
      cancel_url: process.env.URL + '/?canceled=1'
    });
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
