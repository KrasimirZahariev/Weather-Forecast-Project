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
    var timestamp = data.dt;
    var weather = data.weather[0].main;
    var weatherID = data.weather[0].id;
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

    setWeatherIcon(weatherID);

    $(".test").html(
        "City: " + cityName + "</br>" +
        "Country: " + country + "</br>" +
        "weather: " + weather + "</br>" +
        "id:" + weatherID + "</br>" +
        "description: " + description + "</br>" +
        "temp: " + temp + "</br>" +
        "MaxTemp: " + maxTemp + "</br>" +
        "minTemp: " + minTemp + "</br>" +
        "time: " + timeConversion(new Date(timestamp))+ "</br>" +
        "sunrise: " + timeConversion(new Date(sunrise))+ "</br>"
    );
}

function setWeatherIcon(weatherID) {
    var weatherIcon;
    switch((weatherID.toString()).charAt(0)) {
        case "2" : weatherIcon = "wi wi-thunderstorm";
            break;
        case "3" : weatherIcon = "wi wi-rain";
            break;
        case "5" : weatherIcon = "wi wi-rain";
            break;
        case "6" : weatherIcon = "wi wi-snow";
            break;
        case "7" : weatherIcon = "wi wi-dust";
            break;
        case "8" : weatherIcon = "wi wi-day-sunny";
            break;
    }
    $(".current i").removeClass().addClass(weatherIcon);

}

function timeConversion(timestamp) {
    var date = new Date(timestamp*1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}
