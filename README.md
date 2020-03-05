# Weather Dashboard

The weather Dashboard is a clean and easy to use application that gets straigh to the point. Type in a city, get the current weather and a 5 day forecast. This application keeps a list of previously searched cities for convinience.

## Getting Started

This application is compatible with the most commonly used web browsers.

## Site Pictures

1. Live

![Site](assets/images/weather-live.gif)

2. After a couple of inputs 

![Site](assets/images/2.png)


3. Upon exiting and coming back to the page search history remains

![Site](assets/images/3.png)

4. Clicking in one of the recorded history buttons gives the same result as searching for the city again

![Site](assets/images/4.png)



## Code Snippets


1. queryForecast();

This functions will query the Open Weather Forecast API. This query was special because it returned an object with 40 different weather forecasts based on day and hour. To get the information I need I had to transverse the response I got from the query and look up where in the results array it switched to a new day. This explains the _if/else_ statements. These, then, had to then be mapped to their corresponding card numbers. Once this was done it would call _addCard()_ to dynamically create the forecast card with the query information.

```javascript

function queryForecast(location) {

    //query building...
    var APIKey = "e42ce6fff3cc019aac43965299686295";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(queryURL);
        // console.log(response);
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
    
```


2. addCard();

This function will dynamically generate a card with the provided information. I use jQuery to create the _div_ the will contain the card and the different elements that will go inside the card like _p_ and _h5_. Using jQuery I use functions like _addClass()_ to add one or more classes, _text()_ to insert text tot eh element and _append()_ to bring all the element toguether into one card. This card is the added to an element in the _index.html_ file after being empties with the _empty()_ function.

```javascript

function addCard(index, date, temperature, humidity) {
    var card = $("<div>");
    card.addClass("card");
    card.addClass("bg-primary text-white");

    var cardBody = $("<div>");
    cardBody.addClass("card-body");

    var title = $("<h5>");
    title.addClass("card-title font-weight-bold");
    date = formatDate(date);
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
    card.append(cardBody);

    $("#" + index).empty();
    $("#" + index).append(card);
}

```



## Built With

* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Bootstrap](https://getbootstrap.com/)
* [Javascript](https://www.javascript.com/)
* [Moment.js](https://momentjs.com/docs/)
* [Open Weather API](https://openweathermap.org/api)

## Deployed Link

* [See Live Site](https://kqarlos.github.io/weather-dashboard)

## Author

 * **Carlos Toledo** 

## Links

- [Link to Day Weather Dashboard](https://github.com/kqarlos/weather-dashboard)
- [Link to Github](https://www.github.com/kqarlos)
- [Link to LinkedIn](https://www.linkedin.com/in/carlos-toledo415/)


## Acknowledgments

* [W3 Schools](https://www.w3schools.com/)
* [Bootstrap components](https://getbootstrap.com/docs/4.4/components/navbar/)
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)