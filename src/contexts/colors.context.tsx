import React, { createContext, useEffect, useState } from "react";

export const colorsContext = createContext(null);

const lightTheme = {
  backgroundColor: "#fafafa",
  textColor: "#1e293b",
  backgroundColorSecondary: "#f4f4f5",
  cardBg: "#fff",
  secondaryTextColor: "#1e293b",
  borderColor: "#4b5563",
  backgroundColorThird: "#d4d4d8",
};

const darkThemeUi = {
  backgroundColor: "#111314",
  textColor: "#fff",
  backgroundColorSecondary: "#292929",
  cardBg: "#292929",
  secondaryTextColor: "#1e293b",
  borderColor: "#d1d5db",
  backgroundColorThird: "#292929",
};

export const Provider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [theme, setTheme] = useState({
    backgroundColor: lightTheme.backgroundColor,
    textColor: lightTheme.textColor,
    backgroundColorSecondary: lightTheme.backgroundColorSecondary,
    cardBg: lightTheme.cardBg,
    secondaryTextColor: lightTheme.secondaryTextColor,
    borderColor: lightTheme.borderColor,
    backgroundColorThird: lightTheme.backgroundColorThird,
  });

  useEffect(() => {
    const res = localStorage.getItem("nightMode");
    if (!res) return;

    setDarkTheme(true);
  }, []);

  useEffect(() => {
    if (!darkTheme) {
      setTheme({
        backgroundColor: lightTheme.backgroundColor,
        textColor: lightTheme.textColor,
        backgroundColorSecondary: lightTheme.backgroundColorSecondary,
        cardBg: lightTheme.cardBg,
        secondaryTextColor: lightTheme.secondaryTextColor,
        borderColor: lightTheme.borderColor,
        backgroundColorThird: lightTheme.backgroundColorThird,
      });
      return;
    }

    setTheme({
      backgroundColor: darkThemeUi.backgroundColor,
      textColor: darkThemeUi.textColor,
      backgroundColorSecondary: darkThemeUi.backgroundColorSecondary,
      cardBg: darkThemeUi.cardBg,
      secondaryTextColor: darkThemeUi.secondaryTextColor,
      borderColor: darkThemeUi.borderColor,
      backgroundColorThird: darkThemeUi.backgroundColorThird,
    });
  }, [darkTheme]);

  const setNightMode = () => {
    setDarkTheme(true);
    localStorage.setItem("nightMode", "1");
    setDarkTheme(true);
  };

  const setLightMode = () => {
    setDarkTheme(false);
    localStorage.setItem("nightMode", "");
    setDarkTheme(false);
  };

  const val = {
    name: "haris",
    theme: theme,
    setNightMode,
    darkTheme,
    setLightMode,
  };

  return (
    <colorsContext.Provider value={val}>{children}</colorsContext.Provider>
  );
};
