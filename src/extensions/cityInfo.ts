import axios from 'axios'
import { celsiusToFahrenheit } from './convert.js'
import { parse as parseSvg } from 'svg-parser';
import convert from 'color-convert';

async function getCountryColor(countryName: string): Promise<string | null> {
    try {
      const response = await axios.get(`https://restcountries.com/v2/name/${countryName}?fullText=true`);
      const country = response.data[0];
      return await extractColorFromFlag(country.flag)
    } catch (error) {
      console.error(error);
      return null;
    }
  }

async function extractColorFromFlag(flagUrl: string): Promise<string> {
    try {
        const response = await axios.get(flagUrl);
        const svg = parseSvg(response.data);
        let color = null;
        const traverse = (node: any) => {
        if (node.properties && node.properties.fill) {
            color = node.properties.fill;
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
        };
        traverse(svg);
        if (color === null) {
            console.error(`No fill property found in SVG: ${flagUrl}`);
            return '';
        }
        //@ts-ignore
        if (color.startsWith('#')) {
            return color;
        //@ts-ignore
        } else if (color.startsWith('rgb')) {
        //@ts-ignore
            const rgbValues = color.match(/\d+/g).map(Number);
            const hexCode = convert.rgb.hex(rgbValues);
            return `#${hexCode}`;
        //@ts-ignore
        } else if (color.startsWith('hsl')) {
            //@ts-ignore
            const hslValues = color.match(/\d+/g).map(Number);
            const rgbValues = convert.hsl.rgb(hslValues);
            const hexCode = convert.rgb.hex(rgbValues);
            return `#${hexCode}`;
        } else {
            const hexCode = convert.keyword.hex(color);
            return `#${hexCode}`;
        }
    } catch (error) {
        console.error(error);
        return '';
    }
}

async function getCityPopulation(cityID: string) {
    const options = {
        method: 'GET',
        url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityID}`,
        headers: {
          'X-RapidAPI-Key': '43764cd40dmsh42b87a77d35be97p1afe77jsnc263aad6fb87',
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    const res = await axios.request(options);

    return res.data.data.population
}

async function getCityID(city: string) {
    const base_url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${city}&format=json`

    const res = await axios.get(base_url)
    const pages = res.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const wikiId = pages[pageId].pageprops.wikibase_item;
    return wikiId ? wikiId : null;
}

async function getCityData(lat: any, lon: any) {
    const data_url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_KEY!}&format=json&by=position&lat=${lat}&lng=${lon}`
    const res = await axios.get(data_url)
    if (res) {
        if (res.data) {
            const city_data = res.data
            const cityID = await getCityID(city_data.cityName)
            const cityPopulation = await getCityPopulation(cityID)
            const cityColor = await getCountryColor(city_data.countryName)
            const newData = {
                code: city_data.countryCode,
                country: city_data.countryName,
                region: city_data.regionName,
                city: city_data.cityName,
                zone: city_data.zoneName,
                timezone: city_data.abbreviation,
                timezoneOffset: city_data.gmtOffset,
                time: city_data.timestamp,
                population: cityPopulation,
                color: cityColor
            }

            return newData
        }
    }
}

async function getWeather(lat: any, lon: any) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_KEY!}`
    const res = await axios.get(url)
    if (res) {
        if (res.data) {
            const weather = res.data
            const weatherData = res.data.weather
            const weatherIcon = `http://openweathermap.org/img/w/${weatherData[0].icon}.png`

            const temperature = weather.main.temp
            const feels_like = weather.main.feels_like
            const skyCondition = weatherData[0].main
            const newData = {
                temperature: temperature,
                feelsLike: feels_like,
                skyCondition: skyCondition,
                wind: weather.wind.speed,
                icon: weatherIcon,
                alternateTemperature: celsiusToFahrenheit(temperature),
                alternateFeelsLike: celsiusToFahrenheit(feels_like)
            }
            return newData
        }
    }
}


export async function getCityInfo(city: string) {
    const base_data_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.WEATHER_KEY!}`
    const res = await axios.get(base_data_url)
    if (res) {
        if (res.data) {
            const res_data = res.data[0]
            const latitude = res_data.lat
            const longitude = res_data.lon

            const city_data = await getCityData(latitude, longitude)
            const weather_data = await getWeather(latitude, longitude)
            return {
                data: city_data,
                weather: weather_data,
            }
        }
    }
}