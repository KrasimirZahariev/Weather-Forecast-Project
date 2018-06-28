$(document).ready(function() {
    $(".searchButton").on('click', function() {
       var $location = $(".searchBox").val();
       if(location != "") {
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather?q=" + $location + 
                "&units=metric&APPID=d8df22d5293c881d155481528cea7dfb",
                type: "GET",
                dataType: "jsonp",
                success: function(data) {
                    setCurrentDay(data);
                }
            });    
       } else {
           //error msg
       }
    });
});

function setCurrentDay(data) {
    var cityName = data.name;
    var country = data.sys.country;
    var weather = data.weather[0].main;
    var description = data.weather[0].description; 
    var temp = data.main.temp;
    var maxTemp = data.main.temp_max;
    var minTemp = data.main.temp_min;
    var windSpeed = data.wind.speed;
    var windDir = data.wind.deg;
    var clouds = data.clouds.all;
    var pressure = data.main.pressure;
    var humidity = data.main.humitidty;
    var sunrise = data.sys.sunrise;
    var sunset = data.sys.sunset;

    $(".test").html(
        "City: " + cityName + "</br>" +
        "Country: " + country + "</br>" +
        "weather: " + weather + "</br>" +
        "description: " + description + "</br>" +
        "temp: " + temp + "</br>" +
        "MaxTemp: " + maxTemp + "</br>" +
        "minTemp: " + minTemp + "</br>"
    );
}


// data.weather[0].main
// data.weather[0].descriptiondata.main.temp
// data.main.pressure
// data.main.humitidty
// data.main.temp_min
// data.main.temp_maxdata.wind.speed
// data.wind.degdata.clouds.alldata.sys.country
// data.sys.sunrise
// data.sys.sunset
// data.name