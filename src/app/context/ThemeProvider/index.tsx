"use client";
import { ThemeProvider } from "styled-components";
import { theme, themeMode } from "@/config/theme";

const ThemeConfigProvider: FCC<{ currentTheme?: string }> = ({
  children,
  currentTheme = "light",
}) => {
  const _currentTheme = themeMode.includes(currentTheme)
    ? currentTheme
    : "light";
  return <ThemeProvider theme={theme[_currentTheme]}>{children}</ThemeProvider>;
};
export default ThemeConfigProvider;
