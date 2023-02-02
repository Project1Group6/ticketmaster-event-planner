//Global Variables
var today = dayjs();
var calnder = $('#CalanderDays');
var calnderTitle = $('#calanderTitle');
var backArrow = $('#backArrow');
var forwardArrow = $('#forwardArrow');
var searchButtonElement = document.getElementById("search-button");
var textBoxElement = document.getElementById("text-box");
var errorMessageElement = document.getElementById("error-message");


function createCalander(){
    // create 42 divs representing the days to cover all possible distributions of days
    // the 42 divs will be divided in 6 rows of 7 columns
    for(i = 0; i < 42; i++){
        dayDiv = $('<div/>').addClass('dayDiv self-center py-4');
        dayDiv.appendTo(calnder);
    }
}

 
function populateCalander(date){
    // given a dayJS date object this function will populate the calander
    localStorage.setItem("currentCalanderPosition", date); // set the new date as the current calander date in localstorage
    daysInMonth = date.daysInMonth(); // get the amount of days in the mont 30, 31, 28, or 29
    startDay = date.day(); // get which day of the week is the 1st of the month Sunday = 0 to Saturday = 6
    calnderTitle.text(date.format('MMMM YYYY')); // set Title of the calander equal to full month and year (ex: January 2023)
    var calenderDays = $('.dayDiv');
    calenderDays.text('') // clear current calander

    // Starting from the div indexed at the start day and then go until the div indexed at the daysInMonth +  startDay
    // add a number start from 1 till the daysInMonth
    var day=1;
    for(i = startDay; i < daysInMonth + startDay; i++){
        calenderDays.eq(i).text(day);
        day++;
    }
}

 
function init(){
    // This function is called when the page is loaded
    // the purpose of the function is to create a calander object and populate with current month
    createCalander();
    populateCalander(today);

    searchButtonElement.addEventListener("click", function(){
        console.log(textBoxElement);
        if (textBoxElement === null){
            console.log("here");
            errorMessageElement.textContent = "Please enter a city in the text box before clicking search."
        }

        apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?city="+city+"&apikey=ATjnFqwp5A4bNejs4zVA3QmsmFLjklKe"
    })
}

window.addEventListener("load", init);
backArrow.on( "click", function(){
    var currentCalanderPosition = dayjs(localStorage.getItem('currentCalanderPosition')) // get the current date that the calander is displaying from localstorage
    var newDate = currentCalanderPosition.add(-1, 'month') // subtract the current calander date by a month
    populateCalander(newDate) // populate calander with new month
});

forwardArrow.on( "click", function(){
    var currentCalanderPosition = dayjs(localStorage.getItem('currentCalanderPosition')) // get the current date that the calander is displaying from localstorage
    var newDate = currentCalanderPosition.add(1, 'month') // add a month to the current calander date
    populateCalander(newDate) // populate calander with new month
});

//init();
