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

    addButton(location);


});

$(document).on("click", ".city-button", function () {
    console.log("clicked");
    var location = $(this).attr("data-city");
    query(location);
});

function query(location) {
    //query building
    var APIKey = "e42ce6fff3cc019aac43965299686295";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        //query building...
        APIKey = "e42ce6fff3cc019aac43965299686295";
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (uvresponse) {
            console.log(queryURL);
            console.log(uvresponse);
            renderCurrentWeather(response.name, response.main.temp, response.main.humidity, response.wind.speed, uvresponse.value);
        });


    });

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