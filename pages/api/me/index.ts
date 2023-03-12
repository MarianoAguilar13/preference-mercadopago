import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "lib/controllers/endpointMiddleware";
import { authMiddleware } from "lib/controllers/endpointMiddleware";

export default authMiddleware(handler);
