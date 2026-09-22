const API_URL =
  "https://script.google.com/macros/s/AKfycbztyiZMSWX3ZlEvLrGRgZeqrOvZTlBMcpLkJJq7_4oNtuIVX5VP-tFhvaRBmpwbUbo5SQ/exec";


let devotions = [];
let currentIndex = 0;


// ===============================
// LOAD DEVOTIONS
// ===============================

async function loadDevotions() {

  try {

    const response = await fetch(API_URL);

    devotions = await response.json();

    devotions = devotions.filter(
      row => row["Date"]
    );

    currentIndex = findToday();

    displayDevotion();

  } catch (error) {

    console.error("Error loading devotions:", error);

    document.getElementById("verse").innerText =
      "Unable to load the devotion.";

  }

}


// ===============================
// FIND TODAY
// ===============================

function findToday() {

  const today = new Date();

  const todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");


  const index = devotions.findIndex(row => {

    const date =
      String(row["Date"]).substring(0, 10);

    return date === todayString;

  });


  return index >= 0 ? index : 0;

}


// ===============================
// DISPLAY DEVOTION
// ===============================

function displayDevotion() {

  if (!devotions.length) {
    return;
  }


  const devotion =
    devotions[currentIndex];


  // Get the date without timezone conversion

  const dateParts =
    String(devotion["Date"])
      .substring(0, 10)
      .split("-");


  const year =
    Number(dateParts[0]);

  const month =
    Number(dateParts[1]) - 1;

  const day =
    Number(dateParts[2]);


  const displayDate =
    new Date(year, month, day);


  document.getElementById("date").innerText =
    displayDate.toLocaleDateString(
      undefined,
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );


  // Verse reference

  document.getElementById(
    "verse-reference"
  ).innerText =
    devotion["Verse Reference"] || "";


  // Bible verse

  document.getElementById(
    "verse"
  ).innerText =
    devotion["Bible Verse"] || "";


  // Devotion

  document.getElementById(
    "devotion"
  ).innerText =
    devotion["Devotion"] ||
    "Your devotion will appear here.";


  // Question

  document.getElementById(
    "question"
  ).innerText =
    devotion["Question"] ||
    "Your question will appear here.";


  // Prayer

  document.getElementById(
    "prayer"
  ).innerText =
    devotion["Prayer"] ||
    "Your prayer will appear here.";


  // Daily action

  document.getElementById(
    "action"
  ).innerText =
    devotion["Daily Action"] ||
    "Your daily action will appear here.";


  // Update completion button

  updateCompletionButton();

}


// ===============================
// COMPLETION
// ===============================

function completeDevotion() {

  if (!devotions.length) {
    return;
  }


  const devotion =
    devotions[currentIndex];


  const date =
    String(devotion["Date"])
      .substring(0, 10);


  // Save completion to this browser

  localStorage.setItem(
    "completed-" + date,
    "true"
  );


  updateCompletionButton();

}


// ===============================
// UPDATE COMPLETION BUTTON
// ===============================

function updateCompletionButton() {

  const button =
    document.getElementById(
      "complete-button"
    );

  const message =
    document.getElementById(
      "completion-message"
    );


  if (!button || !message) {
    return;
  }


  if (!devotions.length) {
    return;
  }


  const devotion =
    devotions[currentIndex];


  const date =
    String(devotion["Date"])
      .substring(0, 10);


  const completed =
    localStorage.getItem(
      "completed-" + date
    );


  if (completed === "true") {

    button.innerText =
      "✓ Completed";

    message.innerText =
      "✓ Devotion completed";

    button.disabled = true;

  } else {

    button.innerText =
      "♡ Mark today's devotion complete";

    message.innerText = "";

    button.disabled = false;

  }

}


// ===============================
// PREVIOUS DAY
// ===============================

function previousDay() {

  if (currentIndex > 0) {

    currentIndex--;

    displayDevotion();

  }

}


// ===============================
// NEXT DAY
// ===============================

function nextDay() {

  if (
    currentIndex <
    devotions.length - 1
  ) {

    currentIndex++;

    displayDevotion();

  }

}


// ===============================
// TODAY
// ===============================

function today() {

  currentIndex =
    findToday();

  displayDevotion();

}


// ===============================
// SERVICE WORKER
// ===============================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    function() {

      navigator.serviceWorker.register(
        "./service-worker.js"
      ).catch(
        function(error) {

          console.log(
            "Service worker registration failed:",
            error
          );

        }
      );

    }
  );

}


// ===============================
// START APP
// ===============================

loadDevotions();
