import { getWeather } from "./weather";
import { getCity } from "./geolocation";

function initializeApp() {
    navigator.geolocation.getCurrentPosition(success, error);

    function success({ coords }) {
        getWeather(
            coords.latitude,
            coords.longitude,
            Intl.DateTimeFormat().resolvedOptions().timeZone
        )
            .then((response) => {
                renderWeather(response);
            })
            .catch((error) => {
                console.error(error);
            });
        renderCity(coords);
        renderDate();
        renderGreeting();
        renderTime();
    }

    function error() {
        alert(
            "There was an error getting your location. Check your permissions."
        );
    }
}

function renderCity({ latitude, longitude }) {
    getCity(latitude, longitude).then((city) => {
        setValue("location", city);
    });
}

function renderDate() {
    setValue("date", DATE_FORMATTER.format(new Date()));
}

function renderTime() {
    setValue("time", TIME_FORMATTER.format(new Date().getTime()));
}

function renderGreeting() {
    const hours = new Date().getHours();
    let greeting;

    if (hours < 12) {
        greeting = "Good Morning";
    } else if (hours < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    setValue("greeting", greeting);
}

function renderWeather({ current, daily, hourly }) {
    renderCurrentWeather(current);
    renderDailyWeather(daily);
    renderHourlyWeather(hourly);

    document.body.classList.remove("blurred");
}

function renderCurrentWeather(current) {
    const currentWeather = document.querySelector(".current-weather");
    setValue("temp", current.temperature, currentWeather);
    setValue("wind-speed", current.wind, currentWeather);
    setValue("humidity", current.humidity, currentWeather);
    setValue("condition", current.condition, currentWeather);
}

function renderDailyWeather(daily) {
    const dailyWeather = document.querySelector(".daily-forecast");
    const dayForecastCard = dailyWeather.querySelector(".forecast");

    dailyWeather.innerHTML = "";
    daily.forEach((day) => {
        if (day.timestamp < Date.now()) {
            return;
        }
        const dayForecastElement = dayForecastCard.cloneNode(true);
        setValue(
            "day",
            DAY_FORMATTER.format(day.timestamp),
            dayForecastElement
        );
        setValue("temp", day.temperature, dayForecastElement);
        setValue("condition", day.condition, dayForecastElement);

        dailyWeather.append(dayForecastElement);
    });
}

function renderHourlyWeather(hourly) {
    const hourlyWeather = document.querySelector(
        ".hourly-forecast .forecast-container"
    );
    const hourlyForecastCard = hourlyWeather.querySelector(".forecast");

    hourlyWeather.innerHTML = "";
    hourly.forEach((hour) => {
        const date = new Date(hour.timestamp).getDate();
        const currentDate = new Date().getDate();
        if (hour.timestamp < Date.now() || date !== currentDate) {
            return;
        }

        const hourlyForecastElement = hourlyForecastCard.cloneNode(true);

        setValue(
            "time",
            HOUR_FORMATTER.format(hour.timestamp),
            hourlyForecastElement
        );
        setValue("temp", hour.temperature, hourlyForecastElement);
        setValue("condition", hour.condition, hourlyForecastElement);

        hourlyWeather.append(hourlyForecastElement);
    });
}

// Helper functions
function setValue(attribute, value, parent = document) {
    parent.querySelector(`[data-${attribute}]`).textContent = value;
}

const DAY_FORMATTER = new Intl.DateTimeFormat("en-US", { weekday: "short" });

const HOUR_FORMATTER = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

initializeApp();
