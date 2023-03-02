const DISCORD_EPOCH = 1420070400000;

export function kelvinToCelsius(kelvin: number): number {
    const celsius = kelvin - 273.15;
    return Math.round(celsius * 100) / 100; // round to two decimal places
}

export function celsiusToKelvin(celsius: number): number {
    const kelvin = celsius + 273.15;
    return Math.round(kelvin * 100) / 100; // round to two decimal places
}

export function celsiusToFahrenheit(celsius: number): number {
    const fahrenheit = celsius * 1.8 + 32;
    return Math.round(fahrenheit * 100) / 100; // round to two decimal places
}

export function snowflakeToDate(snowflake) {
    return new Date(snowflake / 4194304 + DISCORD_EPOCH)
}

export function dateToUnix(date, alt) {
    if (alt) return Math.round(date.getTime() / 1000);
    else return Math.floor(date.getTime() / 1000);
}
  