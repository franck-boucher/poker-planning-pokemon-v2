import * as React from "react";
import type { Route } from "./+types/sizing";
import usePresence from "@convex-dev/presence/react";
import { api } from "convex/_generated/api";
import { convexClient } from "~/lib/convexClient.server";
import { data, redirect } from "react-router";
import { getOrCreateUser } from "~/lib/userSession.server";
import { pointCards, randomNumber } from "~/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { UnitCard } from "~/components/UnitCard";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/animate-ui/components/buttons/button";
import { Slide } from "~/components/animate-ui/primitives/effects/slide";
import { ShimmeringText } from "~/components/animate-ui/primitives/texts/shimmering";
import { Fade } from "~/components/animate-ui/primitives/effects/fade";
import { Zoom } from "~/components/animate-ui/primitives/effects/zoom";
import { UnitAvatar } from "~/components/UnitAvatar";
import Confetti from "react-confetti";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { user, cookie } = await getOrCreateUser(request);

  const sizing = await convexClient.query(api.sizings.getById, {
    id: params.sizingId,
  });
  if (!sizing)
    throw redirect(
      "/",
      cookie ? { headers: { "Set-Cookie": cookie } } : undefined,
    );

  const participants = await convexClient.query(
    api.participants.getBySizingId,
    { sizingId: sizing._id },
  );
  if (!participants.find((p) => p.userId === user._id)) {
    const shiny = randomNumber(1, 100) === 1;
    const unitNumber = randomNumber(1, 150);
    const unit = await convexClient.query(api.units.getByUserIdAndNumber, {
      userId: user._id,
      number: unitNumber,
    });
    let unitId = unit?._id;
    if (!unitId) {
      unitId = await convexClient.mutation(api.units.create, {
        userId: user._id,
        number: unitNumber,
        lvl: 5,
        shiny,
      });
    } else {
      const amount = randomNumber(1, 5);
      await convexClient.mutation(api.units.addLvl, { unitId, amount });
    }
    await convexClient.mutation(api.participants.add, {
      sizingId: sizing._id,
      userId: user._id,
      unit: unitId,
    });
  }
  return data(
    { userId: user._id },
    cookie ? { headers: { "Set-Cookie": cookie } } : undefined,
  );
}

const countdownDuration = 3;

export default function SizingPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { userId } = loaderData;
  const [countDownValue, setCountDownValue] = React.useState(countdownDuration);
  const sizing = useQuery(api.sizings.getById, { id: params.sizingId });
  const presenceState = usePresence(api.presence, params.sizingId, userId);
  const startCountdown = useMutation(api.sizings.startCountdown);
  const revealAll = useMutation(api.sizings.revealAll);
  const hideAll = useMutation(api.sizings.hideAll);
  const clearVotes = useMutation(api.participants.clearVotesBySizingId);

  const participants = useQuery(api.participants.getBySizingId, {
    sizingId: params.sizingId as any,
  });

  // ──────────────────────────────────────────────────────────────
  // Détection du moment où on passe en "revealed" + check consensus
  // ──────────────────────────────────────────────────────────────
  const prevStateRef = React.useRef(sizing?.state);

  const [showVictoryConfetti, setShowVictoryConfetti] = React.useState(false);

  React.useEffect(() => {
    if (!sizing || !participants) return;

    const currentState = sizing.state;
    const prevState = prevStateRef.current;

    if (prevState !== "revealed" && currentState === "revealed") {
      if (participants.length === 0) return;

      const votes = participants
        .map((p) => p.vote)
        .filter((v): v is string => v != null);

      if (votes.length === 0) {
        return;
      }

      const allSame = votes.every((v) => v === votes[0]);

      if (allSame) {
        const audio = new Audio(
          "https://www.myinstants.com/media/sounds/06-caught-a-pokemon.mp3",
        );

        audio.volume = 0.5;

        audio.play().catch((e) => console.log("Autoplay bloqué :", e));

        setShowVictoryConfetti(true);

        // Reset after 9 secondes
        setTimeout(() => {
          setShowVictoryConfetti(false);
          audio.pause();
        }, 9000);
      }
    }

    prevStateRef.current = currentState;
  }, [sizing?.state, participants]);

  React.useEffect(() => {
    if (sizing && sizing.state === "countdown") {
      let value = countdownDuration;
      const interval = setInterval(() => {
        value -= 1;
        setCountDownValue(value);
        if (value <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sizing]);

  React.useEffect(() => {
    if (sizing && sizing.state !== "countdown") {
      setCountDownValue(countdownDuration);
    }
  }, [sizing]);

  const toggleReveal = async () => {
    if (!sizing) return;
    if (sizing.state === "hidden") {
      await startCountdown({ sizingId: sizing._id });
      setTimeout(() => {
        revealAll({ sizingId: sizing._id });
      }, 3000);
    } else {
      clearVotes({ sizingId: sizing._id });
      hideAll({ sizingId: sizing._id });
    }
  };

  if (!sizing || !presenceState) {
    return (
      <Fade className="text-center text-2xl sm:text-4xl font-bold flex-1 items-center justify-center flex">
        <ShimmeringText text="Loading" />
      </Fade>
    );
  }

  const userPresence = presenceState.find((p) => p.userId === userId);
  const onlineOtherUsers = presenceState
    .filter((p) => {
      if (p.online) return true;
      const lastActive = p.lastDisconnected;
      const now = Date.now();
      return lastActive && now - lastActive < 30 * 60 * 1000; // 30minutes threshold
    })
    .filter((p) => p.userId !== userId);
  const upperHalf = Math.ceil((onlineOtherUsers.length + 1) / 2);
  const topRow = onlineOtherUsers.slice(0, upperHalf);
  const bottomRow = onlineOtherUsers.slice(upperHalf, onlineOtherUsers.length);
  if (userPresence) {
    bottomRow.splice(Math.floor(bottomRow.length / 2), 0, userPresence);
  }

  return (
    <Slide className="flex flex-col gap-4 sm:gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 sm:gap-8 justify-center transition-all h-[136px] sm:h-[152px]">
          {topRow.length === 0 && <WaitingParticipants />}
          {topRow.map((p) => (
            <Participant
              key={p.userId}
              currentUserId={userId}
              userId={p.userId}
              sizingId={params.sizingId}
              top
            />
          ))}
        </div>
        <Card className="flex justify-center items-center">
          <Button
            onClick={toggleReveal}
            disabled={sizing.state === "countdown"}
          >
            {sizing.state === "hidden"
              ? "Révéler"
              : sizing.state === "countdown" && countDownValue !== 0
                ? countDownValue
                : "Réinitialiser"}
          </Button>
        </Card>
        <div className="flex gap-4 sm:gap-8 justify-center transition-all h-[136px] sm:h-[152px]">
          {bottomRow.length === 0 && <WaitingParticipants />}
          {bottomRow.map((p) => (
            <Participant
              key={p.userId}
              currentUserId={userId}
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
              userId={userId}
              sizingId={params.sizingId}
            />
          ))}
        </div>
        <div className="flex gap-2 justify-center items-end">
          {pointCards.slice(6, 13).map((pointCard) => (
            <PointCard
              key={pointCard}
              pointCard={pointCard}
              userId={userId}
              sizingId={params.sizingId}
            />
          ))}
        </div>
      </div>

      {showVictoryConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            colors={["#ff0000", "#2a75bb", "#ffde00", "#ffffff", "#000000"]} // palette pokéball + pikachu
            numberOfPieces={250}
            gravity={0.15}
            recycle={false}
          />
        </div>
      )}
    </Slide>
  );
}

const WaitingParticipants = () => (
  <div className="h-full flex items-center justify-center italic text-muted-foreground text-sm">
    <ShimmeringText text="En attente de plus de joueurs..." />
  </div>
);

interface ParticipantProps {
  currentUserId: string;
  userId: string;
  sizingId: string;
  top?: boolean;
  bottom?: boolean;
}
const Participant = ({
  currentUserId,
  userId,
  sizingId,
  top,
  bottom,
}: ParticipantProps) => {
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
            {!!participant.vote && sizing.state !== "revealed" && (
              <img src="/pokeball.png" />
            )}
            {!!participant.vote &&
              sizing.state === "revealed" &&
              participant.vote}
          </UnitCard>
        )}
        <UnitAvatar
          unitNumber={unit.number}
          unitLvl={unit.lvl}
          shiny={unit.shiny}
          current={currentUserId === userId}
        />
        {top && (
          <UnitCard disabled dashed={!participant.vote}>
            {!!participant.vote && sizing.state !== "revealed" && (
              <img src="/pokeball.png" />
            )}
            {!!participant.vote &&
              sizing.state === "revealed" &&
              participant.vote}
          </UnitCard>
        )}
      </div>
    </Zoom>
  );
};

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
      disabled={sizing?.state === "revealed"}
    >
      {pointCard}
    </UnitCard>
  );
};
