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

$("button").on("click", function () {
    event.preventDefault();
    var location = $("#locationInput").val();
    //query bulding...
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

});