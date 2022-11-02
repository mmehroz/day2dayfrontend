import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { createContext, useState, useEffect } from "react";

export const userContext = createContext(null);

export const Provider = ({ children }) => {
  const [name, setName] = useState<string | null>("");
  const [hideHeader, setHideHeader] = useState(false);

  const getDetails = () => {

    return http
      .get(API_ENDPOINTS.ACCOUNT_DETAILS, {
        headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` },
      })
      .then((response) => {
        // (response, 'data');
        // setDetails(response.data);

        let detail = [];

        detail.push(response.data);

        setName(response?.data?.name);
        // setDetails(detail);
      })
      .catch((err) => {
        setName(null);
      });
  };

  const handleHideHeader = () => {
    setHideHeader(true);
  };

  const closeHideHeader = () => {
    setHideHeader(false);
  };

  useEffect(() => {
    getDetails()?.catch((err) => {});
  }, []);

  const value = {
    name,
    handleHideHeader,
    closeHideHeader,
    hideHeader,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
