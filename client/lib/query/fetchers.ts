import axios from "axios";
import cookie from "js-cookie";
import { FlashCardSet, User } from "../types";

const setAuthorizationHeader = (token?: string) => {
  return `Bearer ${token ?? cookie.get("session")}`;
};
export const fetchUser = async (token?: string): Promise<User> => {
  const res = await axios.get(
    process.env.NEXT_PUBLIC_SERVER_URL + "/auth/profile",
    {
      headers: {
        Authorization: setAuthorizationHeader(token),
      },
    }
  );
  return res.data.data;
};

export const fetchUserSets = async (
  token?: string
): Promise<{ sets: FlashCardSet[]; count: number }> => {
  const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "/cards", {
    headers: {
      Authorization: setAuthorizationHeader(token),
    },
  });

  return res.data.data;
};
