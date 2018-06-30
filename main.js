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

    var isDay = isDayTime(timestamp, sunrise, sunset);
    setWeatherIcon(weatherID, isDay);

    // $(".test").html(
    //     "City: " + cityName + "</br>" +
    //     "Country: " + country + "</br>" +
    //     "weather: " + weather + "</br>" +
    //     "id:" + weatherID + "</br>" +
    //     "description: " + description + "</br>" +
    //     "temp: " + temp + "</br>" +
    //     "MaxTemp: " + maxTemp + "</br>" +
    //     "minTemp: " + minTemp + "</br>" +
    //     "time: " + timeConversion(new Date(timestamp)) + "</br>" +
    //     "sunrise: " + timeConversion(new Date(sunrise)) + "</br>" +
    //     "sunset: " + timeConversion(new Date(sunset)) + "</br>" +
    //     "isDay:" + isDayTime(timestamp, sunrise, sunset) + "</br>"
    // );

    // SETTING MAIN INFO
    $(".location").html(cityName + ", " + country);
    // TODO: set the date
    $(".mainTemp").html(Math.floor(temp));
    $(".mainDescr").html(description);
    $("#windSpeed").html(windSpeed + " m/s");
    $("#windIcon").removeClass().addClass(getWindIcon(windDir));
    $("#pressure").html(pressure + " hPa");
    $("#clouds").html(clouds + "%");
    //TODO: fix the time
    $("#sunrise").html(timeConversion(new Date(sunrise)));
    $("#sunset").html(timeConversion(new Date(sunset)));

    //SETTING INFO FOR THE CURRENT DAY IN THE 5 DAY FORECAST SECTION
    $("#currentDayMinTemp").html(Math.floor(minTemp));
    $("#currentDayMaxTemp").html(Math.floor(maxTemp));
    $("#todayDescr").html(weather);
}   

function setWeatherIcon(weatherID, isDay) {
    var weatherIcon;
    switch((weatherID.toString()).charAt(0)) {
        case "2" : 
            weatherIcon = "wi wi-thunderstorm";
            $("body").css("background-image", "url(css/images/thunderstorm.jpg)");
            break;
        case "3" : 
            weatherIcon = "wi wi-rain";
            $("body").css("background-image", "url(css/images/rain.jpg)");
            break;
        case "5" : 
            weatherIcon = "wi wi-rain";
            $("body").css("background-image", "url(css/images/rain.jpg)");
            break;
        case "6" : 
            weatherIcon = "wi wi-snow";
            $("body").css("background-image", "url(css/images/snow.jpg)");
            break;
        case "7" : 
            weatherIcon = "wi wi-dust";
            $("body").css("background-image", "url(css/images/fog.jpg)");
            break;
        case "8" :
            if(isDay) {
                if(weatherID.toString().charAt(2) == 0) {
                    weatherIcon = "wi wi-day-sunny";
                    $("body").css("background-image", "url(css/images/sunny.jpg)");
                } else if(weatherID.toString().charAt(2) == 1) {
                    weatherIcon = "wi wi-day-sunny-overcast";
                    $("body").css("background-image", "url(css/images/sunny-overcast.jpg)");
                } else {
                    weatherIcon = "wi wi-cloudy";
                    $("body").css("background-image", "url(css/images/cloudy.jpg)");
                }
            } else {
                if(weatherID.toString().charAt(2) == 0) {
                    weatherIcon = "wi wi-night-clear";
                    $("body").css("background-image", "url(css/images/night-clear.jpg)");
                } else if(weatherID.toString().charAt(2) == 1) {
                    weatherIcon = "wi wi-night-partly-cloudy";
                    $("body").css("background-image", "url(css/images/night-partly-cloudy.jpg)");
                } else {
                    weatherIcon = "wi wi-cloudy";
                    $("body").css("background-image", "url(css/images/night-cloudy.jpg)");
                }    
            } 
            break;
    }
    $("#currentIcon").removeClass().addClass(weatherIcon);
    $("#todayIcon").removeClass().addClass(weatherIcon);
}

function isDayTime(timestamp, sunrise, sunset) {
    var forecastTime = timeConversion(new Date(timestamp));
    var sunriseTime = timeConversion(new Date(sunrise));
    var sunsetTime = timeConversion(new Date(sunset));
    
    return forecastTime > sunriseTime && forecastTime < sunsetTime;
}

function timeConversion(timestamp) {
    var date = new Date(timestamp*1000);
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();

    return hours.substr(-2) + ':' + minutes.substr(-2);
}

function getWindIcon(windDir) {
    if(windDir == 0) {
        return "wi wi-direction-right";
    } else if(windDir < 90) {
        return "wi wi-direction-up-right";
    } else if(windDir == 90) {
        return "wi wi-direction-up";
    } else if(windDir < 180 ) {
        return "wi wi-direction-up-left";
    } else if(windDir == 180 ) {
        return "wi wi-direction-left";
    } else if(windDir < 270) {
        return "wi wi-direction-down-left";
    } else if(windDir == 270) {
        return "wi wi-direction-down";
    } else if(windDir > 270 ) {
        return "wi wi-direction-down-right";
    } 
}
