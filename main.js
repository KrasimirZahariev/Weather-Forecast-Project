var rawOffset;
var dstOffset;
var sunrise;
var sunset;
var localTime;

$(document).ready(function() {
    $(".searchButton").on('click', function() {
        var $location = $(".searchBox").val();
        $(".searchBox").val("");

        if($location === "") {
            return;
        }

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + $location + 
            "&units=metric&APPID=d8df22d5293c881d155481528cea7dfb",
            type: "GET",
            dataType: "jsonp",
            success: function(data) {
                setCurrentDay(data);       
            }
        });
    });
});

// CURRENY DAY

function setCurrentDay(data) {
    var cityName = data.name;
    var country = data.sys.country;
    var lon = data.coord.lon;
    var lat = data.coord.lat;
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
    sunrise = data.sys.sunrise;
    sunset = data.sys.sunset;

    setOffset(lon, lat);

    localTime = getLocalTime(rawOffset, dstOffset);
    sunrise = timeConversion(sunrise, rawOffset, dstOffset);
    sunset = timeConversion(sunset, rawOffset, dstOffset);
    var isDay = isDayTime(localTime, sunrise, sunset);

    var weatherIcon = setWeatherIcon(weatherID, isDay);
    setBackground(weatherID, isDay);

    var date = getDate(timestamp);
    
    // SETTING MAIN INFO
    $("#mainLoc").html(cityName + ", " + country);
    $("#currentDate").html(date +", " + localTime);
    $("#currentIcon").removeClass().addClass(weatherIcon);
    $("#mainTemp").html(Math.floor(temp));
    $("#mainDescr").html(description);
    $("#windSpeed").html(windSpeed + " m/s");
    $("#windIcon").removeClass().addClass(getWindIcon(windDir));
    $("#pressure").html(pressure + " hPa");
    $("#clouds").html(clouds + "%");
    $("#sunrise").html(sunrise);
    $("#sunset").html(sunset);

    //SETTING INFO FOR THE CURRENT DAY IN THE 5 DAY FORECAST SECTION
    $("#todayIcon").removeClass().addClass(weatherIcon);
    $("#currentDayMinTemp").html(Math.floor(minTemp));
    $("#currentDayMaxTemp").html(Math.floor(maxTemp));
    $("#todayDescr").html(weather);


    $location = cityName + "," + country;
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + $location + 
        "&units=metric&APPID=d8df22d5293c881d155481528cea7dfb",
        type: "GET",
        dataType: "jsonp",
        success: function(forecastData) {
            setForecastData(forecastData);  
        }
    });
}

function setOffset(lon, lat) {
    var $timestamp = Math.floor(new Date().getTime() / 1000);
    googleData = JSON.parse(
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/timezone/" + 
                "json?location=" + lat + "," + lon +"&timestamp=" + $timestamp + "&key=" +
                "AIzaSyARiZ40ctMPljbZYSsAJWdKdVZASyzR_0o",
            type: 'GET',
            dataType: 'json',
            async: false,
        }).responseText);

    rawOffset = googleData.rawOffset;
    dstOffset = googleData.dstOffset;
}

function getLocalTime(rawOffset, dstOffset) {
    var time = new Date().getTime();
    time = +(time) - 3*60*60*1000 + +(rawOffset)*1000 + +(dstOffset)*1000;
    var date = new Date(time);
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();

    return hours.substr(-2) + ':' + minutes.substr(-2);
}

function timeConversion(timestamp, rawOffset, dstOffset) {
    var time = +(timestamp) + +(rawOffset) + +(dstOffset) - 3*60*60;
    var date = new Date(time*1000);
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();
    
    return hours.substr(-2) + ':' + minutes.substr(-2);
}

function isDayTime(localTime, sunrise, sunset) {
    
    return localTime > sunrise && localTime < sunset;
}

function getDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var day = date.getDate();
    var month = +(date.getMonth()) + 1;

    if(month < 10) {
        month = "0" + month;
    }

    if(day < 10) {
        day = "0" + day;
    }

    return day + "." + month;
}

function setWeatherIcon(weatherID, isDay) {
    var weatherIcon;
    switch((weatherID.toString()).charAt(0)) {
        case "2" : 
            weatherIcon = "wi wi-thunderstorm";
            break;
        case "3" : 
            weatherIcon = "wi wi-rain";
            break;
        case "5" : 
            weatherIcon = "wi wi-rain";
            break;
        case "6" : 
            weatherIcon = "wi wi-snow";
            break;
        case "7" : 
            weatherIcon = "wi wi-dust";
            break;
        case "8" :
            if(isDay) {
                if(weatherID.toString().charAt(2) == 0) {
                    weatherIcon = "wi wi-day-sunny";
                } else if(weatherID.toString().charAt(2) == 1) {
                    weatherIcon = "wi wi-day-sunny-overcast";
                } else {
                    weatherIcon = "wi wi-cloudy";
                }
            } else {
                if(weatherID.toString().charAt(2) == 0) {
                    weatherIcon = "wi wi-night-clear";
                } else if(weatherID.toString().charAt(2) == 1) {
                    weatherIcon = "wi wi-night-partly-cloudy";
                } else {
                    weatherIcon = "wi wi-cloudy";
                }    
            } 
            break;
    }
    
    return weatherIcon;
}

function setBackground(weatherID, isDay) {
    switch((weatherID.toString()).charAt(0)) {
        case "2" : 
            $("body").css("background-image", "url(css/images/thunderstorm.jpg)");
            break;
        case "3" : 
            $("body").css("background-image", "url(css/images/rain.jpg)");
            break;
        case "5" : 
            $("body").css("background-image", "url(css/images/rain.jpg)");
            break;
        case "6" : 
            $("body").css("background-image", "url(css/images/snow.jpg)");
            break;
        case "7" : 
            $("body").css("background-image", "url(css/images/fog.jpg)");
            break;
        case "8" :
            if(isDay) {
                if(weatherID.toString().charAt(2) == 0) {
                    $("body").css("background-image", "url(css/images/sunny.jpg)");
                } else if(weatherID.toString().charAt(2) == 1) {
                    $("body").css("background-image", "url(css/images/sunny-overcast.jpg)");
                } else {
                    $("body").css("background-image", "url(css/images/cloudy.jpg)");
                }
            } else {
                if(weatherID.toString().charAt(2) == 0) {
                    $("body").css("background-image", "url(css/images/night-clear.jpg)");
                } else if(weatherID.toString().charAt(2) == 1) {
                    $("body").css("background-image", "url(css/images/night-partly-cloudy.jpg)");
                } else {
                    $("body").css("background-image", "url(css/images/night-cloudy.jpg)");
                }    
            } 
            break;
    }
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

function setForecastData(forecastData) {
    setNextDays(forecastData);
    setHourly(forecastData);
}

// NEXT DAYS

function setNextDays(forecastData) {
    var forecast = forecastData.list;
    
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", 
                "Thursday", "Friday", "Saturday"];

    var timestamp = forecast[0].dt;
    var date = new Date(+((timestamp) + +(rawOffset))*1000);
    var currentDay = date.getDay() + 1;
    for(var i = 1; i < 6; i++) {
        $("#day" + i).html(days[currentDay]);
        currentDay++;
        if(currentDay > 6) {
            currentDay = 0;
        }
    }

    // var currentDate = date.getDate();
    // var dayCounter = 0;
    // for(var i = 0; i < forecast.length; i++) {
    //     if(forecast[i].dt !== currentDate) {
    //         weatherID = forecast[i].weather[0].id;
    //         icon = setWeatherIcon(weatherID, false)
    //         $(("#day" + i)).removeClass().addClass(icon);
    //         dayCounter++;
    //         currentDate = new Date(+((forecast[i].dt) + +(rawOffset))*1000);
    //     }    
    // }
    
}

// HOURLY

function setHourly(forecastData) {
    var forecast = forecastData.list;
    var hour, icon, isDay, weatherID, temp, weather;
    for(var i = 0; i < 8; i++) {
        hour = timeConversion(forecast[i].dt, rawOffset, dstOffset);
        $(("#hour" + i)).html(hour);

        weatherID = forecast[i].weather[0].id;
        isDay = isDayTime(hour, sunrise, sunset);
        icon = setWeatherIcon(weatherID, isDay)
        $(("#hourIcon" + i)).removeClass().addClass(icon);

        temp = Math.floor(forecast[i].main.temp);
        $("#hourTemp" + i).html(temp);

        weather = forecast[i].weather[0].main;
        $("#hourDescr" + i).html(weather);
    }
}
