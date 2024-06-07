from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

API_KEY = ''
BASE_URL = 'https://api.weatherbit.io/v2.0/current'
FORECAST_URL = 'https://api.weatherbit.io/v2.0/forecast/daily'
HOURLY_FORECAST_URL = 'https://api.weatherbit.io/v2.0/forecast/hourly'
HISTORICAL_URL = 'https://api.weatherbit.io/v2.0/history/daily'

cache = {}  # Simple cache in memory
CACHE_TIMEOUT = 60 * 10  # Cache timeout in seconds

def get_cached_response(key):
    if key in cache and (time.time() - cache[key]['timestamp']) < CACHE_TIMEOUT:
        return cache[key]['response']
    return None

def set_cached_response(key, response):
    cache[key] = {'response': response, 'timestamp': time.time()}

@app.route('/weather/<city>', methods=['GET'])
def get_weather(city):
    cache_key = f"weather_{city}"
    cached_response = get_cached_response(cache_key)
    if cached_response:
        return cached_response

    params = {
        'city': city,
        'country': 'ES',
        'key': API_KEY,
        'lang': 'es'
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()

    if response.status_code == 200:
        weather_data = {
            'city': data['data'][0]['city_name'],
            'temperature': data['data'][0]['temp'],
            'app_temp': data['data'][0]['app_temp'],
            'humidity': data['data'][0]['rh'],
            'pressure': data['data'][0]['pres'],
            'wind_speed': data['data'][0]['wind_spd'],
            'wind_direction': data['data'][0]['wind_cdir'],
            'wind_direction_full': data['data'][0]['wind_cdir_full'],
            'clouds': data['data'][0]['clouds'],
            'weather': data['data'][0]['weather']['description'],
            'weather_icon': data['data'][0]['weather']['icon'],
            'visibility': data['data'][0]['vis'],
            'dew_point': data['data'][0]['dewpt'],
            'solar_radiation': data['data'][0]['solar_rad'],
            'aqi': data['data'][0]['aqi'],
            'uv': data['data'][0]['uv'],
            'lat': data['data'][0]['lat'],
            'lon': data['data'][0]['lon']
        }
        response = jsonify(weather_data)
        set_cached_response(cache_key, response)
        return response
    else:
        print(f"Error: {data}")
        return jsonify({'error': 'No se pudo obtener el clima'}), response.status_code

@app.route('/forecast/<city>', methods=['GET'])
def get_forecast(city):
    cache_key = f"forecast_{city}"
    cached_response = get_cached_response(cache_key)
    if cached_response:
        return cached_response

    params = {
        'city': city,
        'country': 'ES',
        'key': API_KEY,
        'days': 7,
        'lang': 'es'
    }
    response = requests.get(FORECAST_URL, params=params)
    data = response.json()

    if (response.status_code == 200):
        forecast_data = [
            {
                'date': day['valid_date'],
                'temperature': day['temp'],
                'temperature_min': day['min_temp'],
                'temperature_max': day['max_temp'],
                'humidity': day['rh'],
                'wind_speed': day['wind_spd'],
                'weather': day['weather']['description'],
                'weather_icon': day['weather']['icon'],
                'uv': day['uv'],
                'clouds': day['clouds'],
                'solar_radiation': day.get('solar_rad', 'N/A'),
                'aqi': day.get('aqi', 'N/A'),
                'pop': day.get('pop', 'N/A')  # Probabilidad de precipitación
            } for day in data['data']
        ]
        response = jsonify(forecast_data)
        set_cached_response(cache_key, response)
        return response
    else:
        print(f"Error: {data}")
        return jsonify({'error': 'No se pudo obtener el pronóstico'}), response.status_code

@app.route('/hourly-forecast/<city>', methods=['GET'])
def get_hourly_forecast(city):
    cache_key = f"hourly_forecast_{city}"
    cached_response = get_cached_response(cache_key)
    if cached_response:
        return cached_response

    params = {
        'city': city,
        'key': API_KEY,
        'hours': 24
    }
    response = requests.get(HOURLY_FORECAST_URL, params=params)
    data = response.json()

    if response.status_code == 200:
        hourly_forecast = data['data']
        response = jsonify(hourly_forecast)
        set_cached_response(cache_key, response)
        return response
    else:
        print(f"Error: {data}")
        return jsonify({'error': 'No se pudo obtener el pronóstico por horas'}), response.status_code

@app.route('/historical-weather/<city>', methods=['GET'])
def get_historical_weather(city):
    cache_key = f"historical_weather_{city}"
    cached_response = get_cached_response(cache_key)
    if cached_response:
        return cached_response

    params = {
        'city': city,
        'key': API_KEY,
        'start_date': '2022-01-01',
        'end_date': '2022-12-31'
    }
    response = requests.get(HISTORICAL_URL, params=params)

    try:
        data = response.json()
    except requests.exceptions.JSONDecodeError:
        print(f"Error decoding JSON: {response.text}")
        return jsonify({'error': 'No se pudo obtener el historial climático'}), response.status_code

    if response.status_code == 200:
        historical_weather = data['data']
        response = jsonify(historical_weather)
        set_cached_response(cache_key, response)
        return response
    else:
        print(f"Error: {data}")
        return jsonify({'error': 'No se pudo obtener el historial climático'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
