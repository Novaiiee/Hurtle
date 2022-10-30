import { serialize } from "cookie";
import {} from "js-cookie";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  res.setHeader(
    "Set-Cookie",
    serialize("session", "", {
      maxAge: 0,
    })
  );

  res.redirect(`http://${req.headers.host}`);
};

export default handler;
