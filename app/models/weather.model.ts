export type WeatherModel = {
    list?: DataPoint[]
}

export type DataPoint = {
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

export type Main = {
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

export type Wind  ={
    speed: number, 
    deg: number, 
    gust: number
}

export type Weather  ={
    id: number,
    main: string,
    description: string,
    icon: string
}

export type AirModel ={
    coord: Coord;
    list: List[];
} 

export type Coord  ={
    lon: number,
    lat: number
}

export type List = {
    main: { aqi : number },
    components: Components,
    dt: { dt : number }
}

export type Components = {
    co: number,
    no: number,
    no2: number,
    o3: number,
    so2: number,
    pm2_5: number,
    pm10: number,
    nh3: number
}