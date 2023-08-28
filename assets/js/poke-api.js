
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}


/* Separar */
function convertSeparately(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    const abilitys = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    const [ability] = abilitys

    pokemon.abilitys = abilitys
    pokemon.ability = ability

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokeApi.createModal(pokemon)
}

pokeApi.getPokemonSeparately = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemonsSeparately = (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => [convertSeparately(jsonBody)])
        .then((pokemonsDetails) => pokemonsDetails)
}

// Adicione um evento de clique ao elemento de fechamento (x)
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('close')) {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.remove(); // Remove o modal do DOM
        }
    }
});

pokeApi.createModal = (pokemon) => {
    console.log('criando...')
    const content = document.getElementById('base-modal');
    content.innerHTML += `
        <div class="modal" id="modal">
            <div class="modal-content ${pokemon.type}">
                <span class="close">&times;</span>
                <div class="modal-body ${pokemon.type}">
                    <div class="modal-body-left">
                        <img class="modal-img" src="${pokemon.photo}" alt="pokemon">
                    </div>
                    <div class="modal-body-right">
                        <h1 class="modal-title">${pokemon.name}</h1>
                    </div>
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <ol class="types">
                        ${pokemon.abilitys.map((ability) => `<li class="ability ${ability}">${ability}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
}