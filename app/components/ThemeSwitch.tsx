import React from "react";
import { useTheme } from "next-themes";

import {
  ThemeToggler,
  type ThemeSelection,
  type Resolved,
} from "~/components/animate-ui/primitives/effects/theme-toggler";
import {
  Button,
  type ButtonProps,
} from "./animate-ui/components/buttons/button";
import { SunMoon } from "./animate-ui/icons/sun-moon";
import { Moon } from "./animate-ui/icons/moon";
import { Sun } from "./animate-ui/icons/sun";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "./animate-ui/components/base/tooltip";

interface ThemeSwitchProps extends Omit<ButtonProps, "onClick"> {}

export const ThemeSwitch = (props: ThemeSwitchProps) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeToggler
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={setTheme}
    >
      {({ effective, toggleTheme }) => {
        const nextTheme =
          effective === "dark"
            ? "light"
            : effective === "system"
              ? "dark"
              : "system";

        return (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button onClick={() => toggleTheme(nextTheme)} {...props}>
                  {effective === "system" ? (
                    <SunMoon animate />
                  ) : effective === "dark" ? (
                    <Moon animate />
                  ) : (
                    <Sun animate />
                  )}
                </Button>
              }
            />
            <TooltipPanel>
              Thème{" "}
              {theme === "light"
                ? "clair"
                : theme === "dark"
                  ? "sombre"
                  : "système"}
            </TooltipPanel>
          </Tooltip>
        );
      }}
    </ThemeToggler>
  );
};
