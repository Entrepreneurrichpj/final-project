import './App.css';
import Card from './components/Card.js'
import Axios from 'axios'
import {useEffect, useState} from 'react'

function App() {
  const deck = createDeck();
  const [newDeck, updateDeck] = useState(createNewDeck(deck));
  const [openCard, setOpenCard] = useState([]);
  const [phase, updatePhase] = useState(3);
  const [trails, updateTrails] = useState(0);
  const [instruction, updateInstruction] = useState("Pick a card on the first row that you think the suit is black");
  const [joke, setJoke] = useState("");
  const [response, setResponse] = useState("");
  const [luckyNumber, setLuckyNumber] = useState("");
  const [compliment, getCompliment] = useState("");
  const [advice, getAdvice] = useState("");

  const getJoke = () => {
    Axios.get("https://official-joke-api.appspot.com/random_joke").then(
      (joke) => {
        setJoke("Here's a joke: " + joke.data.setup);
        setResponse(joke.data.punchline)
      }
    )
  }

  useEffect(() => {
    const firstCard = newDeck[openCard[0]];
    const secondCard = newDeck[openCard[1]];
    const thirdCard = newDeck[openCard[2]];
    const lastCard = newDeck[openCard[3]];
    if (openCard.length > 0 && checkPhase1(firstCard)) {
      updateInstruction(i => "Not bad, not bad. Pick a card on the second row that you think has larger value than the first card")
      updatePhase(2)
    }
    if (openCard.length > 1 && checkPhase2(firstCard, secondCard)) {
      updateInstruction(i => "You got some skills! Pick a card on the third row that you think has value in between the first and second card")
      updatePhase(1)
    }
    if (openCard.length > 2 && checkPhase3(firstCard, secondCard, thirdCard)) {
      updateInstruction(i => "Pick a card on the fourth row that you think has suit of heart")
      updatePhase(0)
    }
    if (openCard.length > 3 && checkPhase4(lastCard)) {
      Axios.get("https://complimentr.com/api").then(
        (compliment) => {
          getCompliment(compliment.data.compliment);
        }
      ).then(() => updateInstruction(i => "You win! You can now get on the plane!"))
      updatePhase(-1)
    }
    if (openCard.length > 0 && !checkPhase1(firstCard)) {
      // updateDeck(cards => createNewDeck(createDeck()))
      updateInstruction(i => "GameOver, the plane is gone!")
      updatePhase(-1)
      if (trails > 5) {
        updateInstruction(i => "Bruh, what is your luck?")
        updatePhase(-1)
      }
      if (trails > 15) {
        if (trails < 18) {
          Axios.get("https://complimentr.com/api").then(
        (compliment) => {
          getCompliment(compliment.data.compliment);
        }
      ).then (() => updateInstruction(i => "I'm too kind for this, fine, you can go catch your plane now."))
        } else {
          updateInstruction(i => "Please no more!")
        }
        updatePhase(-1)
      }
    }
    if (openCard.length > 1 && !checkPhase2(firstCard, secondCard)) {
      // updateDeck(cards => createNewDeck(createDeck()))
      updateInstruction(i => "GameOver, the plane is gone!")
      updatePhase(-1)
      if (trails > 7) {
        updateInstruction(i => "Come on now, this much tries and still haven't pass the game?")
        updatePhase(-1)
      }
      if (trails > 15) {
        if (trails < 18) {
          Axios.get("https://complimentr.com/api").then(
        (compliment) => {
          getCompliment(compliment.data.compliment);
        }
      ).then (() => updateInstruction(i => "I'm too kind for this, fine, you can go catch your plane now."))
        } else {
          updateInstruction(i => "Please no more!")
        }
        updatePhase(-1)
      }
    }
    if (openCard.length > 2 && !checkPhase3(firstCard, secondCard, thirdCard)) {
      // updateDeck(cards => createNewDeck(createDeck()))
      updateInstruction(i => "GameOver, the plane is gone!")
      updatePhase(-1)
      if (trails > 9) {
        updateInstruction(i => "This is just sad to watch at this point.")
        updatePhase(-1)
      }
      if (trails > 15) {
        if (trails < 18) {
          Axios.get("https://complimentr.com/api").then(
        (compliment) => {
          getCompliment(compliment.data.compliment);
        }
      ).then (() => updateInstruction(i => "I'm too kind for this, fine, you can go catch your plane now."))
        } else {
          updateInstruction(i => "Please no more!")
        }
        updatePhase(-1)
      }
    }
    if (openCard.length > 3 && !checkPhase4(lastCard)) {
      // updateDeck(cards => createNewDeck(createDeck()))
      updateInstruction(i => "Dang that was close! No flight for you I guess.")
      updatePhase(-1)
      if (trails > 15) {
        if (trails < 18) {
          Axios.get("https://complimentr.com/api").then(
        (compliment) => {
          getCompliment(compliment.data.compliment);
        }
      ).then (() => updateInstruction(i => "I'm too kind for this, fine, you can go catch your plane now."))
        } else {
          updateInstruction(i => "Please no more!")
        }
        updatePhase(-1)
      }
    }
  }, [openCard]);

  const handleFlip = index => {
     if ((index-index%3)/3 === phase) {
      setOpenCard((opened) => [...opened, index])
    }
  }

  const resetGame = () => {
    setTimeout(() => {
      setOpenCard([]);
      updateDeck(createNewDeck(createDeck()));
      updatePhase(3);
    }, 1000);
    updateTrails(i => i+=1);
    setJoke(""); 
    setResponse("");
    getCompliment("");
    Axios.get('https://www.random.org/integers/?num=1&min=1&max=3&col=1&base=10&format=plain&rnd=new').then(
      num => {
        setLuckyNumber("Your lucky number for this round is : " + num.data);
    }).then(
      () => {
        if (trails>15) {
          updateInstruction("Bro stop trying...")
        } else {
          Axios.get('https://api.adviceslip.com/advice').then(
            advice => {
              getAdvice(advice.data.slip.advice);
            }).then(() => updateInstruction("I'll spare you one more chance, now pick a card on the first row that you think the suit is black!"))
        }
      }
    )
  }
  return (
    <div className="App">
      <div>
      <h1>Catch the plane</h1>
      <p className = "p1">You need to catch a plane ASAP, but the security stopped you and said you have to complete the game to get on the plane</p>
      <p className = "p1">There's total of 10 cards drawn from the deck, you have give it your best shot to pass the test (first row is the bottom one and the last row is the top one)</p>
      <h1 className = "p2" id="lucky-number">{luckyNumber}</h1>
      <h1 className = "p3" id="joke">{joke}</h1>
      <h1 className = "p3" id="response">{response}</h1>
      <button id="reset" onClick={() => resetGame()}>Again</button>
      <button id="reset" onClick={() => getJoke()}>Hint</button>
      <h1 id="advice">{advice}</h1>
      <h1 id="instruction">{instruction}</h1>
      <h1 id="compliment">{compliment}</h1>
      <br></br>
      <div className="deck">
        {newDeck.map((card, index) => {
          let flipCard = false;
          if(openCard.includes(index)) {
            flipCard = true;
          }
          return (<Card id={card.card} key={index} index={index} flipCard={flipCard} onClick={() => handleFlip(index)}/>);}
        )}
      </div>
      <br></br>
      </div>
    </div>
  );
}

const createDeck = () => {
  let deck = [];
  for (let i=0; i<13; i++) {
    for (let k=0; k<4; k++) {
      let suit = "";
      if (k===0) {
        suit = "S";
      } else if (k===1) {
        suit = "C";
      } else if (k===2) {
        suit = "D";
      } else {
        suit = "H";
      }
      if (i===0) {
        deck.push({card: "A" + suit, value: i});
      } else if (i===10) {
        deck.push({card: "J" + suit, value: i});
      } else if (i===11) {
        deck.push({card: "Q" + suit, value: i});
      } else if (i===12) {
        deck.push({card: "K" + suit, value: i});
      } else {
        let number = i+1;
        deck.push({card: number + suit, value: i});
      }
    }
  }
  return deck;
}

const createNewDeck = (deck) => {
  let result = [];
  for (let i=0; i<12; i++) {
    let index = Math.floor(Math.random() * (52-i));
    result.push(deck[index]);
    deck.splice(index, 1);
  }
  return result;
}

const checkPhase1 = (card) => {
  if (card.card.includes("S") || card.card.includes("C")) {
    return true;
  }
  return false;
}

const checkPhase2 = (firstCard, card) => {
  if (card.value > firstCard.value) {
    return true;
  }
  return false;
}

const checkPhase3 = (firstCard, secondCard, card) => {
  if (card.value > firstCard.value && card.value < secondCard.value) {
    return true;
  }
  return false;
}
const checkPhase4 = (card) => {
  if (card.card.includes("H")) {
    return true;
  }
  return false;
}

export default App;
