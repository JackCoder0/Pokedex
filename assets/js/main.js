$(document).ready(function () {
  const $pokemonList = $('#pokemonList');
  const $loadMoreButton = $('#loadMoreButton');
  const $cardPokemon = $('.card-pokemon');

  const maxRecords = 1025;
  const limit = 50;
  let offset = 0;

  function loadPokemonByName(pokemonName) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

    pokeApi.getPokemonDetail({ url })
      .then((pokemon) => {
        if (pokemon) {
          showPokemonModal(pokemon);
        } else {
          alert('Pokémon não encontrado!');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Erro ao buscar o Pokémon. Verifique se o nome está correto!');
      });
  }

  $('#searchPokemon').keydown(function (event) {
    const pokemonName = $('#searchPokemon').val();

    if (event.key === "Enter") {
      event.preventDefault();
      if (pokemonName) {
        loadPokemonByName(pokemonName);
      } else {
        alert('Por favor, digite o nome de um Pokémon!');
      }
    }
  });

  function convertWeightToKilograms(weight) {
    const kilograms = weight / 10;
    return kilograms;
  }

  function convertHeightToMeters(height) {
    const meters = height / 10;
    return meters;
  }

  function statusClass(status) {
    if (status < 30) {
      return "30";
    } else if (status >= 30 && status < 60) {
      return "40";
    } else if (status >= 60 && status < 120) {
      return "100";
    } else if (status >= 120 && status < 200) {
      return "140";
    } else if (status >= 180 && status < 300) {
      return "200";
    } else {
      return "";
    }
  }

  function createStatusBar(statName, statValue) {
    return `
    <div class="pt-4 w-100">
      <div class="align-items-center row">
        <div class="col-1">
          <img class="sts-icon" src="/assets/img/stats/${statName}.png">
        </div>
        <div class="col-1">
          <span class="fs-5 text-white fw-semibold">
            ${statValue}
          </span>
        </div>
        <div class="col">
          <div class="status-bar-box">
            <div class="status-bar-${statusClass(statValue)}" style="width: ${statValue / 2}%;" title="${statName}">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  }

  function convertPokemonToLi(pokemon) {
    const firstType = pokemon.types[0];
    const weightInKg = convertWeightToKilograms(pokemon.weight);
    const heightInMeters = convertHeightToMeters(pokemon.height);

    return `
    <div class="container card-pokemon bg-img col mt-5 p-3" data-type="${firstType}" id="pokemon-${pokemon.number}">
      <span>#${pokemon.number}</span>
      <h3>• ${pokemon.name} •</h3>
      <img class="pkm-img" src="${pokemon.photo}">
      <div class="pkm-infos">
        <div class="label-hw d-flex flex-column align-items-center justify-content-center">
          <p class="d-flex align-items-center m-0 hw-text">
            <iconify-icon icon="material-symbols:height" width="30" height="30"></iconify-icon>
            Altura
          </p>
          <span class="hw">${heightInMeters.toFixed(1)} M</span>
        </div>
        <div class="pkm-types">
          ${pokemon.types.map((type) => `<img class="" src="/assets/img/types/${type}.png">`).join('')}
        </div>
        <div class="label-hw d-flex flex-column align-items-center justify-content-center">
          <p class="d-flex align-items-center m-0 hw-text">
            <iconify-icon icon="material-symbols:weight-outline" width="30" height="30"></iconify-icon>
            Peso
          </p>
          <span class="hw">${weightInKg.toFixed(1)} KG</span>
        </div>
      </div>
    </div>
        `;
  }

  function setGradientColor($element, tipoPrincipal, $iconElement) {
    let gradientColor;
    switch (tipoPrincipal) {
      case 'normal':
        gradientColor = 'rgb(168, 168, 120)';
        break;
      case 'fighting':
        gradientColor = 'rgb(192, 48, 40)';
        break;
      case 'flying':
        gradientColor = 'rgb(168, 144, 240)';
        break;
      case 'poison':
        gradientColor = 'rgb(160, 64, 160)';
        break;
      case 'ground':
        gradientColor = 'rgb(224, 192, 104)';
        break;
      case 'rock':
        gradientColor = 'rgb(184, 160, 56)';
        break;
      case 'bug':
        gradientColor = 'rgb(168, 184, 32)';
        break;
      case 'ghost':
        gradientColor = 'rgb(112, 88, 152)';
        break;
      case 'steel':
        gradientColor = 'rgb(184, 184, 208)';
        break;
      case 'fire':
        gradientColor = 'rgb(240, 128, 48)';
        break;
      case 'water':
        gradientColor = 'rgb(104, 144, 240)';
        break;
      case 'grass':
        gradientColor = 'rgb(120, 200, 80)';
        break;
      case 'electric':
        gradientColor = 'rgb(248, 208, 48)';
        break;
      case 'psychic':
        gradientColor = 'rgb(248, 88, 136)';
        break;
      case 'ice':
        gradientColor = 'rgb(152, 216, 216)';
        break;
      case 'dragon':
        gradientColor = 'rgb(112, 56, 248)';
        break;
      case 'dark':
        gradientColor = 'rgb(112, 88, 72)';
        break;
      case 'fairy':
        gradientColor = 'rgb(238, 153, 172)';
        break;
      default:
        gradientColor = 'rgb(0, 0, 0)'; // Cor padrão
        break;
    }

    $element.css('background-image', `url(/assets/img/half-pokeball.svg), radial-gradient(80% 80% at 50% bottom, ${gradientColor}, rgb(6, 14, 32))`);

    if ($iconElement) {
      $iconElement.css('background-image', `radial-gradient(circle, ${gradientColor}, rgb(6, 14, 32))`);
    }
  }

  function getGradientColor(tipoPrincipal) {
    let gradientColor;
    switch (tipoPrincipal) {
      case 'normal':
        gradientColor = 'rgb(168, 168, 120)';
        break;
      case 'fighting':
        gradientColor = 'rgb(192, 48, 40)';
        break;
      case 'flying':
        gradientColor = 'rgb(168, 144, 240)';
        break;
      case 'poison':
        gradientColor = 'rgb(160, 64, 160)';
        break;
      case 'ground':
        gradientColor = 'rgb(224, 192, 104)';
        break;
      case 'rock':
        gradientColor = 'rgb(184, 160, 56)';
        break;
      case 'bug':
        gradientColor = 'rgb(168, 184, 32)';
        break;
      case 'ghost':
        gradientColor = 'rgb(112, 88, 152)';
        break;
      case 'steel':
        gradientColor = 'rgb(184, 184, 208)';
        break;
      case 'fire':
        gradientColor = 'rgb(240, 128, 48)';
        break;
      case 'water':
        gradientColor = 'rgb(104, 144, 240)';
        break;
      case 'grass':
        gradientColor = 'rgb(120, 200, 80)';
        break;
      case 'electric':
        gradientColor = 'rgb(248, 208, 48)';
        break;
      case 'psychic':
        gradientColor = 'rgb(248, 88, 136)';
        break;
      case 'ice':
        gradientColor = 'rgb(152, 216, 216)';
        break;
      case 'dragon':
        gradientColor = 'rgb(112, 56, 248)';
        break;
      case 'dark':
        gradientColor = 'rgb(112, 88, 72)';
        break;
      case 'fairy':
        gradientColor = 'rgb(238, 153, 172)';
        break;
      default:
        gradientColor = 'rgb(0, 0, 0)'; // Cor padrão
        break;
    }
    return gradientColor;
  }

  function showPokemonModal(pokemon) {
    const firstType = pokemon.types[0];
    const gradientColor = getGradientColor(firstType);
    const weightInKg = convertWeightToKilograms(pokemon.weight);
    const heightInMeters = convertHeightToMeters(pokemon.height);
    const statusBars = pokemon.stats.map(stat => createStatusBar(stat.name, stat.base_stat)).join('');

    const evolutions = pokemon.evolutions.map(evo => {
      const method = evo.method || '';
      const minLevel = evo.min_level ? `Lv ${evo.min_level}` : '';
      const methodDisplay = method != ''
        ? `<iconify-icon icon="material-symbols:arrow-right-alt-rounded" width="30" height="30"></iconify-icon>` : method;
      const methodClass = (methodDisplay || minLevel) ? '' : 'd-none';

      const levelUpDetails = [];
      if (evo.min_affection) levelUpDetails.push(`<iconify-icon icon="uil:heart" width="30" height="30"></iconify-icon>${evo.min_affection}`);
      if (evo.min_beauty) levelUpDetails.push(`<iconify-icon icon="solar:heart-shine-broken" width="30" height="30"></iconify-icon>${evo.min_beauty}`);
      if (evo.min_happiness) levelUpDetails.push(`<iconify-icon icon="uil:smile" width="30" height="30"></iconify-icon>${evo.min_happiness}`);
      if (evo.min_level) levelUpDetails.push(`Lvl: ${evo.min_level}`);
      if (evo.method === 'TRADE' && evo.held_item == null) levelUpDetails.push('Troca');
      if (evo.method != 'TRADE' && evo.method != 'USE-ITEM' && evo.method != 'LEVEL-UP') levelUpDetails.push(evo.method);
      if (evo.needs_overworld_rain) levelUpDetails.push('Needs Overworld Rain');
      if (evo.time_of_day) levelUpDetails.push(`<iconify-icon icon="mingcute:time-line" width="30" height="30"></iconify-icon>${evo.time_of_day}`);
      if (evo.trade_species) levelUpDetails.push(`Trade Species: ${evo.trade_species}`);
      if (evo.turn_upside_down) levelUpDetails.push('Turn Upside Down');
      if (evo.item) levelUpDetails.push(`Usar <img src="${evo.item_image}">`);
      if (evo.held_item) levelUpDetails.push(`Troca <img src="${evo.held_item_image}">`);

      const evolutionDetails = levelUpDetails.length > 0 ? `<div class="evolution-details">${levelUpDetails.join('<br>')}</div>` : '';

      return `
        <div class="evolution-method ${methodClass}">
          ${methodDisplay}
          <span class="hwm">${evolutionDetails}</span>
        </div>
        <div class="evolution">
          <img src="${evo.photo}">
          <span class="evolution-name">${evo.name}</span>
        </div>
        `;
    }).join('');

    const variants = pokemon.variants.map(variant => {
      return `
            <div class="variant">
                <img src="${variant.photo}" alt="${variant.name}">
                <span class="variant-name">${variant.name}</span>
            </div>
        `;
    }).join('');

    const modalBody = `
          <div class="card-pokemon bg-img p-3" data-type="${firstType}" id="pokemon-${pokemon.number}">
            <h3>${pokemon.name}</h3>
            <img class="pkm-img" src="${pokemon.photo}">
            <div class="pkm-infos">
              <div class="label-hw d-flex flex-column align-items-center justify-content-center">
                <p class="d-flex align-items-center m-0 hw-text">
                  <iconify-icon icon="material-symbols:height" width="30" height="30"></iconify-icon>
                  Altura
                </p>
                <span class="hwm">${heightInMeters.toFixed(1)} M</span>
              </div>
              <div class="d-flex align-items-center justify-content-center w-100 gap-3 px-3">
                ${pokemon.types.map((type) => `<img class="icon-type ${type}" src="/assets/img/icons/${type}.svg">`).join('')}
              </div>
              <div class="label-hw d-flex flex-column align-items-center justify-content-center">
                <p class="d-flex align-items-center m-0 hw-text">
                  <iconify-icon icon="material-symbols:weight-outline" width="30" height="30"></iconify-icon>
                  Peso
                </p>
                <span class="hwm">${weightInKg.toFixed(1)} KG</span>
              </div>
            </div>

            <div class="w-100">
              ${statusBars}
            </div>

            ${pokemon.evolutions && pokemon.evolutions.length > 0 ? `
            <h4 class="evolution-title">Evoluções</h4>
            <div class="evolutions w-100">
              ${evolutions}
            </div>` : ''}

            ${pokemon.variants && pokemon.variants.length > 0 ? `
            <h4 class="variant-title">Variantes</h4>
            <div class="variants w-100">
              ${variants}
            </div>` : ''}

          </div>
          `;

    $('#pokemonModalBody').html(modalBody);
    $('#pokemonModal .modal-body').css('background-image', `url(/assets/img/half-pokeball.svg), radial-gradient(80% 80% at 50% bottom, ${gradientColor}, rgba(6, 14, 32, 1))`);
    $('#pokemonModal').modal('show');
  }

  function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
      const newHtml = pokemons.map(convertPokemonToLi).join('');
      $pokemonList.append(newHtml);

      pokemons.forEach((pokemon) => {
        const $cardElement = $(`#pokemon-${pokemon.number}`);
        const $iconElement = $(`#pkm-icon-${pokemon.number}`);
        if ($cardElement.length) {
          setGradientColor($cardElement, pokemon.types[0], $iconElement);
        }
      });

      pokemons.forEach((pokemon) => {
        const selector = `#pokemon-${pokemon.number}`;
        $(selector).on('click', function () {
          showPokemonModal(pokemon);
        });
      });
    });
  }
  loadPokemonItens(offset, limit);

  $loadMoreButton.on('click', function () {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItens(offset, newLimit);

      $loadMoreButton.remove();
    } else {
      loadPokemonItens(offset, limit);
    }
  });

});