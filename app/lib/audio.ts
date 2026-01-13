const DEFAULT_VOLUME = 0.5;

export const playFanfare = async () => {
  const audio = new Audio(
    "https://www.myinstants.com/media/sounds/06-caught-a-pokemon.mp3",
  );
  audio.volume = DEFAULT_VOLUME;
  await audio
    .play()
    .catch((e) => console.error("Autoplay bloqué :", e))
    .finally(() => setTimeout(() => audio.pause(), audio.duration * 1000));
};
