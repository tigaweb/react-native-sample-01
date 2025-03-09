import { Children, createContext, ReactNode, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

type ThemeContextType = {
  colorScheme: "light" | "dark";
  setColorScheme: (sheme: "light" | "dark") => void;
  theme: typeof Colors.light;
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

export const ThemeProvider = ({ children }: {children: ReactNode}) => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() ?? 'light'
  );

  const theme = colorScheme === 'dark'
    ? Colors.dark
    : Colors.light;

  return (
    <ThemeContext.Provider value={{
      colorScheme, setColorScheme, theme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}