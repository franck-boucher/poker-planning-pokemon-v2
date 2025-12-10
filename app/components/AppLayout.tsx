import { Link, useLocation } from "react-router";
import { AnimateIcon } from "./animate-ui/icons/icon";
import { LayoutDashboard } from "./animate-ui/icons/layout-dashboard";
import { Button } from "./animate-ui/components/buttons/button";
import { Album, Github, Link as LinkIcon } from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";
import { CopyButton } from "./animate-ui/components/buttons/copy";
import { useRootLoaderData } from "../hooks/useRootLoaderData";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "./animate-ui/components/base/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./animate-ui/components/radix/popover";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { UnitAvatar } from "./UnitAvatar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { url, userId } = useRootLoaderData();
  const location = useLocation();

  const units = useQuery(
    api.units.getAllByUserId,
    userId ? { userId: userId } : "skip",
  );

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

        <div className="flex items-center gap-1 sm:gap-2 transition-all">
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
              <TooltipPanel>Copier l'URL</TooltipPanel>
            </Tooltip>
          )}

          {units && units.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <span>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 sm:size-8 [&_svg]:size-4! sm:[&_svg]:size-6! transition-all [&_svg]:transition-all"
                        >
                          <Album />
                        </Button>
                      }
                    />
                    <TooltipPanel>Pokédex</TooltipPanel>
                  </Tooltip>
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <p className="font-semibold text-xl text-center pb-4">
                  Pokédex
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 transition-all">
                  {units.map((unit) => (
                    <UnitAvatar
                      unitNumber={unit.number}
                      unitLvl={unit.lvl}
                      shiny={unit.shiny}
                      withUnitNumber
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Tooltip>
            <TooltipTrigger
              render={
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
              }
            />
            <TooltipPanel>GitHub</TooltipPanel>
          </Tooltip>

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
