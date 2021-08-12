//Declarations and Caching
const main = document.getElementById("mainDisplay")
const grid = document.getElementById("gameGrid")
const bombDisplay = document.getElementById("bombDisplay")
const pokemonDisplay = document.getElementById("pokemonDisplay")
let area = []
let numberPlayers
let playerArray
let turnIndex = 0
let gamesPlayed = 0
let pokeArray = []
let pokeSelection = 0
let raving = false 
let setTimer

// Make grid
const makeGrid = () => {
    const size = 5
    for (let i = 0; i < size * size; i++) {
    const place = document.createElement("div")
    place.classList.add("place")
    grid.appendChild(place)
    area.push(place)
    }
}

//Start/Restart game
const startGame = () => {
    if (gamesPlayed > 0) {
    area.map(x => {
        x.classList.remove("pokemon", "pokeFound", "nothingFound", "kaboom")
        x.innerHTML = ""
    })
    grid.style.display = "flex"
    bombDisplay.style.display = "none"
    pokemonDisplay.style.display = "block"
    pokemonDisplay.textContent = "Catch 'em all"
    gamesPlayed++
    numberPlayers = document.getElementById("players").value
    playerArray = Array.from(Array(parseInt(numberPlayers)).keys()).map(x => x + 1)
    turnIndex = 0
    main.style.fontSize = "24px"
    main.textContent = "Player 1 turn: avoid the bomb, find the Pokemon"
    pokeArray.splice(0, pokeArray.length)
    pokeSelection = 0
    generateHidden()
   } else {
    gamesPlayed++
    numberPlayers = document.getElementById("players").value
    playerArray = Array.from(Array(parseInt(numberPlayers)).keys()).map(x => x + 1)
    turnIndex = 0
    main.textContent = "Player 1 turn: avoid the bomb, find the Pokemon"
    generateHidden()
    makeClick()
    }
}

// Click Listener
const makeClick = () => {
    area.map(x => x.addEventListener("click", (e) => {
    if (e.target.classList.contains("pokeFound") || e.target.classList.contains("nothingFound")) {
        pokemonDisplay.textContent = "Team Rocket does not condone cheating! Go again!"
        return
    } else if (e.target.classList.contains("pokemon")) {      
         e.target.classList.add("pokeFound")
         e.target.innerHTML = `<img class="pokeFound" src=${pokeArray[pokeSelection][2]}>`
         pokemonDisplay.textContent = `Player ${playerArray[turnIndex]} caught Pokemon number ${pokeArray[pokeSelection][1]}, ${pokeArray[pokeSelection][0]}!`
         pokeSelection++
         playerArray.splice(turnIndex, 1)
         turnIndex--
         numberPlayers--    
         return changeTurn()
    } else if (e.target.classList.contains("kaboom")) {
        return bombEndGame()
    } else {
        e.target.classList.add("nothingFound")
        pokemonDisplay.textContent = "Nice try, Pokemon are masters at hiding"
        return changeTurn()
    }
}))
}

//Change Turn
const changeTurn = () => {
    if (playerArray.length == 1) {
        return endGame()
    }
    turnIndex++; 
    (turnIndex >= numberPlayers) ? turnIndex = 0 : turnIndex
    main.textContent = "Player " + playerArray[turnIndex] + ": avoid the bomb, and find the Pokemon";
 }

//Generate Special/Hidden Squares
const generateHidden = () => {
    let randomNumbers = []
    for (let i = 1;  i <= numberPlayers - 1; i) {
      let random = Math.floor(Math.random() * 899)
      if (randomNumbers.includes(random)) {
          i = i;
      } else {
          randomNumbers.push(random)
          i++
          pokeCall(random)
      }
    }
    placePokemon()
    generateBomb()
}   

//Api Call
const pokeCall = (number) => {
    const test = $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${number}`,
        method: 'GET',
        dataType: 'json'
    }).then((res) => {
        pokeArray.push([res.name[0].toUpperCase() + res.name.slice(1),
        res.id, res.sprites.other['official-artwork'].front_default])
    })
}

//Place Pokemon
const placePokemon = () => {
    let pokeIndex
    for (let i = 0; i < numberPlayers - 1; i++) {
       do {
        pokeIndex = Math.floor(Math.random() * area.length)  
       } while (area[pokeIndex].classList.contains('pokemon'))
       area[pokeIndex].classList.add('pokemon')
    }
}

// Randomly generate bombs
const generateBomb = () => {
    let bombIndex
    do {
       bombIndex = Math.floor(Math.random() * area.length)
    } while (area[bombIndex].classList.contains('pokemon')) 
    area[bombIndex].classList.add("kaboom")
}

// End game if bomb is chosen
const bombEndGame = () => {
    bombDisplay.textContent = "💣"
    grid.style.display = "none"
    bombDisplay.style.display = "block"
    pokemonDisplay.style.display = "none"
    main.style.fontSize = "50px"
    main.textContent = "Kaboom! Looks like you're blasting off again Player " + playerArray[0] + "."
}

// End game if all pokemon are chosen
const endGame = () => {
    grid.style.display = "none"
    pokemonDisplay.style.display = "none"
    main.style.fontSize = "35px"
    bombDisplay.style.display = "block"
    bombDisplay.textContent = ""
    bombDisplay.innerHTML = `<img src=${pokeArray[pokeSelection - 1][2]}>`
    main.textContent = `${pokemonDisplay.textContent}. Game over Player ${playerArray[0]}, Team Rocket blasts you off for catching no Pokemon.`
}

//Party Mode Activation
const partayTime = () => {
    raving = !raving
    if (raving == true) { 
    setTimer = setInterval(() => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16)
    const randomColor2 = Math.floor(Math.random()*16777215).toString(16)
    document.body.style.background = "#" + randomColor
    document.getElementById("title").style.background = "#" + randomColor2
    }, 100)
    } else {
    clearInterval(setTimer)
    }
}

//Initial
const init = () => {
    makeGrid()
    document.getElementById("startReset").addEventListener("click", startGame)
    document.getElementById("rave").addEventListener("click", partayTime)
}

//Docoument Ready
const docReady = () => {
	if (document.readyState === "complete") {
		init()
	} else {
		document.addEventListener('DOMContentLoaded', init)
	}
}

docReady()