const apiKey = '2038258c7f7b318c3f40477a491f3c9f';

$(document).ready(function () {
  // Display previous searches from local storage
  displayPreviousSearches();
  // Load initial forecast cards with placeholder text
  loadForecastCards();

  // Event listener for search button
  $('#search-button').on('click', function () {
    getWeather();
  });

  // Function to load forecast cards with placeholder text
  function loadForecastCards() {
    const forecastElement = $('#forecast');
    forecastElement.empty();

    // Placeholder for current weather
    $('#current-weather').html(`
      <h2>Location</h2>
      <p>Date</p>
      <p>Temp:  °F</p>
      <p>Wind: MPH</p>
      <p>Humidity: %</p>
    `);

    // Placeholder for 5-day forecast
    for (let i = 0; i < 5; i++) {
      forecastElement.append(`
        <div class="forecast-card">
          <p>Date: </p>
          <p>Temp:    °F</p>
          <p>Wind:    MPH</p>
          <p>Humidity:    %</p>
        </div>
      `);
    }
  }

  // Function to get weather data from OpenWeather API
  function getWeather() {
    const city = $('#city').val();
    if (city) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

      // Fetch geographic coordinates
      $.getJSON(geoUrl, function (data) {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

          // Fetch weather forecast data
          $.getJSON(weatherUrl, function (data) {
            displayWeather(data, city);
          });
        }
      });
    }
  }

  // Function to display weather data
  // function displayWeather(data, city) {
  //   const currentWeather = data.list[0];
  //   const weatherIcon = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
  //   const now = new Date();
  //   const options = {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   };
  //   const currentDate = now.toLocaleDateString('en-US', options);

  //   // Update current weather display
  //   $('#current-weather').html(`
  //     <h2>${city} <img src="${weatherIcon}" alt="weather icon"></h2>
  //     <p>${currentDate}</p>
  //     <p>Temp: ${currentWeather.main.temp} °F</p>
  //     <p>Wind: ${currentWeather.wind.speed} MPH</p>
  //     <p>Humidity: ${currentWeather.main.humidity} %</p>
  //   `);

  //   forecastElement = $('#forecast');
  //   forecastElement.empty();

  //   // Update 5-day forecast display
  //   for (let i = 0; i < data.list.length; i += 8) {
  //     const forecast = data.list[i];
  //     const date = new Date(forecast.dt_txt);
  //     const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  //     const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

  //     forecastElement.append(`
  //       <div class="forecast-card">
  //         <p class="text-center"><b>${dayOfWeek}</b></p>
  //         <p class="text-center">${date.toLocaleDateString()}</p>
  //         <img src="${weatherIcon}" alt="weather icon">
  //         <p>Temp: ${forecast.main.temp} °F</p>
  //         <p>Wind: ${forecast.wind.speed} mph</p>
  //         <p>Humidity: ${forecast.main.humidity} %</p>
  //       </div>
  //     `);
  //   }

  //   // Save search to local storage
  //   saveSearch(city);
  //   // Display updated previous searches
  //   displayPreviousSearches();
  // }

  function displayWeather(data, city) {
    const currentWeather = data.list[0];
    const weatherIcon = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const currentDate = now.toLocaleDateString('en-US', options);

    $('#current-weather').html(`
      <h2>${city} <img src="${weatherIcon}" alt="weather icon"></h2>
      <p>${currentDate}</p>
      <p>Temp: ${currentWeather.main.temp} °F</p>
      <p>Wind: ${currentWeather.wind.speed} MPH</p>
      <p>Humidity: ${currentWeather.main.humidity} %</p>
    `);

    const forecastElement = $('#forecast');
    forecastElement.empty();

    // Update 5-day forecast display
    for (let i = 4; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const date = new Date(forecast.dt_txt);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

      forecastElement.append(`
        <div class="forecast-card">
          <p class="text-center"><b>${dayOfWeek}</b></p>
          <p class="text-center">${date.toLocaleDateString()}</p>
          <img src="${weatherIcon}" alt="weather icon">
          <p>Temp: ${forecast.main.temp} °F</p>
          <p>Wind: ${forecast.wind.speed} mph</p>
          <p>Humidity: ${forecast.main.humidity} %</p>
        </div>
      `);
    }

    saveSearch(city);
    displayPreviousSearches();
  }

  // Function to save search to local storage
  function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(city)) {
      searches.push(city);
    }
    localStorage.setItem('searches', JSON.stringify(searches));
  }

  // Function to display previous searches from local storage
  function displayPreviousSearches() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    const previousSearches = $('#previous-searches');
    previousSearches.empty();

    searches.forEach((city) => {
      const button = $('<button>')
        .addClass('btn btn-secondary btn-block mb-2')
        .text(city)
        .on('click', function () {
          $('#city').val(city);
          getWeather();
        });
      previousSearches.append(button);
    });
  }
});
