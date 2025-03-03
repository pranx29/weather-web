import axios from "axios";

export async function getWeather(lat, long, timezone) {
    const url = "https://api.open-meteo.com/v1/forecast";

    const params = {
        latitude: lat,
        longitude: long,
        timezone: timezone,
        current:
            "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
        daily: "temperature_2m_max,weather_code",
        hourly: "temperature_2m,weather_code",
        timeformat: "unixtime",
    };

    return axios.get(url, { params }).then((response) => {
        return {
            current: pasrseCurrentWeather(response.data),
            daily: parseDailyWeather(response.data),
            hourly: parseHourlyWeather(response.data),
        };
    });
}

function pasrseCurrentWeather({ current }) {
    return {
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        wind: current.wind_speed_10m,
        condition: getWeatherCondition(current.weather_code),
    };
}

function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            temperature: Math.round(daily.temperature_2m_max[index]),
            condition: getWeatherCondition(daily.weather_code[index]),
        };
    });
}

function parseHourlyWeather({ hourly, current }) {
    return hourly.time
        .map((time, index) => {
            return {
                timestamp: time * 1000,
                temperature: Math.round(hourly.temperature_2m[index]),
                condition: getWeatherCondition(hourly.weather_code[index]),
            };
        })
        .filter(({ timestamp }) => {
            return timestamp > Date.now();
        });
}

function getWeatherCondition(code) {
    const conditions = {
        0: "Clear",
        1: "Partly Cloudy",
        2: "Cloudy",
        3: "Cloudy",
        45: "Mist",
        48: "Fog",
        51: "Drizzle",
        61: "Rain",
        71: "Snow",
    };
    return conditions[code] || "Unknown";
}
