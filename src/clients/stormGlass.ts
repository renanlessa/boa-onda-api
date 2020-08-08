import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
   [key: string]: number;
}

export interface StormGlassPoint {
    readonly time: string;
    readonly waveHeight: StormGlassPointSource;
    readonly waveDirection: StormGlassPointSource;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
    hours: StormGlassPoint[];
}

export interface ForecastPoint {
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;    
}

export class StormGlass {

    readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormeGlassApiSource = 'noaaa';

    constructor(protected request: AxiosStatic) {
    }

    public async fetchPoints(lat: number, lng: number): Promise<{}> {
        
        const response = this.request.get<StormGlassForecastResponse>(
            `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormeGlassApiSource}&end=1592113802&lat=${lat}&lng=${lng}`
        );

    }

    private normalizeResponse(points: StormGlassForecastResponse): ForecastPoint[] {
        return points.hours
            .filter(this.isValidPoint.bind(this))
            .map((point) =>({
                swellDirection: point.swellDirection[this.stormeGlassApiSource],
                swellHeight: point.swellHeight[this.stormeGlassApiSource],
                swellPeriod: point.swellPeriod[this.stormeGlassApiSource],
                time: point.time,
                waveDirection: point.waveDirection[this.stormeGlassApiSource],
                waveHeight: point.waveHeight[this.stormeGlassApiSource],
                windDirection: point.windDirection[this.stormeGlassApiSource],
                windSpeed: point.windSpeed[this.stormeGlassApiSource]
            }));
    }

    private isValidPoint(point: Partial<StormGlassPoint>): boolean {
        return !!(
            point.time &&
            point.swellDirection?.[this.stormeGlassApiSource] &&
            point.swellHeight?.[this.stormeGlassApiSource] &&
            point.swellPeriod?.[this.stormeGlassApiSource] &&
            point.waveDirection?.[this.stormeGlassApiSource] &&
            point.waveHeight?.[this.stormeGlassApiSource] &&
            point.windDirection?.[this.stormeGlassApiSource] &&
            point.windSpeed?.[this.stormeGlassApiSource]
        );
    }
}