import { useUI } from "@contexts/ui.context";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { useMutation } from "react-query";

export interface SignUpInputType {
  email: string;
  username: string;
  password: string;
  name: string;
}
async function signUp(input: SignUpInputType) {
  return http.post(API_ENDPOINTS.REGISTER, input);
  // return {
  //   token: `${input.email}.${input.name}`.split("").reverse().join(""),
  // };
}
export const useSignUpMutation = () => {
  const { authorize, closeModal } = useUI();
  return useMutation((input: SignUpInputType) => signUp(input), {
    onSuccess: (data) => {
      // console.log("response from server 23: ", data?.data?.data?.token, {
      //   path: "/",
      // });
      // Cookies.set("auth_token", data.token);
      Cookies.set("auth_token", data?.data?.data?.token, { path: "/" });
      Cookies.set("current_user_id", data?.data?.user_id.toString(), {
        path: "/",
      });
      authorize();
      closeModal();
      window.location.assign("/");
    },
    onError: (data) => {
      window.location.assign("/");
    },
  });
};

const arr = ["id", "2323"];

arr.filter((el) => el?.toLowerCase().includes("2"));
