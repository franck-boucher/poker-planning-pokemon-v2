import { api } from "convex/_generated/api";
import { redirect, useFetcher } from "react-router";
import { Button } from "~/components/animate-ui/components/buttons/button";
import { AnimateIcon } from "~/components/animate-ui/icons/icon";
import { Card } from "~/components/ui/card";
import { getPokemonSpriteUrl, randomNumber } from "~/lib/utils";
import type { Route } from "./+types/home";
import { getOrCreateUser } from "~/lib/userSession.server";
import { convexClient } from "~/lib/convexClient.server";
import { ArrowRight } from "~/components/animate-ui/icons/arrow-right";
import { LoaderCircle } from "~/components/animate-ui/icons/loader-circle";
import { Fade } from "~/components/animate-ui/primitives/effects/fade";
import { UnitCard } from "~/components/UnitCard";

export async function loader() {
  const entity1 = randomNumber(1, 150);
  const entity2 = randomNumber(1, 150);
  const entity3 = randomNumber(1, 150);
  return { entity1, entity2, entity3 };
}

export async function action({ request }: Route.ActionArgs) {
  const { user, cookie } = await getOrCreateUser(request);
  const sizingId = await convexClient.mutation(api.sizings.create, {
    createdBy: user._id,
  });
  return redirect(
    `/sizings/${sizingId}`,
    cookie ? { headers: { "Set-Cookie": cookie } } : undefined,
  );
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { entity1, entity2, entity3 } = loaderData;

  const fetcher = useFetcher();

  return (
    <>
      <Fade delay={100}>
        <Card
          className="flex flex-col gap-4 sm:gap-8 p-6 sm:p-16 transition-all bg-no-repeat bg-position-[right_-4.5rem_top] sm:bg-top-right"
          style={{ backgroundImage: 'url("/peter.432e3083.png")' }}
        >
          <h2 className="text-xl sm:text-3xl font-semibold transition-all pr-24">
            Crée une nouvelle partie et planifie comme un{" "}
            <span className="whitespace-nowrap">Maître Pokémon !</span>
          </h2>
          <fetcher.Form method="post">
            <AnimateIcon animateOnHover="out">
              <Button
                type="submit"
                size="lg"
                disabled={fetcher.state !== "idle"}
              >
                Nouvelle partie{" "}
                {fetcher.state === "idle" ? (
                  <ArrowRight />
                ) : (
                  <LoaderCircle animate="default" />
                )}
              </Button>
            </AnimateIcon>
          </fetcher.Form>
        </Card>
      </Fade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 transition-all">
        <Fade delay={200} asChild>
          <Card className="p-6 sm:p-10 gap-4 transition-all flex flex-col items-center justify-center">
            <div className="flex gap-4">
              <UnitCard dashed />
              <UnitCard disabled>
                <img src="/pokeball.png" />
              </UnitCard>
              <UnitCard disabled>5</UnitCard>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold transition-all text-center">
              Joue tes Poké-cartes durant ton{" "}
              <span className="whitespace-nowrap">planning !</span>
            </h3>
          </Card>
        </Fade>
        <Fade delay={200} asChild>
          <Card className="p-6 sm:p-10 gap-2 transition-all flex flex-col items-center justify-center">
            <div className="flex gap-2">
              <img
                src={getPokemonSpriteUrl(entity1)}
                className="size-18 sm:size-20 transition-all"
              />
              <img
                src={getPokemonSpriteUrl(entity2)}
                className="size-18 sm:size-20 transition-all"
              />
              <img
                src={getPokemonSpriteUrl(entity3)}
                className="size-18 sm:size-20 transition-all"
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold transition-all text-center">
              Avec un nouveau Pokémon aléatoire à chaque{" "}
              <span className="whitespace-nowrap">partie !</span>
            </h3>
          </Card>
        </Fade>
      </div>

      <Fade delay={300} asChild>
        <Card className="py-6 sm:py-10 gap-4 transition-all flex flex-col items-center justify-center overflow-hidden">
          <div className="flex justify-center">
            <img
              src={getPokemonSpriteUrl(1)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(2)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(3)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(4)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(5)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(6)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(7)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(8)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(9)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(10)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(11)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(12)}
              className="size-18 sm:size-20 transition-all"
            />
          </div>
          <h3 className="px-6 sm:px-10 text-xl sm:text-2xl font-semibold transition-all text-center">
            Collectione tous les Pokémon dans ton{" "}
            <span className="whitespace-nowrap">Pokedex !</span>
          </h3>
          <div className="flex justify-center">
            <img
              src={getPokemonSpriteUrl(13)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(14)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(15)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(16)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(17)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(18)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(19)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(20)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(21)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(22)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(23)}
              className="size-18 sm:size-20 transition-all"
            />
            <img
              src={getPokemonSpriteUrl(24)}
              className="size-18 sm:size-20 transition-all"
            />
          </div>
        </Card>
      </Fade>
    </>
  );
}
