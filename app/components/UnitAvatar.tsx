import { cn, getPokemonSpriteUrl } from "~/lib/utils";
import { Sparkle } from "./animate-ui/icons/sparkle";

interface ParticipantAvatarProps {
  unitNumber: number;
  unitLvl: number;
  current?: boolean;
  withUnitNumber?: boolean;
  shiny?: boolean;
}
export const UnitAvatar = ({
  unitNumber,
  unitLvl,
  current,
  withUnitNumber,
  shiny,
}: ParticipantAvatarProps) => (
  <div className="size-16 sm:size-20 relative transition-all">
    <img
      src={getPokemonSpriteUrl(unitNumber, shiny)}
      className={cn(
        "rounded-full border p-1 bg-card",
        current && "border-primary/60",
      )}
    />
    {withUnitNumber && (
      <span
        className={cn(
          "text-xs text-foreground/80 border px-1 absolute right-0 top-0 rounded-sm bg-card",
          current && "border-primary/60",
        )}
      >
        #{unitNumber}
      </span>
    )}
    <span
      className={cn(
        "text-xs text-foreground/80 border px-1 absolute bottom-0 right-0 rounded-sm bg-card",
        current && "border-primary/60",
      )}
    >
      Niv. {unitLvl}
    </span>
    {shiny && (
      <span
        className={cn(
          "text-xs text-foreground/80 px-1 absolute top-0 left-0",
          current && "border-primary/60",
        )}
      >
        <Sparkle animate="fill" className="text-yellow-300" />
      </span>
    )}
  </div>
);
