import { notFound } from "next/navigation";

import { getChatById, getCharactersByChatId } from "@/lib/db/queries";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const characters = await getCharactersByChatId({ chatId: id });
  const character = characters[0];

  if (!character) {
    return <div>No character found for this chat</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-6">
          {character.avatar && (
            <img
              src={character.avatar}
              alt={character.name}
              className="w-24 h-24 rounded-full mr-6"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{character.name}</h1>
            <div className="text-gray-400">
              {character.race} • {character.class}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-300">
                <div>Health: {character.health}</div>
                <div>Mana: {character.mana}</div>
                <div>Attack: {character.attack}</div>
                <div>Defense: {character.defense}</div>
                <div>Speed: {character.speed}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Equipment</h2>
            <div className="text-gray-300">
              <div>Weapon: {character.weapon}</div>
              <div>Symbol: {character.symbol}</div>
              <div>Companion: {character.companion}</div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg col-span-2">
            <h2 className="text-xl font-semibold text-white mb-3">
              Characteristics
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div>
                <h3 className="font-semibold">Physical Traits</h3>
                <p>{character.physicalTraits}</p>
              </div>
              <div>
                <h3 className="font-semibold">Strength</h3>
                <p>{character.strength}</p>
              </div>
              <div>
                <h3 className="font-semibold">Weakness</h3>
                <p>{character.weakness}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
