import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
    redirect: {
      destination: "/",
    }
  }
};

export default function redirect() {
  return null;
}
