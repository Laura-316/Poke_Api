const URL = "https://pokeapi.co/api/v2/pokemon";
async function obtenerPokemon(nombre) {
  try {
    const respuesta = await fetch(`${URL}/${nombre}`);
    const datos = await respuesta.json();
    console.log(datos);

    const tarjetaHTML = mostrarPokemonCard(datos);
    document.getElementById("resultadoBusqueda").innerHTML = tarjetaHTML;
  } catch (error) {
    console.log("Pokémon no encontrado", error.message);
  }
}
obtenerPokemon();



/* Tarea 3: Crear la tarjeta del Pokémon (Evelyn)*/
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

/* ------------------------ */





//*Tarea 5 HEILEN PARRA //
//LO QUE HAREMOS ES RECUPERAR LOS DATOS DE FAVORITOS//

const listaFavoritos = document.getElementById("listaFavoritos");


//cuando la pagina cargue esto  es lo que hara: recuperar los favs > convertirlos de json a array > 
// recorre el array y crea una tarjeta > y añande esto a el contendor de lista fav

function cargarfavoritos (){
const favoritos = obtenerFavoritos(); /*modificar aca la función segun el equipo la haya nombrado*/
const listaFavoritos = document.getElementById("listaFavoritos");
 
listaFavoritos.innerHTML= ""; /*Elimina el contenido ant conten. Si ejecutamos  la función, NO se dupliquen LAS CARD*/
favoritos.array.forEach(element => {
    const tarjeta = crearTarjetaPokemon(pokemon); /*adaptar el nombre de la funcion crearTarjetaPokemon, tarea  3 Evelyn" */
        listaFavoritos.append(tarjeta);
});
}



/*--------------------------------------------------*/

// ==========================================
// TAREA 4: FUNCIONES DE LOCALSTORAGE
// ==========================================

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

// ==========================================
// RENDERIZADO Y INTERFAZ (DOM)
// ==========================================

/* Tarea 3: Crear la tarjeta del Pokémon */
function mostrarPokemonCard(pokemon, esFavorito = false) {
  const ataque = pokemon.stats[1] ? pokemon.stats[1].base_stat : pokemon.ataque;
  const defensa = pokemon.stats[2] ? pokemon.stats[2].base_stat : pokemon.defensa;
  const imagenUrl = pokemon.sprites ? pokemon.sprites.front_default : pokemon.imagenUrl;
  const id = pokemon.id;

  return `
    <div class="pokemon-card" data-id="${id}">
        <img src="${imagenUrl}" alt="imagen de personaje ${pokemon.name}">
        <p class="name">${pokemon.name.toUpperCase()}</p>
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

// Variable global para guardar temporalmente el Pokémon buscado
let pokemonActual = null;

async function obtenerPokemon(nombre) {
  if (!nombre) return;
  try {
    const respuesta = await fetch(`${URL}/${nombre.toLowerCase()}`);
    if (!respuesta.ok) throw new Error("Pokémon no encontrado");

    const datos = await respuesta.json();
    pokemonActual = datos; // Guardamos la referencia actual

    const tarjetaHTML = mostrarPokemonCard(datos, false);
    document.getElementById("resultadoBusqueda").innerHTML = tarjetaHTML;
  } catch (error) {
    document.getElementById("resultadoBusqueda").innerHTML = `<p style="color:red">${error.message}</p>`;
  }
}

function agregarFavoritoActual() {
  if (pokemonActual) {
    guardarFavorito(pokemonActual);
  }
}

// ==========================================
// EVENTOS Y INICIALIZACIÓN
// ==========================================

document.getElementById("btnBuscar").addEventListener("click", () => {
  const input = document.getElementById("inputPokemon").value.trim();
  obtenerPokemon(input);
});

document.getElementById("btnLimpiar").addEventListener("click", () => {
  document.getElementById("inputPokemon").value = "";
  document.getElementById("resultadoBusqueda").innerHTML = "";
  pokemonActual = null;
});

// Cargar favoritos al abrir la página y mostrar Pikachu por defecto
mostrarListaFavoritos();
obtenerPokemon("pikachu");

// 1. Referencias a los elementos del DOM (ajusta los selectores según tu HTML)
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const btnClear = document.getElementById('btn-clear');
const resultsContainer = document.getElementById('results-container');
const favoritesContainer = document.getElementById('favorites-container');

// Cargar favoritos guardados al iniciar la página
document.addEventListener('DOMContentLoaded', renderFavorites);


// ==========================================
// 1. BOTÓN BUSCAR
// ==========================================
btnSearch.addEventListener('click', async () => {
    const pokemonNameOrId = searchInput.value.trim().toLowerCase();
    
    if (!pokemonNameOrId) {
        alert('Por favor, ingresa el nombre o ID de un Pokémon.');
        return;
    }

    try {
        // Llamar a la PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`);
        
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        const pokemonData = await response.json();
        
        // Crear y mostrar la tarjeta en el contenedor de resultados
        resultsContainer.innerHTML = ''; // Limpiar búsqueda anterior si deseas mostrar solo de a uno
        const card = createPokemonCard(pokemonData, 'search');
        resultsContainer.appendChild(card);

    } catch (error) {
        resultsContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
});


// ==========================================
// 2. BOTÓN LIMPIAR
// ==========================================
btnClear.addEventListener('click', () => {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
});


// ==========================================
// FUNCIÓN PARA CREAR TARJETAS (Auxiliar)
// ==========================================
function createPokemonCard(pokemon, type) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.dataset.id = pokemon.id;

    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name.toUpperCase()}</h3>
        <p>ID: ${pokemon.id}</p>
        ${type === 'search' 
            ? `<button class="btn-favorite">Agregar a favoritos ⭐</button>` 
            : `<button class="btn-delete">Eliminar ❌</button>`
        }
    `;

    // ==========================================
    // 3. BOTÓN AGREGAR A FAVORITOS
    // ==========================================
    if (type === 'search') {
        const btnFavorite = card.querySelector('.btn-favorite');
        btnFavorite.addEventListener('click', () => {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            // Evitar duplicados
            const exists = favorites.some(fav => fav.id === pokemon.id);
            if (!exists) {
                favorites.push(pokemon);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                renderFavorites();
                alert(`${pokemon.name} agregado a favoritos.`);
            } else {
                alert('Este Pokémon ya está en tus favoritos.');
            }
        });
    }

    // ==========================================
    // 4. BOTÓN ELIMINAR (De favoritos)
    // ==========================================
    if (type === 'favorite') {
        const btnDelete = card.querySelector('.btn-delete');
        btnDelete.addEventListener('click', () => {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            // Filtrar para remover el Pokémon del arreglo
            favorites = favorites.filter(fav => fav.id !== pokemon.id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            // Quitar su tarjeta del DOM directamente
            card.remove();
        });
    }

    return card;
}


// ==========================================
// RENDERIZAR FAVORITOS DESDE LOCALSTORAGE
// ==========================================
function renderFavorites() {
    favoritesContainer.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(pokemon => {
        const card = createPokemonCard(pokemon, 'favorite');
        favoritesContainer.appendChild(card);
    });
}