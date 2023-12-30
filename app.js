
const inputColeccion = document.getElementsByClassName('input');
const botonGenerar = document.getElementById('generar-pokemon');

console.log(inputColeccion)
console.log(`Por defecto: ${inputColeccion[0].value}`)
console.log(`Por defecto: ${inputColeccion[1].value}`)

let conjuntoValores = [inputColeccion[0].value, inputColeccion[1].value];

console.log(`Valores Iniciales: ${conjuntoValores}`);


const pokemonAleatorios = (cantidad = 6, arrayPokemon) => {//ESTA FUNCIÓN DEBE GENERAR POKEMONS ALEATORIOS DE LOS FILTRADOS O DE TODOS LOS POKEMON

    const cantidadPokemon = arrayPokemon.length;
    const rangoMaximo = cantidadPokemon - 1;

    let pokemonAleatorios = [];

    for(let i=0; i<cantidad; i++) {
        let indice = Math.floor(Math.random()*(rangoMaximo + 1));
        pokemonAleatorios.push(arrayPokemon[indice]);
    }

    return pokemonAleatorios; //Devuelve un Array de Pokemon Aleatorios
}

//Devuelve un Pokemón
const extraerPokemon = async (numero) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numero}`);
        const datosPokemon = response.data;

        return datosPokemon;
    } catch (error) {
        throw console.error(error.message);
    }
}

const filtrarPokemon = async (tipo) => {
    try {
        let pokemonFiltrados = [];

        for(let i=0; i<1008; i++) {
            const numero = String(i+1);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numero}`);
            const datosPokemon = response.data;
            
            //Esto es un Array de Objetos, dentro de ese Obejto hay más cosas y dentro de eso está el Tipo
            const tiposPokemonArray = datosPokemon.types; 
            
            //El map devuelve un Array de true o false, basta que haya un true para VERIFICAR que el pokemon cumple con el Tipo especificado
            const arrayMap = tiposPokemonArray.map((objeto) => { 
                const tipoPokemon = objeto.type.name;

                return tipoPokemon === tipo;
            });

            //Verificar si algún tipo del Pokemón cumple con el especificado
            if(arrayMap.includes(true)) {
                const datosPokemon = await extraerPokemon(numero);
                pokemonFiltrados.push(datosPokemon);
            }
        }

        console.log('Pokemon Filtrados: ', pokemonFiltrados) // se filtran correctamente

        return pokemonFiltrados;
    } catch (error) {
        throw console.error(error.message);
    }
}

const generarPokemons = async () => { 
    const [cantidadPokemon, tipoPokemon] = conjuntoValores; //Los Valores de la Selección hecha por el Usuario

    if(tipoPokemon === 'cualquiera') {
        
        let todosPokemon = [];//Guardará un Array con todos los Pokemon, cada Pokemon es un Objeto

        for(let i=0; i<1008; i++) {
            const numero = String(i+1);
            todosPokemon.push(await extraerPokemon(numero)); //Devuelve los Datos de un Pokemon
        }

        const pokemonAleatoriosArray = pokemonAleatorios(cantidadPokemon, todosPokemon) //Array de pokemon aleatorios
        const nombresPokemonAleatorios = pokemonAleatoriosArray.map(datosUnPokemon => datosUnPokemon.forms[0].name);
        const urlPokemonAleatorios = pokemonAleatoriosArray.map(datosUnPokemon => datosUnPokemon.sprites.other["official-artwork"].front_default);

        return {
            nombresPokemonAleatorios,
            urlPokemonAleatorios
        }
    } else {

        const pokemonFiltrados = await filtrarPokemon(tipoPokemon); //Devuelve un Array
        //Estas 2 líneas pueden ser una función
        const pokemonAleatoriosArray = pokemonAleatorios(cantidadPokemon, pokemonFiltrados) //Array de pokemon aleatorios
        const nombresPokemonAleatorios = pokemonAleatoriosArray.map(datosUnPokemon => datosUnPokemon.forms[0].name);
        const urlPokemonAleatorios = pokemonAleatoriosArray.map(datosUnPokemon => datosUnPokemon.sprites.other["official-artwork"].front_default);

        return {
            nombresPokemonAleatorios,
            urlPokemonAleatorios
        }
    }

}

const mostrarPokemon = async (evento) => {

    console.log('Ya mostraré a los pokemon')

    const {nombresPokemonAleatorios, urlPokemonAleatorios} = await generarPokemons(); //Devuelve 2 ARRAYS
    const pokemonAleatorios = document.getElementById('pokemon-aleatorios');
    const cantidadPokemon = nombresPokemonAleatorios.length;
    const avisoMostrarPokemon = document.getElementById('aviso-pokemon');

    pokemonAleatorios.innerHTML = '';

    avisoMostrarPokemon.style.display = 'none';

    console.log('Ya mostraré a los pokemon x2')

    for(let i=0; i<cantidadPokemon; i++) {
        const div = document.createElement('div');
        pokemonAleatorios.append(div);
        div.classList.add('un-pokemon')

        div.innerHTML = `
            <img class="pokemon-imagen" src=${urlPokemonAleatorios[i]} alt=${nombresPokemonAleatorios[i]}>
            <p class="pokemon-nombre">${nombresPokemonAleatorios[i]}</p>
        `;
    }
}

//.ADDEVENTLISTENER()
for(const input of inputColeccion) {
    input.addEventListener('change', (evento) => {
        console.log(`Valor luego de click: ${input.value}`);
    
        const valorID = evento.target.id;
    
        console.log(`Nombre ID del Elemento Seleccionado: ${evento.target.id}`);
    
        if(valorID === 'cantidad') {
            conjuntoValores[0] = input.value;
        } else if (valorID === 'tipo') {
            conjuntoValores[1] = input.value;
        }

        console.log(`Valores Finales: ${conjuntoValores}`);
    });
}

botonGenerar.addEventListener('click', mostrarPokemon);