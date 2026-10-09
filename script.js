const URL = "https://pokeapi.co/api/v2/pokemon";
async function obtenerPokemon(nombre) {
  try {
    const respuesta = await fetch(`${URL}/${nombre}`);
    const datos = await respuesta.json();
    console.log(datos);

    const tarjetaHTML = mostrarPokemonCard(datos);
    document.getElementById("resultadoBusqueda").innerHTML = tarjetaHTML;
  } catch (error) {
    console.log("personaje no encontrado", error.message);
  }
}
obtenerPokemon();

function mostrarPokemonCard(pokemon) {
  const ataque = pokemon.stats[1].base_stat;
  const defensa = pokemon.stats[2].base_stat;
  const imagenUrl = pokemon.sprites.front_default;

  return `
    <div class="pokemon-card">
        <img src="${imagenUrl}" alt="imagen de personaje ${pokemon.name}">
        <p class="name">${pokemon.name}</p>
        <p class="stats">Ataque: ${ataque}</p>
        <p class="stats">Defensa: ${defensa}</p>
        <button class="btn-favorito">Agregar a favoritos</button>
        <button class="btn-eliminar">Eliminar</button>
    </div>
  `;
}

obtenerPokemon("pikachu");