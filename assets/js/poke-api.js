const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name.toUpperCase();

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other["official-artwork"].front_default;
  pokemon.icon = pokeDetail.sprites.front_default;

  pokemon.weight = pokeDetail.weight;
  pokemon.height = pokeDetail.height;

  pokemon.stats = pokeDetail.stats.map(stat => ({
    name: stat.stat.name,
    base_stat: stat.base_stat
  }));

  return pokemon;
}

function convertEvolutionToPokemon(evolutionDetail) {
  const evolutionPokemon = new Pokemon();

  const speciesUrl = evolutionDetail.species.url;
  evolutionPokemon.number = speciesUrl.split('/').slice(-2, -1)[0];
  evolutionPokemon.name = evolutionDetail.species.name.toUpperCase();

  evolutionPokemon.photo = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionPokemon.number}.png`;

  const details = evolutionDetail.evolution_details[0] || {};

  evolutionPokemon.method = details.trigger?.name.toUpperCase() || '';
  evolutionPokemon.min_level = details.min_level || null;
  evolutionPokemon.gender = details.gender || null;
  evolutionPokemon.held_item = details.held_item || null;
  evolutionPokemon.held_item_image = details.held_item && details.held_item.name ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.held_item.name}.png` : null;
  evolutionPokemon.item = details.item ? details.item.name : null;
  evolutionPokemon.item_image = details.item && details.item.name ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.item.name}.png` : null;
  evolutionPokemon.time_of_day = details.time_of_day || '';
  evolutionPokemon.turn_upside_down = details.turn_upside_down || false;
  evolutionPokemon.min_affection = details.min_affection || null;
  evolutionPokemon.min_beauty = details.min_beauty || null;
  evolutionPokemon.min_happiness = details.min_happiness || null;
  evolutionPokemon.needs_overworld_rain = details.needs_overworld_rain || false;
  evolutionPokemon.trade_species = details.trade_species || null;

  evolutionPokemon.trigger = details.trigger ? details.trigger.name : null;

  return evolutionPokemon;
}

pokeApi.getEvolutions = (speciesUrl) => {
  return $.get(speciesUrl)
    .then((speciesDetail) => $.get(speciesDetail.evolution_chain.url))
    .then((evolutionChain) => {
      const evolutions = [];
      let current = evolutionChain.chain;

      const collectEvolutions = (currentChain) => {
        if (currentChain) {
          evolutions.push(convertEvolutionToPokemon(currentChain));
          currentChain.evolves_to.forEach(collectEvolutions);
        }
      }
      collectEvolutions(current);
      return evolutions;
    });
};

pokeApi.getVariants = (speciesUrl) => {
  return $.get(speciesUrl).then((speciesDetail) => {
    const variantRequests = speciesDetail.varieties
      .filter((variety) => !variety.is_default)
      .map((variety) => {
        return $.get(variety.pokemon.url).then((pokeDetail) => {
          return convertPokeApiDetailToPokemon(pokeDetail);
        });
      });

    return $.when(...variantRequests).then((...variantResults) => {
      return variantResults;
    });
  });
};

pokeApi.getPokemonDetail = (pokemon) => {
  return $.get(pokemon.url)
    .then((pokeDetail) => {
      const pokemonData = convertPokeApiDetailToPokemon(pokeDetail);

      const evolutionPromise = pokeApi.getEvolutions(pokeDetail.species.url);
      const variantsPromise = pokeApi.getVariants(pokeDetail.species.url);

      return Promise.all([evolutionPromise, variantsPromise]).then(([evolutions, variants]) => {
        pokemonData.evolutions = evolutions;
        pokemonData.variants = variants;

        return pokemonData;
      });

    });
};

pokeApi.getPokemons = (offset = 0, limit = 10) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return $.get(url)
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => {
      const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
      return $.when(...detailRequests).then((...results) => results);
    });
};