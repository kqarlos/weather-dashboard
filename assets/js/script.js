function setCurrentWeather(location, temperature, humidity, windSpeed, uv) {

    $("#location").empty();
    $("#location").append(location);
    $("#temperature").empty();
    $("#temperature").append(temperature);;
    $("#humidity").empty();
    $("#humidity").append(humidity);
    $("#windSpeed").empty();
    $("#windSpeed").append(windSpeed);;
    $("#uv").empty();
    $("#uv").append(uv);
}



$("button").on("click", function () {
    event.preventDefault();
    console.log("clicked");
    var location = $("#locationInput").val();

    var APIKey = "e42ce6fff3cc019aac43965299686295";
    var city = location;
    console.log(city);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);

        setCurrentWeather(response.name, response.main.temp, response.main.humidity, response.wind.speed, 0);
    });

});