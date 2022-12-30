export interface WeatherModel {
    list?: DataPoint[]
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
    dt_txt: string,
    airData: AirModel,
    airLabel: string,
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

export interface AirModel {
    coord: Coord;
    list: List[];
} 

export interface Coord {
    lon: number,
    lat: number
}

export interface List {
    main: { aqi : number },
    components: Components,
    dt: { dt : number }
}

export interface Components {
    co: number,
    no: number,
    no2: number,
    o3: number,
    so2: number,
    pm2_5: number,
    pm10: number,
    nh3: number
}