import { Link } from "react-router";
import { AnimateIcon } from "./animate-ui/icons/icon";
import { LayoutDashboard } from "./animate-ui/icons/layout-dashboard";
import { Button } from "./animate-ui/components/buttons/button";
import { Github } from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-5xl mx-auto p-4 sm:p-8 transition-all flex flex-col gap-4 sm:gap-8 min-h-screen">
    <div className="flex gap-4 items-center justify-between">
      <Link to="/">
        <AnimateIcon animateOnHover>
          <h1 className="text-xl sm:text-3xl font-bold flex gap-1 sm:gap-2 items-center transition-all">
            <LayoutDashboard className="size-5 sm:size-7 transition-all" />
            <span>
              Poker Planning <span className="text-primary">Pokemon</span>
            </span>
          </h1>
        </AnimateIcon>
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-6 sm:size-8 [&_svg]:size-4! sm:[&_svg]:size-6! transition-all [&_svg]:transition-all"
          asChild
        >
          <Link
            to="https://github.com/franck-boucher/poker-planning-pokemon"
            target="_blank"
          >
            <Github />
          </Link>
        </Button>
        <ThemeSwitch
          variant="ghost"
          size="icon"
          className="size-6 sm:size-8 [&_svg]:size-4! sm:[&_svg]:size-6! transition-all [&_svg]:transition-all"
        />
      </div>
    </div>
    {children}
  </div>
);
