import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import methods from "micro-method-router";
import { checkCodeMail } from "lib/controllers/auth";
import { findOrCreateAuth } from "lib/controllers/auth";
import { getUserId } from "lib/controllers/user";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const { email, code } = req.body;

    const result = await checkCodeMail(email, code);

    if (result) {
      const user = await getUserId(email);
      var token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.send({ token });
    } else {
      res.status(401).send({
        message:
          "Algunos o todos los datos ingresados (email o codigo) son incorrectos o la fecha del código vencio.",
      });
    }
  },
});
