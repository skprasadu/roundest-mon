import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import React, { useState } from 'react';

const buttonClass =
  'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

const extractUrl = (pokemon: any) => {
  return pokemon.data?.sprites.front_default || '';
};

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    //todo: fire mutation to persist changes

    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center relative">
      <div className="text-2xl text-center">Which Pokemon is Rounder</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between item-center max-w-2xl">
        <div className="w-64 h-64 flex flex-col ">
          <img src={extractUrl(firstPokemon)} className="w-full" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {firstPokemon.data?.name}
          </div>
          <button
            className={buttonClass}
            onClick={() => voteForRoundest(first)}
          >
            Rounder
          </button>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col">
          <img src={extractUrl(secondPokemon)} className="w-full" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
          <button
            className={buttonClass}
            onClick={() => voteForRoundest(second)}
          >
            Rounder
          </button>
        </div>
        <div className="p-2" />
      </div>
    </div>
  );
};

export default Home;
