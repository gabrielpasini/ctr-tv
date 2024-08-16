import Community from "./community";
import QuemSomos from "./team";
import Footer from "../components/footer/footer";
import { useEffect, useState } from "react";
import Axios from "../services/axios";
import Select, { OptionType } from "../components/select/select";

type Games = {
  rawGames: Game[];
  optionsGames: OptionType[];
};

type Game = {
  _id: string;
  name: string;
  coverUrl: string;
  releaseYear: number;
  tracks: Track[];
};

type Track = {
  _id: string;
  name: string;
  minimapUrl: string;
};

export default function Home() {
  const [games, setGames] = useState<Games>();
  const [optionTracks, setOptionTracks] = useState<OptionType[]>([
    {
      label: "",
      value: "",
    },
  ]);
  const [selectedGame, setSelectedGame] = useState<Game>();
  const [selectedTrack, setSelectedTrack] = useState<Track>();

  useEffect(() => {
    getAllGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      const tracks = [
        {
          value: "",
          label: "",
        },
        ...selectedGame?.tracks.map((track) => ({
          value: track._id,
          label: track.name,
        })),
      ];
      setOptionTracks(tracks);
    }
  }, [selectedGame]);

  async function getAllGames() {
    const {
      data: { games },
    }: any = await Axios.get("game/get-all");
    const optionsGames = [
      {
        name: "",
        _id: "",
      },
      ...games.map((game: Game) => ({
        value: game._id,
        label: `${game.name} - ${game.releaseYear}`,
      })),
    ];
    setGames({ rawGames: games, optionsGames });
  }

  function onGameChange(gameId: string) {
    const game = games?.rawGames.find((game) => game._id === gameId);
    setSelectedGame(game);
  }

  return (
    <div className="min-h-full">
      <div className="bg-light shadow mb-14 overflow-hidden">
        <div className="px-4 py-5 bg-light md:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 md:col-span-4">
              {games && games.rawGames.length > 0 && (
                <Select
                  label="Jogo"
                  id="game"
                  name="game"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:border-dark-blue md:text-sm"
                  options={games.optionsGames}
                  onFieldChange={(event) => onGameChange(event.target.value)}
                  fieldValue={selectedGame?._id}
                  error={false}
                  errorMessage={""}
                />
              )}
              {optionTracks.length > 0 && (
                <Select
                  label="Pista"
                  id="track"
                  name="track"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:border-dark-blue md:text-sm"
                  options={optionTracks}
                  onFieldChange={(event) => setSelectedTrack(event.target)}
                  fieldValue={selectedTrack?._id}
                  error={false}
                  errorMessage={""}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Community />
      <QuemSomos />
      <Footer />
    </div>
  );
}
