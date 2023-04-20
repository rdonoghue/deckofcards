"use strict";

import { cardDeck } from "./carddata.js";
const allCards = Object.assign(cardDeck);
let invertedCards = true;
let currentHoverTarget;
var r = document.querySelector(":root");
var cardIndex = deckSetup(allCards);
const pageBody = document.querySelector("body");
var cardsInDeck = document.getElementsByClassName("indeck");
const moveCard = document.getElementsByClassName("card");
const firstTime = document.querySelector(".firsttime");

const customizeDeck = document.getElementById("customizeDeck");
const helpButton = document.getElementById("gethelp");
const pageHeader = document.querySelector("header");
const cardInfo = document.getElementById("cardInfo");
const fishList = document.getElementById("fishcards");
const fishForm = document.getElementById("gofish");
const cardFaces = document.getElementsByClassName("cardface");
const buttonHolder = document.querySelector(".buttonholder");

const resetButton = document.getElementById("resetdeck");
// const configButton = document.getElementById("config");
const configClose = document.getElementById("closex");

const overlayElement = document.querySelector(".helpoverlay");
const helpElement = document.querySelector(".helpdetails");
const custElement = document.querySelector(".deckdetails");
const spreadElement = document.querySelector(".spreadoverlay");

var activeCard;

overlayElement.addEventListener("click", clearOverlays);
resetButton.addEventListener("click", resetDeck);
helpButton.addEventListener("click", toggleHelp);
// configButton.addEventListener("click", toggleCustomize);
// configClose.addEventListener("click", toggleCustomize);
document.addEventListener("keypress", getKeyboardInput);

createDeck();

function resizeCards() {
  console.log("Resizing cards");
  var rs = getComputedStyle(r);
  const currentHeight = rs.getPropertyValue("--card-height");
  if (currentHeight === "500px") {
    makeCardsSmall();
  } else {
    makeCardsBig();
  }
}

function makeCardsSmall() {
  r.style.setProperty("--card-height", "250px");
  r.style.setProperty("--card-width", "150px");
}

function makeCardsBig() {
  r.style.setProperty("--card-height", "500px");
  r.style.setProperty("--card-width", "300px");
}

function deckSetup(deck) {
  let cardList = Object.keys(deck);
  let trueList = [];
  let finalList = [];

  for (let k of Object.keys(allCards)) {
    if (allCards[k][0]) {
      trueList.push(k);
    }
  }

  finalList = shuffleArray(cardList);
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

function createStyles() {
  var sheet = document.createElement("style");
  let stylestring = "";
  sheet.innerHTML = "div {border: 2px solid black; background-color: blue;}";
  for (let k in cardIndex) {
    let myKey = cardIndex[k];
    let myURL = allCards[myKey]["url"];
    stylestring =
      stylestring +
      `
    .${myKey} {
        background-image: url("../img/${myURL}");
        background-size: cover;

     }`;
  }
  sheet.innerHTML = stylestring;
  document.body.appendChild(sheet);
}

function createDeck() {
  console.log("Starting CreateDEck");
  var location = document.getElementById("playspace");
  location.innerHTML = "";

  for (let k in cardIndex) {
    let myKey = cardIndex[k];
    let cardID = cardIndex[k];

    allCards[myKey]["angle"] = 0;
    let myCard = document.createElement("div");
    myCard.classList.add("card");
    myCard.classList.add("indeck");
    location.appendChild(myCard);
    activeCard = myCard;
    let myContent = document.createElement("div");
    myContent.classList.add("content");

    let myFace = document.createElement("div");
    myFace.classList.add("cardface");
    myFace.classList.add(cardID);
    myCard.id = cardID;
    let myBack = document.createElement("div");
    myBack.classList.add("cardback");
    myContent.classList.add("flipped");
    myBack.setAttribute("data-name", "");

    location.appendChild(myCard);
    myCard.appendChild(myContent);
    myContent.appendChild(myBack);
    myContent.appendChild(myFace);

    activeCard = myCard;
    let flip = Math.floor(Math.random() * 2) == 0;
    if (flip) {
      myCard.classList.add("inverted");
      let inverseName = allCards[myKey]["cardname"] + "(inv)";
      myFace.setAttribute("data-name", inverseName);
    } else {
      myFace.setAttribute("data-name", allCards[myKey]["cardname"]);
    }
  }
  for (let k = 0; k < moveCard.length; k++) {
    dragElement(moveCard[k]);
    infoHover(moveCard[k]);
    moveCard[k].style = "";
  }
  setUpFish();
  createStyles();
  createSpread();
  shuffleAnimation();
  primeInfo();
}

function createSpread() {
  console.log("Starting Spread");
  var location = document.getElementById("cardspread");
  location.innerHTML = "";

  for (let k in cardIndex) {
    let myKey = cardIndex[k];
    let cardID = cardIndex[k];

    allCards[myKey]["angle"] = 0;
    let myCard = document.createElement("div");

    myCard.setAttribute("class", "spreadcard");
    myCard.innerHTML = "<div class='spreadface " + cardID + "'></div>";
    location.appendChild(myCard);
  }
}

function primeInfo() {
  //   cardInfo.innerHTML = activeCard["id"];
  //   const sourceId = activeCard.id;
  //   const sourceInfo = allCards[sourceId];
  //   cardInfo.innerHTML = `<div><h2>${sourceInfo.cardname}</h2></div>`;
}

function shuffleAnimation() {
  var location = document.getElementById("playspace");

  if (location.getElementsByClassName("card").length <= 4) {
    console.log("Deck Too Small!");
  } else {
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
    let myContent = elmnt.firstElementChild;
    myContent.classList.remove("flipped");
    cardInfo.innerHTML = `<div><h2>${myContent.lastChild.dataset.name}</h2></div>`;

    cardsInDeck = document.getElementsByClassName("indeck");

    // console.log(elmnt.id);
    activeCard = elmnt;
    // console.log(activeCard.id);
    // console.log(activeCard);
  }
}

function infoHover(elmnt) {
  elmnt.onmouseover = updateInfo;
}
function updateInfo(e) {
  // console.log(e.target);
  // console.log(e.target.id);

  const hoverCard = e.target;
  console.log(hoverCard.dataset.name);

  if (hoverCard.dataset.name && hoverCard && hoverCard !== currentHoverTarget) {
    currentHoverTarget = hoverCard;
    cardInfo.innerHTML = `<div><h2>${hoverCard.dataset.name}</h2></div>`;
  }
}

function hideFirstTime() {
  firstTime.classList.add("hidden");
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
  } else if (event.key == "u") {
    toggleVisibility();
  } else if (event.key == "t") {
    activeCard.style.top = 0;
    activeCard.style.left = 0;
    cardRotationValue = 0;
    activeCard.classList.add("indeck");
    activeCard.parentNode.prepend(activeCard);
    activeCard.firstElementChild.classList.add("flipped");
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
  } else if (event.key === "l") {
    toggleSpread();
  } else if (event.key === "z") {
    resizeCards();
  }

  cardRotation = "rotate(" + cardRotationValue + "deg)";
  activeCard.style.transform = cardRotation;

  setTimeout(function () {
    activeCard.style.transition = "none";
  }, 500);

  activeCard = activeCard.parentNode.lastChild;
}

function toggleSpread() {
  console.log("Toggling spread");
  //   spreadElement.classList.toggle("hidden");

  var location = document.getElementById("playspace");

  //   for (let k of location.getElementsByClassName("card")) {
  //     k.classList.add("spread");
  //   }

  // need to add gaps and disable clicking, probably also intelligently sort/reset

  custElement.classList.add("hidden");
  helpElement.classList.add("hidden");
  overlayElement.classList.add("hidden");

  if (spreadElement.classList.contains("hidden")) {
    spreadElement.classList.remove("hidden");
    // overlayElement.classList.remove("hidden");
  } else {
    spreadElement.classList.add("hidden");
  }
}

function clearOverlays() {
  custElement.classList.add("hidden");
  helpElement.classList.add("hidden");
  overlayElement.classList.add("hidden");
}

function resetDeck() {
  cardIndex = deckSetup(allCards);
  createDeck();
  // cardInfo.classList.add("hidden");
  //   unZoomAll();
  primeInfo;
}

function zoomCard() {
  //   activeCard.firstElementChild.classList.toggle("zoomcard");
}

function unZoomAll() {
  for (let k of cardFaces) {
    k.classList.remove("zoomcard");
  }
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

function setCheckboxes() {
  //   for (let k of Object.keys(allCards)) {
  //     // console.log(k);
  //     showCards[k][1].checked = false;
  //     if (showCards[k][0]) {
  //       console.log(showCards[k][1]);
  //       showCards[k][1].checked = true;
  //     }
  //   }
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

function zoomCard() {
  activeCard.firstElementChild.classList.toggle("zoomcard");
}

function unZoomAll() {
  for (let k of cardFaces) {
    k.classList.remove("zoomcard");
  }
}
