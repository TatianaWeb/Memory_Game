//Pack of all cards

let halfpack=['fa fa-anchor','fa fa-bicycle','fa fa-bolt','fa fa-bomb','fa fa-cube','fa fa-diamond','fa fa-leaf','fa fa-paper-plane-o'];
let packcards=[...halfpack,...halfpack];


// Globals

const deck = document.querySelector('.deck');
const clock = document.querySelector('.clock');
let toggledCards = [];
let moves = 0;
let time = 0;
let matched = 0;
let clockOff = true;
let clockId;
 
// generate the pack of cards

function packOfCards() {
    for(let i = 0; i < packcards.length; i++) {
        const newCard = document.createElement("li");
        newCard.classList.add("card","cards");
        newCard.innerHTML = `<i class="${packcards[i]}"></i>`;
        deck.appendChild(newCard);
    }
}

packOfCards();

// shuffle the list of cards using the provided "shuffle" method http://stackoverflow.com/a/2450976
 
function shuffle(array) {
    
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.card'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}

shuffleDeck();

// set up the event listener for a card

deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) { 
        if (clockOff) {
            startClock();
            clockOff = false;            
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) {
            checkForMatch();
            addMove();
            checkScore();
        }
    }
});

// timer starts

function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

// display time on scoreboard

function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) {
        clock.innerHTML = minutes + ':0' + seconds;
    }
    else {
    clock.innerHTML = minutes + ':' + seconds;
    }
}

// flip the card

function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

// add the card to a *list* of "open" cards

function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}


/**
 *  - if the list already has another card, check to see if the two cards match
 *  + if the cards do match, lock the cards in the open position 
 *  + if the cards do not match, remove the cards from the list and hide the card's symbol 
 */

function isClickValid(clickTarget) {
    return (
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget)
    );
}

function checkForMatch() {
    const ALL_PAIRS = 8;
    if (
        toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className
        ) {
            toggledCards[0].classList.toggle('match');
            toggledCards[1].classList.toggle('match');
            toggledCards = [];
            matched++;
                if (matched === ALL_PAIRS) {
                    gameOver();
                }
        }   else {
                setTimeout( () => {
                    toggleCard(toggledCards[0]);
                    toggleCard(toggledCards[1]);
                    toggledCards = [];
                    }, 1000);
            }    
}

// timer stops

function gameOver() {
    stopClock();
    toggleModal();
    writeModalStats();
}

function stopClock() {
    clearInterval(clockId);
    console.log("Clock's stopped!")
}

// popup window with game statistics (time, moves, star rating) opens

function toggleModal() {
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();

    timeStat.innerHTML = clockTime;
    movesStat.innerHTML = (moves + 1);
    starsStat.innerHTML = stars; 
}

function getStars () {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

function addMove() {
     moves++;
     const movesText = document.querySelector('.moves');
     movesText.innerHTML = moves;
}

function checkScore() {
     if (moves === 12 || moves === 20) {  
         hideStar(); 
        }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }        
    }
}

// button Cancel on modal window

document.querySelector('.modal_cancel').addEventListener('click', () => {
    toggleModal();
});

// button Replay on modal window

document.querySelector('.modal_replay').addEventListener('click', resetGame);

// symbol Restart on scoreboad

document.querySelector('.restart').addEventListener('click', resetGame);

function resetGame() {
    document.location.href = '';
}







