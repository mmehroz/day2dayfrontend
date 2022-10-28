import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { createContext, useState, useEffect } from "react";

export const userContext = createContext(null);

export const Provider = ({ children }) => {
  const [name, setName] = useState("");

  const getDetails = () => {
    console.log('im herere 12')
    console.log(Cookies.get("auth_token"));
    return http
      .get(API_ENDPOINTS.ACCOUNT_DETAILS, {
        headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` },
      })
      .then((response) => {
        // console.log(response, 'data');
        // setDetails(response.data);

        let detail = [];

        detail.push(response.data);
        console.log(detail, "array");
        console.log("response of account : ", response);
        setName(response?.data?.name);
        // setDetails(detail);
      })
      .catch((err) => {
        setName(null);
      });
  };

  useEffect(() => {
    getDetails()?.catch((err) => {});
  }, []);

  const value = {
    name,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
