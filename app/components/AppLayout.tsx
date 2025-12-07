import { Link, useLocation } from "react-router";
import { AnimateIcon } from "./animate-ui/icons/icon";
import { LayoutDashboard } from "./animate-ui/icons/layout-dashboard";
import { Button } from "./animate-ui/components/buttons/button";
import { Github, Link as LinkIcon } from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";
import { CopyButton } from "./animate-ui/components/buttons/copy";
import { useUrl } from "./useUrl";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "./animate-ui/components/base/tooltip";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const url = useUrl();
  const location = useLocation();
  return (
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
          {location.pathname.startsWith("/sizings/") && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <CopyButton
                    Icon={LinkIcon}
                    content={url}
                    variant="ghost"
                    className="size-6 sm:size-8 [&_svg]:size-4! sm:[&_svg]:size-6! transition-all [&_svg]:transition-all"
                  />
                }
              />
              <TooltipPanel side="left">Copier l'URL</TooltipPanel>
            </Tooltip>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="size-6 sm:size-8 [&_svg]:size-4! sm:[&_svg]:size-6! transition-all [&_svg]:transition-all"
            asChild
          >
            <Link
              to="https://github.com/franck-boucher/poker-planning-pokemon-v2"
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
};
