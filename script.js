const input = document.querySelector("#userInput");
const searchButton = document.querySelector("#searchButton");
const randomButton = document.querySelector("#randomButton");
const pokemonInfo = document.querySelector(".pokemonInfo"); //where we'll append most created elements
const functionsContainer = document.querySelector(".sm-container");
const lowerButtonsContainer = document.querySelector(".buttons");

const baseUrl = "https://pokeapi.co/api/v2/pokemon/"

function inputLength(){
  return input.value.length;
}

//when a user presses enter while interacting with the textbox
const inputSearch = async function(event) {
  if (inputLength() > 1 && event.keyCode === 13) {
    this.blur();
    let value = input.value.toLowerCase();
    try {
      const response = await fetch(`${baseUrl}${value}`);
      const data = await response.json();
      const response2 = await fetch(data.species.url);
      const additionalData = await response2.json();
      createPokemon(data, additionalData);
    }
    catch {
      alert("Invalid name, you must search by the Pokemon's full name ie. pikachu");
      input.value = "";
    }
  }
}

const buttonSearch = async function(){
  if(inputLength() > 1){
    let value = input.value.toLowerCase();
    try{
      const response = await fetch(`${baseUrl}${value}`);
      const data = await response.json();
      const response2 = await fetch(data.species.url);
      const additionalData = await response2.json();
      createPokemon(data, additionalData);
    }
    catch{
      alert("Invalid name, you must search by the Pokemon's full name ie. pikachu");
      input.value = "";
    }
  }
}

const randomSearch = async function(){
  let randomNumber = Math.floor(Math.random() * (899 - 1) + 1);
  try {
    const response = await fetch(`${baseUrl}${randomNumber}`);
    const data = await response.json();
    const response2 = await fetch(data.species.url);
    const additionalData = await response2.json();
    createPokemon(data, additionalData);
  }
  catch(e) {
    alert(e, "something went wrong while fetching the data.");
  }
}

const createPokemon = (data, additionalData) => {
  //clear all previous content when creating a new pokemon
  lowerButtonsContainer.innerHTML = "";
  pokemonInfo.innerHTML = "";

  let name = document.createElement("span");
  name.textContent = `${data.name}`;
  name.classList.add("pokemonName");

  let id = document.createElement("span");
  id.textContent = `#${data.id}`
  id.classList.add("pokemonID");

  let nameContainer = document.createElement("div");
  nameContainer.classList.add("nameContainer");
  nameContainer.appendChild(id);
  nameContainer.appendChild(name);
  pokemonInfo.appendChild(nameContainer);

  let image = document.createElement("img");
  image.src = `${data.sprites.front_default}`;
  image.classList.add("pokemonImage");
  //display shiny on hover (not ideal for mobile):
/*   image.addEventListener("mouseenter", function(){
    this.src =`${data.sprites.front_shiny}`;
  })
  image.addEventListener("mouseout", function () {
    this.src = `${data.sprites.front_default}`;
  }) */
  //toggle shiny form on click:
  image.addEventListener("click", function(){
    if (this.src === `${data.sprites.front_default}`){
      this.src = `${data.sprites.front_shiny}`;
    } else {
      this.src = `${data.sprites.front_default}`;
    }
  })
  pokemonInfo.appendChild(image);

  //pokemons can either have 1 or 2 types
  if(data.types.length > 1){
    let typeList = document.createElement("div");
    let type1 = document.createElement("span");
    let type2 = document.createElement("span");
    type1.textContent = `${data.types[0].type.name}`;
    type2.textContent = `${data.types[1].type.name}`;
    type1.classList.add(`pokemonType${data.types[0].type.name}`,`type`)
    type2.classList.add(`pokemonType${data.types[1].type.name}`,`type`)
    typeList.classList.add("typeLists");

    pokemonInfo.appendChild(typeList);
    typeList.appendChild(type1);
    typeList.appendChild(type2);
  }
  else{
    let typeList = document.createElement("div")
    let types = document.createElement("span");
    types.textContent = `${data.types[0].type.name}`
    types.classList.add(`pokemonType${data.types[0].type.name}`,`type`);
    typeList.classList.add("typeLists");
    typeList.appendChild(types);
    pokemonInfo.appendChild(typeList);
  }

  let flavorText = document.createElement("h3");
  /* flavorText.textContent = `${additionalData.flavor_text_entries[0].flavor_text.replace("\f"," ")}`; */
  //this new method always returns the english version:
  //leaving out the flavor.version.name == 'alpha-sapphire' check will yield results for modern pokemon
  //but lower quality descriptions overall.
  if(data.id < 722){
    additionalData.flavor_text_entries.some(flavor =>{
      if (flavor.language.name == 'en' && flavor.version.name == 'alpha-sapphire'){
        flavorText.textContent = flavor.flavor_text;
      }
    })
  }
  else{
    additionalData.flavor_text_entries.some(flavor => {
      if (flavor.language.name == 'en') {
        flavorText.textContent = flavor.flavor_text;
      }
    })
  }
  flavorText.classList.add("flavorText");
  pokemonInfo.appendChild(flavorText);

  let weight = document.createElement("h3");
  weight.textContent = `Weight: ${data.weight/10} kg`;
  weight.classList.add("measurements");
  pokemonInfo.appendChild(weight);

  let height = document.createElement("h3");
  //convert data measured in decimeters to feet
  height.textContent = `Height: ${Math.round((data.height * 0.328084 + 0.0001) * 100) / 100} ft`
  height.classList.add("measurements");
  pokemonInfo.appendChild(height);

  let prevButton = document.createElement("button");
  prevButton.textContent = `Previous`;
  prevButton.addEventListener("click", getPrevious);

  let nextButton = document.createElement("button");
  nextButton.textContent = `next`;
  nextButton.addEventListener("click", getNext);

  lowerButtonsContainer.appendChild(prevButton);
  lowerButtonsContainer.appendChild(nextButton);
  functionsContainer.appendChild(lowerButtonsContainer);

  //reset textbox input
  input.value = "";
}

const getPrevious = async function () {
  //select our newly created name element of class pokemonID to calculate the ID of previous pokemon
  let pokemonID = document.querySelector(".pokemonID");
  let previous = parseInt(pokemonID.textContent.split("#")[1]) - 1;
  if(previous > 0){
    try {
      const response = await fetch(`${baseUrl}${previous}`);
      const data = await response.json();
      const response2 = await fetch(data.species.url);
      const additionalData = await response2.json();
      createPokemon(data, additionalData);
    }
    catch (e) {
      alert(e, "something went wrong while fetching the data.");
    }
  }
}

const getNext = async function () {
  let pokemonID = document.querySelector(".pokemonID");
  let next = parseInt(pokemonID.textContent.split("#")[1]) + 1;
  if (next < 899) {
    try {
      const response = await fetch(`${baseUrl}${next}`);
      const data = await response.json();
      const response2 = await fetch(data.species.url);
      const additionalData = await response2.json();
      createPokemon(data, additionalData);
    }
    catch (e) {
      alert(e, "something went wrong while fetching the data.");
    }
  }
}

/* Run this function on page load to display the first pokedex entry */
const getFirstEntry = async function () {
    try {
      const response = await fetch(`${baseUrl}1`);
      const data = await response.json();
      const response2 = await fetch(data.species.url);
      const additionalData = await response2.json();
      createPokemon(data, additionalData);
    }
    catch {
      console.log(e,"error fetching initial entry");
    }
}
getFirstEntry();

input.addEventListener("keypress", inputSearch);
searchButton.addEventListener("click", buttonSearch);
randomButton.addEventListener("click", randomSearch);




