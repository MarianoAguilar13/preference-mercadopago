import { Order } from "lib/orders";
import { User } from "lib/users";
import type { NextApiRequest, NextApiResponse } from "next";

//esta funcion nos permite crear una order y retornar el id de la misma
export async function crearOrderReturnId() {
  const newOrder = await Order.createNewOrder({});

  return newOrder.id;
}

//con esta funcion actualizo la data de la order que tenga el id envia por parametro
export async function actualizarDataOrder(id, data) {
  const newOrder = new Order(id);
  newOrder.data = data;
  await newOrder.push();
}

//verifica el order status y si esta paid entonces actualizo
//la data de la order en la db
export async function verificarOrderStatus(order) {
  //el merchant order tiene toda la informacion de la orden creada

  console.log("el orden status es: ", order.response.order_status);

  if (order.response.order_status == "paid") {
    const orderId = order.response.external_reference;
    const myOrder = new Order(orderId);
    await myOrder.pull();
    myOrder.data.status = "closed";
    await myOrder.push();
    //enviar el email que el pago fue realizado
  }
}
