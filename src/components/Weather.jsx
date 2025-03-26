import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import snow_icon from '../assets/snow.png';
import rain_icon from '../assets/rain.png';
import wind_icon from '../assets/wind.png';

import clearBg from '../assets/backgrounds/clear.jpg';
import cloudyBg from '../assets/backgrounds/cloudy.jpg';
import rainyBg from '../assets/backgrounds/rainy.jpg';
import snowBg from '../assets/backgrounds/snow.jpg';
import stormBg from '../assets/backgrounds/storm.jpg';
import mistBg from '../assets/backgrounds/mist.jpg';
import defaultBg from '../assets/backgrounds/default.jpg';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [background, setBackground] = useState(defaultBg);

    // Weather condition map
    const weatherIcons = {
        "01d": clear_icon, "01n": clear_icon,
        "02d": cloud_icon, "02n": cloud_icon,
        "03d": cloud_icon, "03n": cloud_icon,
        "04d": cloud_icon, "04n": cloud_icon,
        "09d": rain_icon, "09n": rain_icon,
        "10d": rain_icon, "10n": rain_icon,
        "11d": rain_icon, "11n": rain_icon,
        "13d": snow_icon, "13n": snow_icon,
        "50d": drizzle_icon, "50n": drizzle_icon,
    };

    // Weather to background image
    const weatherBackgrounds = {
        "01d": clearBg, "01n": clearBg,
        "02d": cloudyBg, "02n": cloudyBg,
        "03d": cloudyBg, "03n": cloudyBg,
        "04d": cloudyBg, "04n": cloudyBg,
        "09d": rainyBg, "09n": rainyBg,
        "10d": rainyBg, "10n": rainyBg,
        "11d": stormBg, "11n": stormBg,
        "13d": snowBg, "13n": snowBg,
        "50d": mistBg, "50n": mistBg,
    };

    const search = async (city_name) => {
        if (!city_name) {
            setError("Please enter a city name");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) throw new Error(data.message);

            const iconCode = data.weather[0].icon;
            const icon = weatherIcons[iconCode] || clear_icon;
            const backgroundImage = weatherBackgrounds[iconCode] || defaultBg;

            setBackground(backgroundImage);
            setWeatherData({
                humidity: data.main.humidity,
                windspeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                country: data.sys.country,
                description: data.weather[0].description,
                feels_like: Math.floor(data.main.feels_like),
                icon: icon
            });
        } catch (error) {
            setError("City not found. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        search("Gulmarg");
    }, []);

    return (
        <div className="weather-container" style={{ backgroundImage: `url(${background})` }}>
            <div className='weather-card'>
                {/* Search Bar */}
                <div className='search-container'>
                    <input 
                        ref={inputRef}
                        type='text' 
                        placeholder='Search city...' 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && search(city)}
                    />
                    <button 
                        className="search-button"
                        onClick={() => search(city)} 
                        aria-label="Search"
                    >
                        <img src={search_icon} alt='Search' />
                    </button>
                </div>

                {/* Error Message */}
                {error && <div className="error-message">{error}</div>}

                {/* Loading State */}
                {loading && !error ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Fetching weather data...</p>
                    </div>
                ) : (
                    weatherData && (
                        <div className="weather-content">
                            <div className="weather-header">
                                <img src={weatherData.icon} alt='Weather Icon' className='weather-icon' />
                                <div className="temperature-container">
                                    <h1 className='temperature'>{weatherData.temperature}°C</h1>
                                    <p className="feels-like">Feels like {weatherData.feels_like}°C</p>
                                </div>
                            </div>
                            
                            {/* Weather Details */}
                            <div className="weather-info">
                                <h2 className='location'>{weatherData.location}, {weatherData.country}</h2>
                                <p className="weather-description">{weatherData.description}</p>
                            </div>
                            
                            <div className='weather-details'>
                                <div className='detail-card'>
                                    <img src={humidity_icon} alt='Humidity Icon' />
                                    <div>
                                        <p className="detail-value">{weatherData.humidity}%</p>
                                        <span className="detail-label">Humidity</span>
                                    </div>
                                </div>
                                <div className='detail-card'>
                                    <img src={wind_icon} alt='Wind Icon' />
                                    <div>
                                        <p className="detail-value">{weatherData.windspeed} km/h</p>
                                        <span className="detail-label">Wind Speed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Footer */}
            <div className='footer'>
                Made with ❤️ by <strong>Shibaditya Deb</strong>
            </div>
        </div>
    );
};

export default Weather;
