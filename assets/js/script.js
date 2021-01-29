var locations = [];
const APIKey = "e42ce6fff3cc019aac43965299686295";

//Get icon classes for font awesome
function getIcon(condition) {
    switch (condition) {
        case "Rain":
            return "fas fa-cloud-showers-heavy";
        case "Clouds":
            return "fas fa-cloud";
        case "Clear":
            return "fas fa-sun";
        case "Drizzle":
            return "fas fa-cloud-rain";
        case "Snow":
            return "fas fa-snowflake";
        case "Mist":
            return "fas fa-smog";
        case "Fog":
            return "fas fa-smog";
        default:
            return "fas fa-cloud-sun";
    }
}

//Clear information and render according to data
function renderCurrentWeather(location, temperature, humidity, windSpeed, uv, condition) {
    $("#location").empty().append(`${location} `);
    let date = moment().format("MM" + "/" + "DD" + "/" + "YYYY");
    $("#location").append(`${date} `);

    let icon = $("<span>");
    icon.addClass(getIcon(condition));
    $("#location").append(icon);

    $("#temperature").empty().append(`${temperature} °F`);

    $("#humidity").empty().append(`${humidity}%`);

    $("#windSpeed").empty().append(`${windSpeed} MPH`);

    let uvWarnings = {
        green: "You can safely stay outside using standard daily sun protection: broad spectrum SPF 30+ sunscreen containing zinc, sunglasses, and hat. Don't forget: in winter, reflection off snow can nearly double UV strength.",
        yellow: "Stay in the shade during late morning through mid-afternoon. Wear broad spectrum SPF 30+ sunscreen containing zinc, sunglasses, and hat.",
        orange: "Stay in the shade as much as possible, especially during late morning through mid-afternoon. Wear broad spectrum SPF 30+ sunscreen containing zinc, protective clothing (long-sleeved shirt and pants), sunglasses, and wide-brimmed hat.",
        red: "Extra protection needed. Be careful outside, especially during late morning through mid-afternoon. Stay in the shade as much as possible, especially during late morning through mid-afternoon. Wear broad spectrum SPF 30+ sunscreen containing zinc, protective clothing (long-sleeved shirt and pants), sunglasses, and wide-brimmed hat. Please note: white sand on the beach will reflect UV rays and can double UV exposure.",
        purple: "Extra protection needed. Avoid sun exposure during late morning through mid-afternoon. Unprotected skin and eyes can burn in minutes. Wear broad spectrum SPF 30+ sunscreen containing zinc, protective clothing (like long-sleeves), sunglasses, and wide-brimmed hat. Please note: white sand on the beach will reflect UV rays and can double UV exposure."
    }

    let warnings = [];
    let uvWarning = $("<div>");
    if (uv < 3) {
        $("#uv").css("background-color", "green");
        uvWarning.append(uvWarnings.green);
    }
    else if (uv < 6) {
        $("#uv").css("background-color", "yellow");
        uvWarning.append(uvWarnings.yellow);
    }
    else if (uv < 8) {
        $("#uv").css("background-color", "orange");
        uvWarning.append(uvWarnings.orange);
    }
    else if (uv < 11) {
        $("#uv").css("background-color", "red");
        uvWarning.append(uvWarnings.red);
    }
    else {
        $("#uv").css("background-color", "purple");
        uvWarning.append(uvWarnings.purple);
    }

    $("#warnings").empty().append(uvWarning);
    $("#uv").empty().append(uv);
}

//On click, handle logic to search for weather given a location
$("#searchLocation").on("click", function (e) {
    e.preventDefault();
    let location = $("#locationInput").val().trim();
    $("#locationInput").val("");

    query(location)
});

//Listen if one of the previouly searched cities' dynamically genereted button is clicked
$(document).on("click", ".city-button", function () {
    let location = $(this).attr("data-city");
    query(location);
    $("#currentWeather, #forecast").css("display", "block");
});

//Formats UNIX timestamp into current date
function formatDate(date) {
    var date = new Date(date * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getUTCFullYear()}`;
}

// Queries for the location weather and calls to render and update data
function query(location) {
    //query building
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + APIKey;

    fetch(queryURL).then(response => {
        if (response.ok) {

            response.json().then(response => {
                console.log("1", response);
                let lat = response.coord.lat;
                let lon = response.coord.lon;
                //query building for uvi and forecats...
                queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${APIKey}`;
                fetch(queryURL).then(data => data.json().then(data => {
                    console.log("2", data);
                    //Call to generate a forecast card for the next five days
                    for (let i = 0; i < 5; i++) {
                        var date = data.daily[i].dt;
                        var temperature = data.daily[i].temp.day;
                        var humidity = data.daily[i].humidity;
                        var condition = data.daily[i].weather[0].main;
                        addCard(i, date, temperature, humidity, condition);
                    }
                    //Call to render current weather to main section
                    renderCurrentWeather(response.name, response.main.temp, response.main.humidity, response.wind.speed, data.current.uvi, response.weather[0].main);
                }));

                // Check if location seaerched is new, if it is, add button, and update locations array and local storage
                if (!locations.includes(response.name.toUpperCase())) {
                    addButton(response.name.toUpperCase());
                    locations.push(response.name.toUpperCase());
                    save();
                }
                $("#currentWeather, #forecast").css("display", "block");
            });

        } else {
            // Catch empty string
            alert("Error: " + response.statusText);
        }
    }).catch((error) => {
        //Catch invalid
        alert(error);
    });
}

// Renders a forecast card
function addCard(index, date, temperature, humidity, condition) {

    let card = $("<div>");
    card.addClass("card bg-primary text-white");

    let cardBody = $("<div>");
    cardBody.addClass("card-body");

    let title = $("<h5>");
    title.addClass("card-title font-weight-bold");
    title.css("font-size", "large");
    date = formatDate(date);
    title.text(date);

    let icon = $("<span>");
    icon.addClass(getIcon(condition));

    let t = $("<p>");
    t.addClass("card-text pt-3");
    t.text("Temp: ");
    t.append(`${temperature} °F`);

    let h = $("<p>");
    h.addClass("card-text pt-3");
    h.text(`Humidity: ${humidity}%`);

    cardBody.append(title);
    cardBody.append(icon);
    cardBody.append(t);
    cardBody.append(h);

    card.append(cardBody);

    $("#" + index).empty().append(card);
}

// Renders a button with the name of a location into the city history container
function addButton(location) {
    let button = $("<button>");
    button.addClass("list-group-item list-group-item-action city-button");
    button.attr("type", "button");
    button.attr("data-city", location);
    button.text(location)
    $("#history").prepend(button);
}

// Load locations from local sotrage and render city buttons if needed
function setUp() {
    locations = JSON.parse(localStorage.getItem("locations")) || []
    for (let i = 0; i < locations.length; i++) {
        addButton(locations[i]);
    }
}

// Save locations array to local storage
function save() {
    localStorage.setItem("locations", JSON.stringify(locations));
}

// Clears locations array, calls to udate local storage and removes all city buttons
function clear() {
    locations = [];
    save();
    $(".city-button").remove();
}

$("#clear").on("click", clear);
//set up when ready
$(setUp()); 
