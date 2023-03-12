import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_TOKEN,
});

//solo exponemos algunas funciones de mercadopago, no hay que permitir
//enviar todo lo de mercadopago, sino las funciones que necesitemos
export async function getMerchantOrder(id) {
  //el merchant order tiene toda la informacion de la orden creada
  const res = await mercadopago.merchant_orders.get(id);

  return res;
}

export async function createPreference(data = {}) {
  const res = await mercadopago.preferences.create(data);
  return res.body;
}
