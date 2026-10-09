const URL = 'https://pokeapi.co/api/v2/pokemon';
async function obtenerPokemon(nombre) {
    try {
        const respuesta = await fetch(`${URL}/${nombre}`);
        const datos = await respuesta.json();
        console.log(datos);
    } catch (error) {
        console.log("Pokémon no encontrado", error.message);
    }
}
obtenerPokemon();

