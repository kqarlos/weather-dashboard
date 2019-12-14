var locations = [];

function renderCurrentWeather(location, temperature, humidity, windSpeed, uv) {
    $("#location").empty();
    $("#location").append(location);
    $("#temperature").empty();
    $("#temperature").append(temperature);
    $("#humidity").empty();
    $("#humidity").append(humidity);
    $("#windSpeed").empty();
    $("#windSpeed").append(windSpeed);
    $("#uv").empty();
    $("#uv").append(uv);
}

$("#searchLocation").on("click", function () {
    event.preventDefault();
    var location = $("#locationInput").val();
    $("#locationInput").val("");

    query(location);
    queryForecast(location)

    addButton(location);

    $("#currentWeather").css("display", "block");
    $("#forecast").css("display", "block");


});

$(document).on("click", ".city-button", function () {
    var location = $(this).attr("data-city");
    query(location);
    queryForecast(location);
});

function queryForecast(location) {

    //query building...
    var APIKey = "e42ce6fff3cc019aac43965299686295";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=imperial&cnt=5&appid=" + APIKey;
    http://api.openweathermap.org/data/2.5/forecast?q=London&appid=e42ce6fff3cc019aac43965299686295

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
        var forecast = response.list;
        for (var i = 0; i < forecast.length; i++) {
            var date = forecast[i].dt_txt;
            var temperature = forecast[i].main.temp;
            var humidity = forecast[i].main.humidity;
            addCard(i, date, temperature, humidity);
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
        // console.log(queryURL);
        // console.log(response);
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        //query building...
        APIKey = "e42ce6fff3cc019aac43965299686295";
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (uvresponse) {
            // console.log(queryURL);
            // console.log(uvresponse);
            renderCurrentWeather(response.name, response.main.temp, response.main.humidity, response.wind.speed, uvresponse.value);
        });


    });

}

function addCard(index, date, temperature, humidity) {

    console.log("creating card #: " + index);

    var card = $("<div>");
    card.addClass("card");
    card.addClass("bg-primary");

    var cardBody = $("<div>");
    cardBody.addClass("card-body");

    var title = $("<h5>");
    title.addClass("card-title");
    title.text(date);

    var t = $("<p>");
    t.addClass("card-text");
    t.text(temperature);

    var h = $("<p>");
    h.addClass("card-text");
    h.text(humidity);

    cardBody.append(title);
    cardBody.append(t);
    cardBody.append(h);
    console.log("comleted card body: ");
    console.log(cardBody);

    card.append(cardBody);
    console.log("comleted card: ");
    console.log(card);

    $("#" + index).empty();
    $("#" + index).append(card);
}

function addButton(location) {

    var button = $("<button>");
    button.addClass("list-group-item list-group-item-action city-button");
    button.attr("type", "button");
    button.attr("data-city", location);
    button.text(location)
    $("#history").append(button);

    // <button type="button" class="list-group-item list-group-item-action">Cras justo odio</button>

}