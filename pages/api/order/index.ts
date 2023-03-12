import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "lib/users";
import { authMiddleware } from "lib/controllers/endpointMiddleware";
import { Order } from "lib/orders";
import { createPreference } from "lib/mercadopago";

/*

import { validarTokenDataUser } from "lib/controllers/user";
import { createPreference } from "lib/mercadopago";
import { crearOrderReturnId } from "lib/controllers/order";
import { actualizarDataOrder } from "lib/controllers/order";


export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    //con esta funcion obtengo el userId del token y luego
    //me traigo la data de ese user
    const userData = await validarTokenDataUser(req);

    //creo la order y saco el id
    const orderId = await crearOrderReturnId();

    //creo la preference de mercadopago con el orderID
    const dataPreference = await createPreference(orderId, userData, {});

    //la data de la preferencer la guardo en la data de la order en la db
    await actualizarDataOrder(orderId, dataPreference);

    console.log("url para pagar: ", dataPreference.sandbox_init_point);

    if (dataPreference) {
      res.send(dataPreference.sandbox_init_point);
    }
  },
});
*/

//simulando un producto que lo buscaria de la db

const products = {
  1234: {
    title: "Guild Wars 2",
    price: 50,
  },
};

//la data opcional del product la envio por el body

/*
{
  "color": "negro",
  "direccion_de_envio":"calle falsa 1234"
}

*/

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query as any;
  const product = products[productId];

  if (!product) {
    res.status(404).json({ message: "El producto no existe" });
  } else {
    //aca creo una order con la data
    const order = await Order.createNewOrder({
      aditionalInfo: req.body,
      productId,
      userId: token.userId,
      status: "pending",
      crateDate: new Date(),
    });

    const preference = await createPreference({
      items: [
        {
          title: product.title,
          description:
            "Es un juego de rol, mundo abierto basado en el mundo de las novelas de Harry Potter",
          picture_url: "http://www.myapp.com/myimage.jpg",
          category_id: "15",
          quantity: 1,
          currency_id: "ARS",
          unit_price: product.price,
        },
      ],
      //la url donde va a volver el usuario
      back_urls: {
        success: "",
        pending: "",
      },
      metadata: { userId: token.userId },
      external_reference: order.id,
      notification_url:
        "https://webhook.site/797dba63-8288-490a-8dd2-9ce82cdb510e",
    });

    res.send({ url: preference.sandbox_init_point });
  }
}

const handler = methods({
  post: postHandler,
});

export default authMiddleware(handler);
