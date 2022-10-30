import { serialize } from "cookie";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const token = req.query.token as string;

  res.setHeader(
    "Set-Cookie",
    serialize("session", token, {
      path: "/",
      sameSite: false,
    })
  );

  res.redirect(`http://${req.headers.host}`);
};

export default handler;
