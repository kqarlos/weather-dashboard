var locations = [];

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

//Clear information
function renderCurrentWeather(location, temperature, humidity, windSpeed, uv, condition) {
    $("#location").empty().append(`${location} `);
    var date = moment().format("MM" + "/" + "DD" + "/" + "YYYY");
    $("#location").append(`${date} `);

    var icon = $("<span>");
    icon.addClass(getIcon(condition));
    $("#location").append(icon);

    $("#temperature").empty().append(`${temperature} °F`);

    $("#humidity").empty().append(`${humidity}%`);

    $("#windSpeed").empty().append(`${windSpeed} MPH`);

    $("#uv").empty();
    if (uv < 3)
        $("#uv").css("background-color", "green");
    else if (uv < 6)
        $("#uv").css("background-color", "yellow");
    else if (uv < 8)
        $("#uv").css("background-color", "orange");
    else if (uv < 11)
        $("#uv").css("background-color", "red");
    else
        $("#uv").css("background-color", "purple");

    $("#uv").append(uv);
}

//On click, handle logic to search for weather given a location
$("#searchLocation").on("click", function (e) {
    e.preventDefault();
    var location = $("#locationInput").val().trim();
    $("#locationInput").val("");

    query(location);
    queryForecast(location)

    addButton(location);

    $("#currentWeather, #forecast").css("display", "block");
});

//Listen if one of the previouly searched cities' dynamically genereted button is clicked
$(document).on("click", ".city-button", function () {
    var location = $(this).attr("data-city");
    query(location);
    queryForecast(location);
    $("#currentWeather, #forecast").css("display", "block");
});

function formatDate(date) {
    var fDate = date.split(" ")[0].split("-");
    fDate = fDate[1] + "/" + fDate[2] + "/" + fDate[0];
    return fDate;
}

function queryForecast(location) {

    //query building...
    var APIKey = "e42ce6fff3cc019aac43965299686295";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var forecast = response.list;
        for (var i = 0; i < forecast.length; i++) {
            var cardNumber = 0;
            if (i === 0)
                cardNumber = 0;
            if (i === 6)
                cardNumber = 1;
            if (i === 14)
                cardNumber = 2;
            if (i === 22)
                cardNumber = 3;
            if (i === 30)
                cardNumber = 4;

            if (i === 0 || i === 6 || i === 14 || i === 22 || i === 30) {
                var date = forecast[i].dt_txt;
                var temperature = forecast[i].main.temp;
                var humidity = forecast[i].main.humidity;
                var condition = forecast[i].weather[0].main;
                addCard(cardNumber, date, temperature, humidity, condition);
            }
        }
    });
}

function query(location) {
    //query building
    var APIKey = "e42ce6fff3cc019aac43965299686295";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        //query building...
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (uvresponse) {
            renderCurrentWeather(response.name, response.main.temp, response.main.humidity, response.wind.speed, uvresponse.value, response.weather[0].main);
        });


    });

}

function addCard(index, date, temperature, humidity, condition) {

    var card = $("<div>");
    card.addClass("card bg-primary text-white");

    var cardBody = $("<div>");
    cardBody.addClass("card-body");

    var title = $("<h5>");
    title.addClass("card-title font-weight-bold");
    title.css("font-size", "large");
    date = formatDate(date);
    title.text(date);

    var icon = $("<span>");
    icon.addClass(getIcon(condition));

    var t = $("<p>");
    t.addClass("card-text pt-3");
    t.text("Temp: ");
    t.append(`${temperature} °F`);

    var h = $("<p>");
    h.addClass("card-text pt-3");
    h.text(`Humidity: ${humidity}%`);

    cardBody.append(title);
    cardBody.append(icon);
    cardBody.append(t);
    cardBody.append(h);

    card.append(cardBody);

    $("#" + index).empty().append(card);
}

function addButton(location) {

    var button = $("<button>");
    button.addClass("list-group-item list-group-item-action city-button");
    button.attr("type", "button");
    button.attr("data-city", location);
    button.text(location)
    $("#history").append(button);

    if (localStorage.getItem("locations")) {
        //if set get it and check if we need to create new    

        locations = JSON.parse(localStorage.getItem("locations"));
        var index = -1;
        for (var i = 0; i < locations.length; i++) {
            // id found
            if (locations[i] === location) {
                index = i;
            }
        }
        //if index is -1 id was not found and we need to create a new 
        if (index === -1) {
            locations.push(location);
        } else {
            locations[index] = location;
        }
    } else {
        locations.push(location);
    }
    //update locations iten on local storage
    localStorage.setItem("locations", JSON.stringify(locations));
}

function setUp() {
    if (localStorage.getItem("locations")) {
        locations = JSON.parse(localStorage.getItem("locations"));
        for (var i = 0; i < locations.length; i++) {
            addButton(locations[i]);
        }
    }

}

//set up when ready
$(setUp()); 
