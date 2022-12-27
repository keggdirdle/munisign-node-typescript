export interface WeatherModel {
    list: DataPoint[]
}

export interface DataPoint {
    dt: number,
    main: Main,
    weather: Weather[],
    clouds: { all: number},
    wind: Wind,
    visibility: number,
    pop: number,
    sys: { pod: string},
    dt_txt: string
}

export interface Main {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    sea_level: number,
    grnd_level: number,
    humidity: number,
    temp_kf: number     
}

export interface Wind {
    speed: number, 
    deg: number, 
    gust: number
}

export interface Weather {
    id: number,
    main: string,
    description: string,
    icon: string
}