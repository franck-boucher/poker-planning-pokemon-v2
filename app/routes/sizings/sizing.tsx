import { useUser } from "~/components/useUser";
import type { Route } from "./+types/sizing";
import usePresence from "@convex-dev/presence/react";
import { api } from "convex/_generated/api";
import { convexClient } from "~/lib/convexClient.server";
import { redirect } from "react-router";
import { requireUserId } from "~/lib/userSession.server";
import { cn, getPokemonSpriteUrl, pointCards, randomNumber } from "~/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { UnitCard } from "~/components/UnitCard";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/animate-ui/components/buttons/button";
import { Slide } from "~/components/animate-ui/primitives/effects/slide";
import { ShimmeringText } from "~/components/animate-ui/primitives/texts/shimmering";
import { Fade } from "~/components/animate-ui/primitives/effects/fade";
import { Zoom } from "~/components/animate-ui/primitives/effects/zoom";

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = await requireUserId(request);

  const sizing = await convexClient.query(api.sizings.getById, {
    id: params.sizingId,
  });
  if (!sizing) throw redirect("/");

  const participants = await convexClient.query(
    api.participants.getBySizingId,
    { sizingId: sizing._id },
  );
  if (!participants.find((p) => p.userId === userId)) {
    const shiny = randomNumber(1, 100) === 1;
    const unitNumber = randomNumber(1, 150);
    const unit = await convexClient.query(api.units.getByUserIdAndNumber, {
      userId,
      number: unitNumber,
    });
    let unitId = unit?._id;
    if (!unitId) {
      unitId = await convexClient.mutation(api.units.create, {
        userId,
        number: unitNumber,
        lvl: 5,
        shiny,
      });
    }
    await convexClient.mutation(api.participants.add, {
      sizingId: sizing._id,
      userId,
      unit: unitId,
    });
  }
}

export default function SizingPage({ params }: Route.ComponentProps) {
  const user = useUser();
  const sizing = useQuery(api.sizings.getById, { id: params.sizingId });
  const presenceState = usePresence(api.presence, params.sizingId, user._id);
  const revealAll = useMutation(api.sizings.revealAll);
  const hideAll = useMutation(api.sizings.hideAll);
  const clearVotes = useMutation(api.participants.clearVotesBySizingId);

  const toggleReveal = () => {
    if (!sizing) return;
    if (!sizing.revealed) revealAll({ sizingId: sizing._id });
    else {
      clearVotes({ sizingId: sizing._id });
      hideAll({ sizingId: sizing._id });
    }
  };

  if (!sizing || !presenceState) {
    return (
      <Fade className="text-center text-4xl font-bold">
        <ShimmeringText text="Loading" />
      </Fade>
    );
  }

  const onlineUsers = presenceState.filter((p) => p.online);
  const topRow =
    onlineUsers.length > 1
      ? onlineUsers.slice(0, Math.ceil(onlineUsers.length / 2))
      : [];
  const bottomRow =
    onlineUsers.length > 1
      ? onlineUsers.slice(Math.ceil(onlineUsers.length / 2), onlineUsers.length)
      : onlineUsers;

  return (
    <Slide className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-8 justify-center transition-all h-[136px] sm:h-[152px]">
          {topRow.length === 0 && <WaitingParticipants />}
          {topRow.map((p) => (
            <Participant
              key={p.userId}
              userId={p.userId}
              sizingId={params.sizingId}
              top
            />
          ))}
        </div>
        <Card className="flex justify-center items-center">
          <Button onClick={toggleReveal}>
            {sizing.revealed ? "Réinitialiser" : "Révéler"}
          </Button>
        </Card>
        <div className="flex gap-8 justify-center transition-all h-[136px] sm:h-[152px]">
          {bottomRow.length === 0 && <WaitingParticipants />}
          {bottomRow.map((p) => (
            <Participant
              key={p.userId}
              userId={p.userId}
              sizingId={params.sizingId}
              bottom
            />
          ))}
        </div>
      </div>

      <div className="flex gap-1 max-sm:flex-col justify-center transition-all">
        <div className="flex gap-2 justify-center items-end">
          {pointCards.slice(0, 6).map((pointCard) => (
            <PointCard
              key={pointCard}
              pointCard={pointCard}
              userId={user._id}
              sizingId={params.sizingId}
            />
          ))}
        </div>
        <div className="flex gap-2 justify-center items-end">
          {pointCards.slice(6, 13).map((pointCard) => (
            <PointCard
              key={pointCard}
              pointCard={pointCard}
              userId={user._id}
              sizingId={params.sizingId}
            />
          ))}
        </div>
      </div>
    </Slide>
  );
}

const WaitingParticipants = () => (
  <div className="h-full flex items-center justify-center italic text-muted-foreground text-sm">
    <ShimmeringText text="En attente de plus de joueurs..." />
  </div>
);

interface ParticipantProps {
  userId: string;
  sizingId: string;
  top?: boolean;
  bottom?: boolean;
}
const Participant = ({ userId, sizingId, top, bottom }: ParticipantProps) => {
  const user = useUser();
  const sizing = useQuery(api.sizings.getById, { id: sizingId });
  const participant = useQuery(api.participants.getBySizingIdAndUserId, {
    userId,
    sizingId,
  });
  const unit = useQuery(
    api.units.getById,
    participant ? { id: participant.unit } : "skip",
  );

  if (!participant || !unit || !sizing) return null;

  return (
    <Zoom>
      <div className="flex flex-col gap-2 items-center">
        {bottom && (
          <UnitCard disabled dashed={!participant.vote}>
            {!!participant.vote && !sizing.revealed && (
              <img src="/pokeball.png" />
            )}
            {!!participant.vote && sizing.revealed && participant.vote}
          </UnitCard>
        )}
        <ParticipantAvatar
          unitNumber={unit.number}
          unitLvl={unit.lvl}
          current={user._id === userId}
        />
        {top && (
          <UnitCard disabled dashed={!participant.vote}>
            {!!participant.vote && !sizing.revealed && (
              <img src="/pokeball.png" />
            )}
            {!!participant.vote && sizing.revealed && participant.vote}
          </UnitCard>
        )}
      </div>
    </Zoom>
  );
};

interface ParticipantAvatarProps {
  unitNumber: number;
  unitLvl: number;
  current?: boolean;
  withUnitNumber?: boolean;
}
const ParticipantAvatar = ({
  unitNumber,
  unitLvl,
  current,
  withUnitNumber,
}: ParticipantAvatarProps) => (
  <div className="size-16 sm:size-20 relative transition-all">
    <img
      src={getPokemonSpriteUrl(unitNumber)}
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
  </div>
);

interface PointCardProps {
  pointCard: string;
  userId: string;
  sizingId: string;
}
const PointCard = ({ pointCard, userId, sizingId }: PointCardProps) => {
  const sizing = useQuery(api.sizings.getById, { id: sizingId });
  const selfParticipant = useQuery(api.participants.getBySizingIdAndUserId, {
    userId: userId,
    sizingId: sizingId,
  });
  const setVote = useMutation(api.participants.setVote);
  const selected = selfParticipant?.vote === pointCard;
  return (
    <UnitCard
      selected={selected}
      className={selected ? "mb-3" : "mt-3"}
      onClick={() => {
        if (selfParticipant) {
          setVote({
            participantId: selfParticipant._id,
            vote: selected ? null : pointCard,
          });
        }
      }}
      disabled={sizing?.revealed}
    >
      {pointCard}
    </UnitCard>
  );
};
