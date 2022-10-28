import { useUI } from "@contexts/ui.context";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { useMutation } from "react-query";

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function login(input: LoginInputType) {
  return http.post(API_ENDPOINTS.LOGIN, input);
  // return {
  //   token: `${input.email}.${input.remember_me}`.split("").reverse().join(""),
  // };
}
export const useLoginMutation = () => {
  const { authorize, closeModal } = useUI();
  return useMutation((input: LoginInputType) => login(input), {
    onSuccess: (data) => {
      console.log("im logged in ", data);
      Cookies.set("auth_token", data?.data?.data?.token, { path: "/" });
      console.log("userId: ", data?.data?.user_id);
      Cookies.set("current_user_id", data?.data?.data?.user_id?.toString(), {
        path: "/",
      });
      // console.log(data.data.data.token,"TOKEN")
      Cookies.get("auth_token");

      // console.log(Cookies.get('auth_token'), "authtoken")
      authorize();
      closeModal();
      window.location.assign("/");
    },
    onError: (data) => {
      console.log(data, "login error response");
    },
  });
};
