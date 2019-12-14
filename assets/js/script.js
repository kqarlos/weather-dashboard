var locations = [];

function renderCurrentWeather(location, temperature, humidity, windSpeed, uv) {
    $("#location").empty();
    $("#location").append(location);
    $("#location").append(" ");
     var date = moment().format("MM" + "/" + "DD" + "/" + "YYYY");
    $("#location").append(date);


    $("#temperature").empty();
    $("#temperature").append(temperature);
    $("#temperature").append(" °F");

    $("#humidity").empty();
    $("#humidity").append(humidity);
    $("#humidity").append("%");

    $("#windSpeed").empty();
    $("#windSpeed").append(windSpeed);
    $("#windSpeed").append(" MPH");

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

function formatDate(date) {
    var fDate = date.split(" ")[0].split("-");
    fDate = fDate[1] + "/" + fDate[2] + "/" + fDate[0];
    return fDate;
}

function queryForecast(location) {

    //query building...
    var APIKey = "e42ce6fff3cc019aac43965299686295";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=imperial&appid=" + APIKey;
    http://api.openweathermap.org/data/2.5/forecast?q=London&appid=e42ce6fff3cc019aac43965299686295

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
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
                addCard(cardNumber, date, temperature, humidity);
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
            // console.log(queryURL);
            // console.log(uvresponse);
            renderCurrentWeather(response.name, response.main.temp, response.main.humidity, response.wind.speed, uvresponse.value);
        });


    });

}

function addCard(index, date, temperature, humidity) {

    // console.log("creating card #: " + index);

    var card = $("<div>");
    card.addClass("card");
    card.addClass("bg-primary text-white");

    var cardBody = $("<div>");
    cardBody.addClass("card-body");

    var title = $("<h5>");
    title.addClass("card-title font-weight-bold");
    // console.log("date: ");
    date = formatDate(date);
    // var fDate = date.split(" ")[0].split("-");
    // fDate = fDate[1] + "/" + fDate[2] + "/" + fDate[0];
    title.text(date);

    var t = $("<p>");
    t.addClass("card-text");
    t.text("Temp: ");
    t.append(temperature);
    t.append(" °F");


    var h = $("<p>");
    h.addClass("card-text pt-3");
    h.text("Humidity: ");
    h.append(humidity);
    h.append("%");


    cardBody.append(title);
    cardBody.append(t);
    cardBody.append(h);
    // console.log("comleted card body: ");
    // console.log(cardBody);

    card.append(cardBody);
    // console.log("comleted card: ");
    // console.log(card);

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