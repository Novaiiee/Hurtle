import { GetServerSidePropsContext } from "next";

export const redirectIfNoSession = (ctx: GetServerSidePropsContext) => {
  if (!ctx.req.cookies.session) {
    return {
      returnValue: { redirect: { destination: "/" }, props: {} },
      ok: false,
    };
  }

  return {
    returnValue: { props: {} },
    ok: true,
  };
};
