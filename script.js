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
