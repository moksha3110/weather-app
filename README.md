# Weather App

A comprehensive weather application built with HTML, CSS, and JavaScript that uses the OpenWeatherMap API to provide current weather, forecasts, and detailed weather information.

## Features

### Navigation

- **Overview**: Current weather conditions and favorite cities
- **Forecasts**: 5-day weather forecast
- **Details**: Detailed weather information including sunrise/sunset, temperature ranges, wind, and more
- **Alerts**: Weather alerts and warnings (demo functionality)
- **Search**: Search for weather in any city worldwide

### Key Functionality

- **Current Weather**: Real-time weather data with temperature, conditions, and key metrics
- **Search Cities**: Search for weather in any city worldwide
- **Favorite Cities**: Save and manage your favorite cities for quick access
- **5-Day Forecast**: Extended weather forecast with daily predictions
- **Detailed Information**: Comprehensive weather data including:
  - Sunrise and sunset times
  - Temperature ranges (min/max)
  - Wind speed and direction
  - Humidity and visibility
  - Atmospheric pressure
- **Geolocation**: Automatically detects your location on first visit
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Saves your favorite cities locally

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate your API key
4. The free tier includes:
   - Current weather data
   - 5-day/3-hour forecast
   - 1,000 API calls per day

### 2. Configure the App

1. Open `script.js`
2. Find the line: `this.API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key
4. Save the file

### 3. Run the Application

1. Open `index.html` in your web browser
2. The app will automatically request your location
3. If you deny location access, it will default to London
4. Start exploring the weather data!

## File Structure

```
Ex-2/
├── index.html          # Main HTML structure
├── style.css           # CSS styling and responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md           # This file
```

## Usage Guide

### Searching for Cities

1. Use the search box in the navigation bar
2. Type any city name and press Enter or click the search button
3. The app will display weather data for that city

### Managing Favorites

1. Click the heart icon next to any city name to add it to favorites
2. View all favorite cities in the Overview section
3. Click on any favorite city card to view its weather
4. Remove favorites by clicking the × button on city cards

### Navigation

- Click any item in the navigation bar to switch between sections
- Overview: Main dashboard with current weather and favorites
- Forecasts: 5-day weather predictions
- Details: Comprehensive weather information
- Alerts: Weather warnings and alerts (demo)

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## API Limits

The free OpenWeatherMap API provides:

- 1,000 calls per day
- Current weather data
- 5-day forecast
- No historical data

## Troubleshooting

### Common Issues

**"API Key Required" warning**

- Make sure you've replaced `YOUR_API_KEY_HERE` with your actual API key in `script.js`

**"City not found" error**

- Check the spelling of the city name
- Try searching with additional context (e.g., "Paris, France" instead of just "Paris")

**Weather data not loading**

- Check your internet connection
- Verify your API key is correct and active
- Ensure you haven't exceeded your daily API limit

**Location not detected**

- Enable location services in your browser
- Grant permission when prompted
- The app will fallback to London if location is unavailable

## Customization

### Changing Default City

In `script.js`, find the `getCurrentLocation()` method and change the fallback city:

```javascript
this.searchCityWeather("London"); // Change 'London' to your preferred city
```

### Adding More Weather Data

The OpenWeatherMap API provides additional data that can be displayed:

- Air pollution data
- Weather maps
- Historical data (paid plans)

### Styling

Modify `style.css` to customize:

- Color scheme
- Typography
- Layout
- Animations

## Security Notes

- Never commit your API key to public repositories
- Consider using environment variables in production
- The current setup is suitable for development and learning

## Future Enhancements

Potential improvements:

- Weather maps integration
- Air quality index
- Extended forecasts (with paid API)
- Weather notifications
- Multiple language support
- Dark/light theme toggle

## License

This project is for educational purposes. Please respect OpenWeatherMap's API terms of service.
