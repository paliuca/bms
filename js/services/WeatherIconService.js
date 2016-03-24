'use strict';

module.exports = function() {    

    var icons = [];
    icons['200'] = 'wi wi-thunderstorm'; //thunderstorm with light rain
    icons['201'] = 'wi wi-thunderstorm'; //thunderstorm with rain
    icons['202'] = 'wi wi-thunderstorm'; //thunderstorm with heavy rain
    icons['210'] = 'wi wi-thunderstorm'; //light thunderstorm
    icons['211'] = 'wi wi-thunderstorm'; //thunderstorm
    icons['212'] = 'wi wi-thunderstorm'; //heavy thunderstorm
    icons['221'] = 'wi wi-thunderstorm'; //ragged thunderstorm
    icons['230'] = 'wi wi-thunderstorm'; //thunderstorm with light drizzle
    icons['231'] = 'wi wi-thunderstorm'; //thunderstorm with drizzle
    icons['232'] = 'wi wi-thunderstorm'; //thunderstorm with heavy drizzle

    icons['300'] = 'wi wi-showers'; //light intensity drizzle
    icons['301'] = 'wi wi-showers'; //drizzle
    icons['302'] = 'wi wi-showers'; //heavy intensity drizzle
    icons['310'] = 'wi wi-showers'; //light intensity drizzle rain
    icons['311'] = 'wi wi-showers'; //drizzle rain
    icons['312'] = 'wi wi-showers'; //heavy intensity drizzle rain
    icons['313'] = 'wi wi-showers'; //shower rain and drizzle
    icons['314'] = 'wi wi-showers'; //heavy shower rain and drizzle
    icons['321'] = 'wi wi-showers'; //shower drizzle

    icons['500'] = 'wi wi-showers'; //light rain
    icons['501'] = 'wi wi-showers'; //moderate rain
    icons['502'] = 'wi wi-showers'; //heavy intensity rain
    icons['503'] = 'wi wi-showers'; //very heavy rain
    icons['504'] = 'wi wi-showers'; //extreme rain
    icons['511'] = 'wi wi-snow'; //freezing rain
    icons['520'] = 'wi wi-rain'; //light intensity shower rain
    icons['521'] = 'wi wi-rain'; //shower rain
    icons['522'] = 'wi wi-rain'; //heavy intensity shower rain
    icons['531'] = 'wi wi-rain'; //ragged shower rain

    icons['600'] = 'wi wi-snow'; //light snow
    icons['601'] = 'wi wi-snow'; //snow
    icons['602'] = 'wi wi-snow'; //heavy snow
    icons['611'] = 'wi wi-snow'; //sleet
    icons['612'] = 'wi wi-snow'; //shower sleet
    icons['615'] = 'wi wi-snow'; //light rain and snow
    icons['616'] = 'wi wi-snow'; //rain and snow
    icons['620'] = 'wi wi-snow'; //light shower snow
    icons['621'] = 'wi wi-snow'; //shower snow
    icons['622'] = 'wi wi-snow'; //heavy shower snow

    icons['701'] = 'wi wi-fog'; //mist
    icons['711'] = 'wi wi-fog'; //smoke
    icons['721'] = 'wi wi-fog'; //haze
    icons['731'] = 'wi wi-fog'; //sand, dust whirls
    icons['741'] = 'wi wi-fog'; //fog
    icons['751'] = 'wi wi-fog'; //sand
    icons['761'] = 'wi wi-fog'; //dust
    icons['762'] = 'wi wi-fog'; //volcanic ash
    icons['771'] = 'wi wi-fog'; //squalls
    icons['781'] = 'wi wi-fog'; //tornado

    icons['800'] = 'wi wi-day-sunny'; //clear sky
    icons['801'] = 'wi wi-day-cloudy'; //few clouds
    icons['802'] = 'wi wi-cloudy'; //scattered clouds
    icons['803'] = 'wi wi-cloudy'; //broken clouds
    icons['804'] = 'wi wi-cloudy'; //overcast clouds
    return {
        getIcon : function(key) {
            return icons[key];
        },
        getMock: function(){
            return icons[200];
        }
    }
}