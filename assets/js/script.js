//Global Variables
var today = dayjs();
var calnder = $("#CalanderDays");
var calnderTitle = $("#calanderTitle");
var backArrow = $("#backArrow");
var forwardArrow = $("#forwardArrow");
var searchButtonElement = document.getElementById("search-button");
var textBoxElement = document.getElementById("searchCity text-box");
var errorMessageElement = document.getElementById("error-message");
var countrySelectSubmit = document.getElementById("countrySelectSubmit");
const holidayAPI =
  "https://calendarific.com/api/v2/holidays?api_key=1997f5bd2574c495866661ced19c3046b8a7ff59";
var mainEventsElement = document.getElementById("mainEventsContainer");
var searchHistory = [];

function createCalander() {
  // create 42 divs representing the days to cover all possible distributions of days
  // the 42 divs will be divided in 6 rows of 7 columns
  for (i = 0; i < 42; i++) {
    dayDiv = $("<div/>").addClass(
      "dayDiv self-center md:py-4 sm:py-2 sm:text-xs"
    );
    dayDiv.appendTo(calnder);
  }
}

// function that calls the Calendarific API: use getAPI(calendarAPI) plus parameters to call
var holidayData;
async function getAPI(url) {
  const response = await fetch(url);
  holidayData = await response.json();
}

function populateCalander(date) {
  // given a dayJS date object this function will populate the calander
  localStorage.setItem("currentCalanderPosition", date); // set the new date as the current calander date in localstorage
  daysInMonth = date.daysInMonth(); // get the amount of days in the mont 30, 31, 28, or 29
  startDay = date.day(); // get which day of the week is the 1st of the month Sunday = 0 to Saturday = 6
  calnderTitle.text(date.format("MMMM YYYY")); // set Title of the calander equal to full month and year (ex: January 2023)
  var calenderDays = $(".dayDiv");
  calenderDays.text(""); // clear current calander

  // Starting from the div indexed at the start day and then go until the div indexed at the daysInMonth +  startDay
  // add a number start from 1 till the daysInMonth
  var day = 1;
  for (i = startDay; i < daysInMonth + startDay; i++) {
    calenderDays.eq(i).text(day);
    day++;
  }
}

function init() {
  // This function is called when the page is loaded
  // the purpose of the function is to create a calander object and populate with current month
  createCalander();
  populateCalander(today);

  //searchHistory = localStorage.getItem("searchHistory");
  searchButtonElement.addEventListener("click", function () {
    console.log(textBoxElement.value);
    if (textBoxElement.value === null) {
      //console.log("here");
      errorMessageElement.textContent =
        "Please enter a city in the text box before clicking search.";
    }

    //var city = $('#input:text').val();
    var city = textBoxElement.value;
    displaySearchHistory(city, searchHistory);
    //console.log(textBoxElement);
    apiUrl =
      "https://app.ticketmaster.com/discovery/v2/events.json?city=" +
      city +
      "&apikey=ATjnFqwp5A4bNejs4zVA3QmsmFLjklKe";
    //apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?city=Toronto&apikey=ATjnFqwp5A4bNejs4zVA3QmsmFLjklKe"
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (tmData) {
            console.log(tmData);
            displayEvents(tmData);
          });
        } else {
          alert("Error: " + response.statusText);
          errorMessageElement.textContent =
            "Error when connecting to the Ticket Master API.";
        }
      })
      .catch(function (error) {
        errorMessageElement.textContent =
          "Unable to connect to the Ticket Master API.";
      });
    console.log(apiUrl);
  });
}

function displaySearchHistory(city, searchHistory) {
  var mainSearchContainer = document.getElementById("mainSearchContainer");
  console.log(searchHistory);
  // added an if statemnet to check if the search string is emplty
  if (city) {
    searchHistory.push(city);

    localStorage.setItem("searchHistory", searchHistory);

    var children = mainSearchContainer.children;
    for (var i = 0; i < children.length; i++) {
      var tableChild = children[i];
      if (tableChild.id === "history") {
        tableChild.remove();
        i--;
      }
    }

    for (var i = 0; i < searchHistory.length; i++) {
      var searchHistoryElement = document.createElement("div");
      var searchHistoryButtonElement = document.createElement("button");
      searchHistoryButtonElement.innerHTML = searchHistory[i];
      addEventSearchHistory(searchHistoryButtonElement, i);
      searchHistoryElement.id = "history";
      searchHistoryElement.className =
        "px-2 font-['Itim,cursive'] text-center hover:shadow-sm hover:shadow-black hover:rounded-lg mx-2 mt-2";
      searchHistoryElement.append(searchHistoryButtonElement);
      mainSearchContainer.append(searchHistoryElement);
    }
  }
}

function addEventSearchHistory(btn, index) {
  btn.addEventListener("click", function clickedSearchHistory() {
    console.log(btn);
    textBoxElement = document.getElementById("searchCity text-box");
    textBoxElement.value = btn.innerHTML;
    console.log(textBoxElement.value);
    if (textBoxElement.value === null) {
      errorMessageElement.textContent =
        "Please enter a city in the text box before clicking search.";
    }

    var city = textBoxElement.value;
    apiUrl =
      "https://app.ticketmaster.com/discovery/v2/events.json?city=" +
      city +
      "&apikey=ATjnFqwp5A4bNejs4zVA3QmsmFLjklKe";
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (tmData) {
            console.log(tmData);
            displayEvents(tmData);
          });
        } else {
          alert("Error: " + response.statusText);
          errorMessageElement.textContent =
            "Error when connecting to the Ticket Master API.";
        }
      })
      .catch(function (error) {
        errorMessageElement.textContent =
          "Unable to connect to the Ticket Master API.";
      });
    console.log(apiUrl);
  });
}

// Function for submitting the country to load holidays for
countrySelectSubmit.addEventListener("click", function () {
  var holCountry = document.getElementById("holCountry").value;
  localStorage.setItem("holCountryCode", holCountry);
  getAPI(
    holidayAPI +
      "&country=" +
      holCountry +
      "&year=" +
      today.$y +
      "&type=national"
  );
});

function displayEvents(tmData) {
  countryCode =
    tmData._embedded.events[0]._embedded.venues[0].country.countryCode;
  console.log(tmData._embedded.events[0]._embedded);

  var children = mainEventsElement.children;
  for (var i = 0; i < children.length; i++) {
    var tableChild = children[i];
    if (tableChild.id === "main-event-element") {
      tableChild.remove();
      i--;
    }
  }

  for (var i = 0; i < tmData._embedded.events.length; i++) {
    var currentEventElement = document.createElement("div");
    var currentEventStartTimeElement = document.createElement("div");
    var currentEventNameElement = document.createElement("div");
    var currentEventimage = document.createElement("img");
    var currentEventVenueElement = document.createElement("div");
    var currentEventVenueAddressElement = document.createElement("div");
    var currentEventURLElement = document.createElement("a");
    var currentEventElementAddToCalendar = document.createElement("button");
    var currentEventElementContainer = document.createElement("div");
    currentEventElementContainer.className = "currentEventElementContainer";
    var address = tmData._embedded.events[i]._embedded.venues[0].address.line1;
    var city = tmData._embedded.events[i]._embedded.venues[0].city.name;
    var state = tmData._embedded.events[i]._embedded.venues[0].state.stateCode;
    var postalCode = tmData._embedded.events[i]._embedded.venues[0].postalCode;

    currentEventElement.id = "main-event-element";
    currentEventElement.className =
      "items-center m-3 p-3 justify-between rounded shadow-sm shadow-cyan-700 bg-[rgb(14,165,235)]";
    currentEventStartTimeElement.id = "event-start-element";
    currentEventNameElement.id = "event-name-element";
    currentEventVenueElement.id = "event-venue-element";
    currentEventVenueAddressElement.id = "event-address-element";
    currentEventURLElement.id = "event-url-element";
    currentEventURLElement.className = "underline cursor-pointer break-words";

    currentEventElementAddToCalendar.textContent = "Add to Calendar";
    currentEventElementAddToCalendar.className = "addtoCalendarButton ml-3";

    currentEventStartTimeElement.innerHTML =
      tmData._embedded.events[i].dates.start.localDate;
    currentEventNameElement.innerHTML =
      tmData._embedded.events[i].name +
      " (" +
      tmData._embedded.events[i].dates.start.localDate +
      ")";
    currentEventimage.src = tmData._embedded.events[i].images[0].url;
    currentEventimage.className = "w-[50%]";
    currentEventVenueElement.innerHTML =
      tmData._embedded.events[i]._embedded.venues[0].name;
    currentEventVenueAddressElement.innerHTML =
      address +
      ", " +
      city +
      ", " +
      state +
      " " +
      countryCode +
      ", " +
      postalCode;
    currentEventURLElement.href = tmData._embedded.events[i].url;
    currentEventURLElement.innerHTML = "Click Here for More Info";
    currentEventElementContainer.append(currentEventNameElement);
    currentEventElementContainer.append(currentEventimage);
    currentEventElementContainer.append(currentEventVenueElement);
    currentEventElementContainer.append(currentEventVenueAddressElement);

    // currentEventElement.append(currentEventPriceRangeElement);
    currentEventElementContainer.append(currentEventURLElement);
    currentEventElementContainer.append(currentEventElementAddToCalendar);
    currentEventElement.append(currentEventElementContainer);
    mainEventsElement.append(currentEventElement);
  }
}

function addEvent(btn, index) {
  btn.addEventListener("click", function clicked() {
    createCalanderEvent();
  });
}

function createCalanderEvent() {
  console.log("here");
}

window.addEventListener("load", init);
backArrow.on("click", function () {
  var currentCalanderPosition = dayjs(
    localStorage.getItem("currentCalanderPosition")
  ); // get the current date that the calander is displaying from localstorage
  var newDate = currentCalanderPosition.add(-1, "month"); // subtract the current calander date by a month
  populateCalander(newDate); // populate calander with new month
});

forwardArrow.on("click", function () {
  var currentCalanderPosition = dayjs(
    localStorage.getItem("currentCalanderPosition")
  ); // get the current date that the calander is displaying from localstorage
  var newDate = currentCalanderPosition.add(1, "month"); // add a month to the current calander date
  populateCalander(newDate); // populate calander with new month
});

//init();
