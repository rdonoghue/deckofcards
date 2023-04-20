"use strict";
// INITIAL VALUES
import {
  amberCards,
  amberCourtCards,
  otherCards,
  placeCards,
} from "./trumpdata.js";
const allCards = Object.assign(
  amberCards,
  amberCourtCards,
  otherCards,
  placeCards
);

var showCards = {
  scions: [true, document.getElementById("cb-scions")],
  nobles: [true, document.getElementById("cb-nobles")],
  citizens: [true, document.getElementById("cb-citizens")],
  shadows: [true, document.getElementById("cb-shadows")],
  lc: [true, document.getElementById("cb-lc")],
  places: [true, document.getElementById("cb-places")],
};
let greenScreen = 0;
let pageVisibility = 1;
let currentHoverTarget;
var cardIndex = deckSetup(allCards);
const pageBody = document.querySelector("body");
var cardsInDeck = document.getElementsByClassName("indeck");
const deckOutline = document.querySelector(".deckspace");
const resetButton = document.getElementById("resetdeck");
const configButton = document.getElementById("config");
const configClose = document.getElementById("closex");

const overlayElement = document.querySelector(".helpoverlay");
const helpElement = document.querySelector(".helpdetails");
const custElement = document.querySelector(".deckdetails");

const customizeDeck = document.getElementById("customizeDeck");
const helpButton = document.getElementById("gethelp");
const pageHeader = document.querySelector("header");
const cardInfo = document.getElementById("cardInfo");
const fishList = document.getElementById("fishcards");
const fishForm = document.getElementById("gofish");
const moveCard = document.getElementsByClassName("card");
const cardFaces = document.getElementsByClassName("cardface");
const firstTime = document.querySelector(".firsttime");
const buttonHolder = document.querySelector(".buttonholder");

var activeCard;
// FUNCTIONAL BUTTONS
overlayElement.addEventListener("click", clearOverlays);
resetButton.addEventListener("click", resetDeck);
helpButton.addEventListener("click", toggleHelp);
configButton.addEventListener("click", toggleCustomize);
configClose.addEventListener("click", toggleCustomize);
document.addEventListener("keypress", getKeyboardInput);
customizeDeck.addEventListener("submit", updateDeck);
fishForm.addEventListener("submit", fishCard);

// CORE ACTIONS

createDeck();

// FUNCTIONS

function zoomCard() {
  activeCard.firstElementChild.classList.toggle("zoomcard");
}

function unZoomAll() {
  for (let k of cardFaces) {
    k.classList.remove("zoomcard");
  }
}

function toggleGreenScreen() {
  pageBody.classList.toggle("greenscreen");
  var allCards = document.querySelectorAll(".card");

  if (pageBody.classList.contains("greenscreen")) {
    for (const k of allCards) {
      k.classList.add("noshadow");
    }
  } else {
    for (const k of allCards) {
      k.classList.remove("noshadow");
    }
  }
}

function fishCard(event) {
  clearOverlays();
  event.preventDefault();
  const formData = new FormData(event.target);
  const chosenCard = formData.get("fishcards");
  console.log(chosenCard);
  const cardLoc = document.getElementById(chosenCard);
  const cardHolder = cardLoc.parentNode;
  cardHolder.parentNode.appendChild(cardHolder);

  //  elmnt.parentNode.appendChild(elmnt);
}

function setUpFish() {
  fishList.innerHTML = "";
  const sortedList = cardIndex.sort();
  const selectList = fishList;
  for (let k of sortedList) {
    var option = document.createElement("option");
    option.text = allCards[k]["cardname"];
    option.value = k;
    selectList.add(option);
  }
}

function shuffleAnimation() {
  var location = document.getElementById("playspace");
  const card1 = location.getElementsByClassName("card")[1];
  const card2 = location.getElementsByClassName("card")[2];
  const card3 = location.getElementsByClassName("card")[3];
  const card4 = location.getElementsByClassName("card")[4];

  card1.style.transition = "0.5s ease";
  card2.style.transition = "0.5s ease";
  card1.style.transition = "0.5s ease";
  card2.style.transition = "0.5s ease";

  card1.style.transform = "rotate(8deg)";
  card2.style.transform = "rotate(-5deg)";
  card3.style.transform = "rotate(6deg)";
  card4.style.transform = "rotate(-4deg)";

  setTimeout(function () {
    card1.style.transform = "rotate(0deg)";
    card2.style.transform = "rotate(0deg)";
    card3.style.transform = "rotate(0deg)";
    card4.style.transform = "rotate(0deg)";
  }, 500);
}

function setCheckboxes() {
  for (let k of Object.keys(showCards)) {
    // console.log(k);
    showCards[k][1].checked = false;

    if (showCards[k][0]) {
      console.log(showCards[k][1]);
      showCards[k][1].checked = true;
    }
  }
}

function updateDeck(event) {
  clearOverlays();
  event.preventDefault();
  const formData = new FormData(event.target);

  for (let k of Object.keys(showCards)) {
    // console.log(k + ": " + formData.get(k));
    if (formData.get(k)) {
      showCards[k][0] = true;
    } else {
      showCards[k][0] = false;
    }
  }
  resetDeck();
}

function clearOverlays() {
  custElement.classList.add("hidden");
  helpElement.classList.add("hidden");
  overlayElement.classList.add("hidden");
}

function toggleHelp() {
  custElement.classList.add("hidden");
  helpElement.classList.toggle("hidden");
  if (helpElement.classList.contains("hidden")) {
    overlayElement.classList.add("hidden");
  } else {
    overlayElement.classList.remove("hidden");
  }
}

function toggleCustomize() {
  setCheckboxes();
  setUpFish();

  helpElement.classList.add("hidden");
  custElement.classList.toggle("hidden");
  // console.log(custElement.classList.contains("hidden"));
  if (custElement.classList.contains("hidden")) {
    overlayElement.classList.add("hidden");
  } else {
    overlayElement.classList.remove("hidden");
  }
}

function getKeyboardInput(event) {
  activeCard.style.transition = "0.5s ease";
  let cardRotationValue;
  let cardRotation = activeCard.style.transform;

  if (!cardRotation) {
    cardRotation = "rotate(0deg)";
    cardRotationValue = 0;
  } else {
    cardRotationValue = Number(cardRotation.slice(7, cardRotation.length - 4));
  }

  if (event.key == "s") {
    cardRotation = "rotate(180deg)";
    cardRotationValue = 180;
  } else if (event.key == "w") {
    cardRotation = "rotate(0deg)";
    cardRotationValue = 0;
    activeCard.style.transform = "rotate(0deg)";
  } else if (event.key == "d") {
    cardRotation = "rotate(90deg)";
    cardRotationValue = 90;
  } else if (event.key == "a") {
    cardRotationValue = -90;
  } else if (event.key == "e") {
    cardRotationValue += 15;
  } else if (event.key == "q") {
    cardRotationValue -= 15;
  } else if (event.key == "x") {
    resetDeck();
  } else if (event.key == "h") {
    toggleVisibility();
    // for (let cardToHide of cardsInDeck) {
    //   if (cardToHide.style.visibility !== "hidden") {
    //     cardToHide.style.visibility = "hidden";
    //   } else {
    //     cardToHide.style.visibility = "visible";
    //   }
    // }
    // if (deckOutline.style.visibility !== "hidden") {
    //   deckOutline.style.visibility = "hidden";
    // } else {
    //   deckOutline.style.visibility = "visible";
    // }
    // if (resetButton.style.visibility !== "hidden") {
    //   resetButton.style.visibility = "hidden";
    // } else {
    //   resetButton.style.visibility = "visible";
    // }
    // if (helpButton.style.visibility !== "hidden") {
    //   helpButton.style.visibility = "hidden";
    // } else {
    //   helpButton.style.visibility = "visible";
    // }
    // if (configButton.style.visibility !== "hidden") {
    //   configButton.style.visibility = "hidden";
    // } else {
    //   configButton.style.visibility = "visible";
    // }
    // if (pageHeader.style.visibility !== "hidden") {
    //   pageHeader.style.visibility = "hidden";
    // } else {
    //   pageHeader.style.visibility = "visible";
    // }
    // deckOutline.style.visibility = "hidden";
    // resetButton.style.visibility = "hidden";
    // helpButton.style.visibility = "hidden";
    // pageHeader.style.visibility = "hidden";
  } else if (event.key == "u") {
    toggleVisibility();
  } else if (event.key == "t") {
    activeCard.style.top = 0;
    activeCard.style.left = 0;
    cardRotationValue = 0;
    activeCard.classList.add("indeck");
    activeCard.parentNode.prepend(activeCard);
  } else if (event.key == "b") {
    activeCard.parentNode.prepend(activeCard);
  } else if (event.key == "?") {
    toggleHelp();
  } else if (event.key === "`") {
    clearOverlays();
  } else if (event.key === "i") {
    cardInfo.classList.toggle("hidden");
  } else if (event.key === "c") {
    toggleCustomize();
  } else if (event.key === "g") {
    toggleGreenScreen();
  } else if (event.key === "z") {
    zoomCard();
  }

  // else if (event.key == "1") {
  //   console.log("Active Card: " + activeCard.id);
  //   console.log(cardsInDeck.length);
  // }

  cardRotation = "rotate(" + cardRotationValue + "deg)";
  activeCard.style.transform = cardRotation;
  // console.log(cardRotation);

  setTimeout(function () {
    activeCard.style.transition = "none";
  }, 500);

  activeCard = activeCard.parentNode.lastChild;
}

function infoHover(elmnt) {
  elmnt.onmouseover = updateInfo;
}

function dragElement(elmnt) {
  // console.log(elmnt.id);
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    hideFirstTime();

    elmnt.parentNode.appendChild(elmnt);
    elmnt.style.transition = "none";

    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.style.transition = "0.5s ease";
    elmnt.classList.remove("indeck");
    cardsInDeck = document.getElementsByClassName("indeck");

    // console.log(elmnt.id);
    activeCard = elmnt;
    // console.log(activeCard.id);
    // console.log(activeCard);
  }
}

function updateInfo(e) {
  // console.log(e.target);
  // console.log(e.target.id);

  const hoverCard = e.target.id;
  if (hoverCard && hoverCard !== currentHoverTarget) {
    currentHoverTarget = hoverCard;
    cardInfo.innerHTML = `<div><h2>${allCards[hoverCard].cardname}</h2></div>
  <div><h3>${allCards[hoverCard].oneline}</h3></div>
  <div class="tagline">${allCards[hoverCard].tagline}</div>`;
  }
}

function createDeck() {
  var location = document.getElementById("playspace");
  location.innerHTML = "";
  for (let k in cardIndex) {
    // console.log(k);
    // console.log(cardIndex[k]);
    let myKey = cardIndex[k];
    let cardID = cardIndex[k];
    allCards[myKey]["angle"] = 0;
    let myCard = document.createElement("div");
    // myCard.setAttribute("id", cardIndex[k]);
    myCard.setAttribute("class", "card");
    myCard.innerHTML =
      "<div class='cardface " + cardID + "' id='" + cardID + "'></div>";
    myCard.classList.add("indeck");
    location.appendChild(myCard);
    activeCard = myCard;
  }
  for (let k = 0; k < moveCard.length; k++) {
    dragElement(moveCard[k]);
    infoHover(moveCard[k]);
    moveCard[k].style = "";
  }
  setUpFish();
  shuffleAnimation();
  primeInfo();
}

function primeInfo() {
  cardInfo.innerHTML = activeCard["id"];
  const sourceId = activeCard.firstElementChild.id;
  const sourceInfo = allCards[sourceId];

  cardInfo.innerHTML = `<div><h2>${sourceInfo.cardname}</h2></div>
  <div><h3>${sourceInfo.oneline}</h3></div>
  <div class="tagline">${sourceInfo.tagline}</div>`;
}

function deckSetup(deck) {
  let cardList = Object.keys(deck);
  let trueList = [];
  let finalList = [];

  for (let k of Object.keys(showCards)) {
    if (showCards[k][0]) {
      trueList.push(k);
    }
  }

  for (let k of cardList) {
    const cardCat = allCards[k]["class"];
    if (!trueList.includes(cardCat)) {
    } else {
      finalList.push(k);
    }
  }

  finalList = shuffleArray(finalList);
  return finalList;
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function resetDeck() {
  cardIndex = deckSetup(allCards);
  createDeck();
  // cardInfo.classList.add("hidden");
  unZoomAll();
  primeInfo;
}

function hideFirstTime() {
  firstTime.classList.add("hidden");
}

function toggleVisibility() {
  hideFirstTime();
  for (let cardToHide of cardsInDeck) {
    cardToHide.classList.toggle("invisible");
  }
  pageHeader.classList.toggle("invisible");
  buttonHolder.classList.toggle("invisible");
}
