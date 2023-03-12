import { User } from "lib/users";
import { decodeJwt } from "lib/jwt";
import parseToken from "parse-bearer-token";
import type { NextApiRequest, NextApiResponse } from "next";

export async function validarTokenDataUser(req: NextApiRequest) {
  //recivo y verifico el token para obtener el id del user
  const token = parseToken(req);
  const decoded = decodeJwt(token) as any;
  const userId = decoded.userId;

  //con ese id creo la instancia de la clase user y hago un pull de la data
  const newUser = new User(userId);
  await newUser.pull();

  const userData = {
    data: newUser.data,
    id: userId,
  };

  return userData;
}

//con el mail del user obtengo su id
export async function getUserId(email: string) {
  const cleanEmail = email.trim().toLocaleLowerCase();
  const user = await User.findByEmail(cleanEmail);
  if (user) {
    return user;
  } else {
    return null;
  }
}
