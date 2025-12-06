import * as React from "react";
import { cn } from "~/lib/utils";
import {
  Button,
  type ButtonProps,
} from "./animate-ui/primitives/buttons/button";

type UnitCardProps = Omit<ButtonProps, "children" | "asChild"> & {
  children?: React.ReactNode;
  dashed?: boolean;
  selected?: boolean;
};

export const UnitCard = ({
  children,
  dashed,
  selected,
  disabled,
  className,
  ...props
}: UnitCardProps) => (
  <Button
    className={cn(
      "border-2 h-12 sm:h-16 w-8 sm:w-10 rounded-md font-bold select-none border-primary border-solid flex items-center justify-center text-md sm:text-lg transition-all bg-card hover:bg-card/90",
      dashed
        ? "border-dashed border-muted-foreground bg-transparent hover:bg-transparent"
        : "shadow-md",
      selected && "bg-primary text-primary-foreground hover:bg-primary/90",
      className,
    )}
    disabled={dashed || disabled}
    {...(dashed || disabled ? { whileHover: {} } : {})}
    {...props}
  >
    {children}
  </Button>
);
