const URL = "https://pokeapi.co/api/v2/pokemon";

async function obtenerPokemon(nombre) {
  try {
    const respuesta = await fetch(`${URL}/${nombre}`);

    if (!respuesta.ok) {
      throw new Error("Pokémon no encontrado");
    }

    const datos = await respuesta.json();
    console.log(datos);

    pokemonActual = datos;

    const tarjetaHTML = mostrarPokemonCard(datos);
    document.getElementById("resultadoBusqueda").innerHTML = tarjetaHTML;
  } catch (error) {
    console.log("Pokémon no encontrado", error.message);
    document.getElementById("resultadoBusqueda").innerHTML =
      `<p style="color:red">${error.message}</p>`;
  }
}


/* Tarea 3: Crear la tarjeta del Pokémon (Evelyn) */

function mostrarPokemonCard(pokemon, esFavorito = false) {
  const ataque = pokemon.stats
    ? pokemon.stats[1].base_stat
    : pokemon.ataque;

  const defensa = pokemon.stats
    ? pokemon.stats[2].base_stat
    : pokemon.defensa;

  const imagenUrl = pokemon.sprites
    ? pokemon.sprites.front_default
    : pokemon.imagenUrl;

  const id = pokemon.id;

  return `
    <div class="pokemon-card" data-id="${id}">
        <img src="${imagenUrl}" alt="imagen de personaje ${pokemon.name}">
        <p class="name">${pokemon.name}</p>
        <p class="stats">Ataque: ${ataque}</p>
        <p class="stats">Defensa: ${defensa}</p>
        ${
          !esFavorito
            ? `<button class="btn-favorito" onclick="agregarFavoritoActual()">Agregar a favoritos</button>`
            : `<button class="btn-eliminar" onclick="eliminarFavorito(${id})">Eliminar</button>`
        }
    </div>
  `;
}


/* TAREA 4: FUNCIONES DE LOCALSTORAGE */

// 2. Recuperar los favoritos
function obtenerFavoritos() {
  const favoritos = localStorage.getItem("favoritos");

  // Manejamos el caso en que no haya nada guardado (null) devolviendo un array vacío
  return favoritos ? JSON.parse(favoritos) : [];
}


// 1. Guardar un Pokémon en favoritos
function guardarFavorito(pokemon) {
  const favoritos = obtenerFavoritos();

  // Evitar guardar el mismo Pokémon dos veces
  const existe = favoritos.some((fav) => fav.id === pokemon.id);

  if (existe) {
    alert(`${pokemon.name} ya está en tus favoritos.`);
    return;
  }

  // Guardamos solo los datos necesarios para renderizar la tarjeta más tarde
  const nuevoPokemon = {
    id: pokemon.id,
    name: pokemon.name,
    ataque: pokemon.stats[1].base_stat,
    defensa: pokemon.stats[2].base_stat,
    imagenUrl: pokemon.sprites.front_default
  };

  favoritos.push(nuevoPokemon);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  // Volvemos a renderizar la lista en el DOM
  mostrarListaFavoritos();
}


// 3. Eliminar un Pokémon de favoritos
function eliminarFavorito(id) {
  let favoritos = obtenerFavoritos();

  // Filtramos el array para conservar solo los que NO coincidan con el ID
  favoritos = favoritos.filter((fav) => fav.id !== id);

  // Guardamos el nuevo array en localStorage
  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  // Actualizamos el DOM
  mostrarListaFavoritos();
}


/* RENDERIZADO Y INTERFAZ (DOM) */

// Muestra en el DOM todos los Pokémon guardados
function mostrarListaFavoritos() {
  const favoritos = obtenerFavoritos();
  const contenedor = document.getElementById("listaFavoritos");

  if (favoritos.length === 0) {
    contenedor.innerHTML = "<p>No tienes favoritos guardados.</p>";
    return;
  }

  contenedor.innerHTML = favoritos
    .map((fav) => mostrarPokemonCard(fav, true))
    .join("");
}


/* Tarea 5 HEILEN PARRA */
/* LO QUE HAREMOS ES RECUPERAR LOS DATOS DE FAVORITOS */

// cuando la pagina cargue esto  es lo que hara: recuperar los favs > convertirlos de json a array >
// recorre el array y crea una tarjeta > y añande esto a el contendor de lista fav

function cargarfavoritos() {
  mostrarListaFavoritos();
}


/* Función para agregar el Pokémon buscado a favoritos */

let pokemonActual = null;

function agregarFavoritoActual() {
  if (pokemonActual) {
    guardarFavorito(pokemonActual);
  }
}


/* EVENTOS Y INICIALIZACIÓN */

document.getElementById("btnBuscar").addEventListener("click", () => {
  const input = document.getElementById("inputPokemon").value.trim();

  if (input) {
    obtenerPokemon(input.toLowerCase());
  }
});

document.getElementById("btnLimpiar").addEventListener("click", () => {
  document.getElementById("inputPokemon").value = "";
  document.getElementById("resultadoBusqueda").innerHTML = "";
  pokemonActual = null;
});


// Cargar favoritos al abrir la página y mostrar Pikachu por defecto
cargarfavoritos();
obtenerPokemon("pikachu");
