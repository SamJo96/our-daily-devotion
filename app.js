const API_URL =
  "https://script.google.com/macros/s/AKfycbztyiZMSWX3ZlEvLrGRgZeqrOvZTlBMcpLkJJq7_4oNtuIVX5VP-tFhvaRBmpwbUbo5SQ/exec";


let devotions = [];

let currentIndex = 0;


async function loadDevotions() {

  try {

    const response =
      await fetch(API_URL);

    devotions =
      await response.json();


    devotions =
      devotions.filter(
        row => row["Date"]
      );


    currentIndex =
      findToday();


    displayDevotion();


  } catch (error) {

    console.error(error);

    document.getElementById("verse")
      .innerText =
      "Unable to load the devotion.";

  }

}


function findToday() {

  const today =
    new Date();


  const todayDate =
    today.toISOString()
      .split("T")[0];


  const index =
    devotions.findIndex(row => {

      const date =
        new Date(row["Date"]);


      const dateString =
        date.toISOString()
          .split("T")[0];


      return dateString === todayDate;

    });


  return index >= 0 ? index : 0;

}


function displayDevotion() {

  if (!devotions.length) return;


  const devotion =
    devotions[currentIndex];


  const date =
    new Date(devotion["Date"]);


  document.getElementById("date")
    .innerText =
    date.toLocaleDateString(
      undefined,
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );


  document.getElementById(
    "verse-reference"
  ).innerText =
    devotion["Verse Reference"] || "";


  document.getElementById(
    "verse"
  ).innerText =
    devotion["Bible Verse"] || "";


  document.getElementById(
    "devotion"
  ).innerText =
    devotion["Devotion"] ||
    "Your devotion will appear here.";


  document.getElementById(
    "question"
  ).innerText =
    devotion["Question"] ||
    "Your question will appear here.";


  document.getElementById(
    "prayer"
  ).innerText =
    devotion["Prayer"] ||
    "Your prayer will appear here.";


  document.getElementById(
    "action"
  ).innerText =
    devotion["Daily Action"] ||
    "Your daily action will appear here.";

}


function previousDay() {

  if (currentIndex > 0) {

    currentIndex--;

    displayDevotion();

  }

}


function nextDay() {

  if (
    currentIndex <
    devotions.length - 1
  ) {

    currentIndex++;

    displayDevotion();

  }

}


function today() {

  currentIndex =
    findToday();

  displayDevotion();

}


loadDevotions();
