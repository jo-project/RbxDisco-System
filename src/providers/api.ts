import axios from "axios";
type APIOptions = {
    OpenWeatherKey: string
}

export class APIProvider {
    open_weather_api: string;

    constructor(options: APIOptions) {
        this.open_weather_api = options.OpenWeatherKey
    }

    async getLongitudeAndLatitude(cityName: string, stateCode?: string, country?: string) {

    }
}