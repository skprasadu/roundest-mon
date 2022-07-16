import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';

const buttonClass =
  'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }]);

  const voteMutation = trpc.useMutation(['cast-vote']);

  const voteForRoundest = (selected: number) => {
    //todo: fire mutation to persist changes
    if (selected === first) {
      voteMutation.mutate({ votedForId: first, votedAgainstId: second });
    } else {
      voteMutation.mutate({ votedForId: second, votedAgainstId: first });
    }

    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center relative">
      <div className="text-2xl text-center">Which Pokemon is Rounder</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between item-center max-w-2xl">
        {dataLoaded && (
          <>
            <PokemonListing
              pokemon={firstPokemon.data}
              vote={() => voteForRoundest(first)}
            />
            <div className="p-8">Vs</div>
            <PokemonListing
              pokemon={secondPokemon.data}
              vote={() => voteForRoundest(second)}
            />
          </>
        )}
        {!dataLoaded && <img src="/rings.svg" className="w-48" />}
      </div>
      <div className="p-2" />
      <div className="absolute bottom-0 w-full text-xs text-center pb-0">
        <a href="https://github.com/skprasadu/roundest-mon">Github</a>
        <span className="p-4">{'-'}</span>
        <Link href="/results">
          <a>Results</a>
        </Link>
        <span className="p-4">{'-'}</span>
      </div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col ">
      <Image
        src={props.pokemon.spriteUrl || ''}
        width={256}
        height={256}
        layout="fixed"
        className="animate-fade-in"
      />

      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={buttonClass} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};

export default Home;
