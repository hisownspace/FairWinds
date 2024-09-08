// import fetch from "node-fetch";
// const axios = require("axois");
import axios from "axios";

interface property {
  "@id": string;
  "@type": string;
  elevation: { unitCode: string; value: number };
  stationIdentifier: string;
  name: string;
  timeZone: string;
  forecast: string;
  county: string;
  fireWeatherZone: string;
}

interface feature {
  id: string;
  type: string;
  geometry: { type: string; coordinates: number[] };
  properties: property;
}

interface unitValue {
  unitCode: string;
  value: number;
}

interface forecast {
  number: number;
  name: string;
  startTime: Date;
  endTime: Date;
  isDaytime: boolean;
  temperature: number;
  teperatureUnit: string;
  temperatureTrend: string;
  propabilityOfPrecipitation: unitValue;
  dewpoint: unitValue;
  relativeHumidity: unitValue;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

interface simpleCoords {
  lat: number;
  lng: number;
}

const sin = Math.sin;
const cos = Math.cos;
const atan2 = Math.atan2;
const sqrt = Math.sqrt;
const PI = Math.PI;

export class TripLocation {
  public longitude: number;
  public latitude: number;
  public address: string;
  private arrivalTime: Date;
  protected observationStations: string = "";
  private forecastHourly: string = "";
  private forecast: forecast[] = [] as forecast[];
  protected alerts: any;
  public zoneId: string = "";
  public locationInfo: { city: string; state: string; timeZone: string } = {
    city: "",
    state: "",
    timeZone: "",
  };

  constructor(
    address: string = "",
    latitude: number = NaN,
    longitude: number = NaN,
  ) {
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.arrivalTime = this.getArrivalTime();
  }

  // Initializes object with values received from API response
  async init(): Promise<void> {
    let city: string, state: string, timeZone: string;
    [
      this.forecastHourly,
      this.observationStations,
      this.zoneId,
      city,
      state,
      timeZone,
    ] = await this.getRequestMetadata();
    this.locationInfo = { city, state, timeZone };
    this.forecast = await this.getForecast();
    console.log(this.forecast);
    this.alerts = await this.getActiveAlerts();
  }

  // determines arrival time for location
  protected getArrivalTime(): Date {
    //! This is currently hardcoded to five hours in the future!!!!!
    const time: Date = new Date();
    time.setHours(time.getHours() + 5);
    return time;
  }

  // gets initial information from weather api about location
  protected async getRequestMetadata() {
    const res: any = await axios.get(
      `https://api.weather.gov/points/${this.latitude},${this.longitude}`,
    );
    const data: any = res.data;
    const forecastHourly: string = data.properties.forecastHourly;
    const observationStations: string = data.properties.observationStations;
    const city: string = data.properties.relativeLocation.properties.city;
    const state: string = data.properties.relativeLocation.properties.state;
    const timeZone: string = data.properties.timeZone;
    const zoneParts: string[] = data.properties.forecastZone.split("/");
    const zoneId: string = zoneParts[zoneParts.length - 1];
    return [forecastHourly, observationStations, zoneId, city, state, timeZone];
  }

  // retrieves and parses forecast information for location
  protected async getForecast(): Promise<forecast[]> {
    const res: any = await axios.get(this.forecastHourly);
    const expiry: Date = new Date(res.headers.expires);
    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    );
    console.log("getForecast request made at", new Date().toString());
    console.log("next expiry:               ", expiry.toString());
    const data: any = res.data;
    const forecast: forecast[] = this.getRelevantForecastData(
      data.properties.periods,
    );
    this.scheduleNextRequest(this.getForecast.bind(this), expiry);
    return forecast;
  }

  private getRelevantForecastData(periods: forecast[]): forecast[] {
    let forecast: forecast = {} as forecast;
    for (let period of periods) {
      const startTime: Date = new Date(period.startTime);
      const endTime: Date = new Date(period.endTime);
      if (
        (endTime.getTime() > this.arrivalTime.getTime() &&
          startTime.getTime() < this.arrivalTime.getTime()) ||
        (endTime.getTime() > this.arrivalTime.getTime() + 900000 &&
          startTime.getTime() < this.arrivalTime.getTime() - 900000) ||
        (endTime.getTime() > this.arrivalTime.getTime() + 900000 &&
          startTime.getTime() < this.arrivalTime.getTime() - 900000)
      ) {
        forecast = period;
      }
    }
    console.log("Forecast:", forecast);
    return [forecast];
  }

  // checks for active warnings, watches, advisories, etc...
  protected async getActiveAlerts(): Promise<feature[]> {
    const res: any = await axios.get(
      `https://api.weather.gov/alerts/active/zone/${this.zoneId}`,
    );
    const headers = res.headers;
    const expiry: Date = new Date(headers.expires);
    console.log("expiry:", expiry);
    console.log("getActiveAlerts request made at", new Date().toString());
    console.log("next expiry:                   ", expiry.toString());
    const data: any = res.data;
    this.scheduleNextRequest(this.getActiveAlerts.bind(this), expiry);
    return data.features;
  }

  protected scheduleNextRequest(requestMethod: Function, expiry: Date): void {
    const now: Date = new Date();
    if (this.arrivalTime.getTime() - now.getTime() < 3600000) {
      setTimeout(requestMethod, 4 * (expiry.getTime() - now.getTime()));
    } else if (this.arrivalTime.getTime() - now.getTime() < 18000000) {
      setTimeout(requestMethod, 20 * (expiry.getTime() - now.getTime()));
    } else {
      setTimeout(requestMethod, 3600000);
    }
  }

  public static findGridLocations(
    latLngArr: google.maps.MVCArray<google.maps.LatLng>,
  ) {
    const start = Date.now();
    console.log(latLngArr);
    const locations = [];
    let prevCoords: simpleCoords = { lat: NaN, lng: NaN };
    let gridpoint: simpleCoords = { lat: NaN, lng: NaN };
    let d: number;
    for (let latLng of latLngArr.Eg) {
      const nextCoords: simpleCoords = { lat: latLng.lat(), lng: latLng.lng() };
      const distance = this.computeDistance(gridpoint, nextCoords);
      if (!prevCoords.lat && !prevCoords.lng) {
        locations.push(nextCoords);
        gridpoint = nextCoords;
        prevCoords = nextCoords;
      } else if (distance > 2.5) {
        // console.log("DISTANCE:", distance);
        const d2g = 2.5 - this.computeDistance(gridpoint, prevCoords);
        // console.log("distance to go", d2g);
        const interPoint = this.computeInterPoint(
          d2g / this.computeDistance(prevCoords, nextCoords),
          this.computeDistance(prevCoords, nextCoords),
          prevCoords,
          nextCoords,
        );
        gridpoint = interPoint;
        // console.log(gridpoint);
        locations.push(gridpoint);
        prevCoords = gridpoint;
      } else {
        d = distance;
        // console.log(d);
        prevCoords = nextCoords;
      }
    }
    console.log(locations);
    // const end = Date.now();
    // console.log(`Time to execute: ${(end - start) / 1000}`);
    // for (let i = 0; i < locations.length; i++) {
    //   if (i === locations.length - 1) continue;
    //   console.log(this.computeDistance(locations[i], locations[i + 1]));
    // }
  }

  protected static degreesToRadians(deg: number) {
    return deg * (PI / 180);
  }

  protected static radiansToDegrees(rad: number) {
    return 180 * (rad / PI);
  }

  protected static computeDistance(
    coords1: simpleCoords,
    coords2: simpleCoords,
  ) {
    const earthRadiusKm = 6371;

    let lat1 = this.degreesToRadians(coords1.lat);
    let lat2 = this.degreesToRadians(coords2.lat);

    let lng1 = this.degreesToRadians(coords1.lng);
    let lng2 = this.degreesToRadians(coords2.lng);

    let dLat = lat2 - lat1;
    let dLng = lng2 - lng1;

    // Haversine Formula for distance on a sphere.
    // The earth is not a perfect sphere, but this
    // close enough for our purposes.
    let a =
      sin(dLat / 2) * sin(dLat / 2) +
      sin(dLng / 2) * sin(dLng / 2) * cos(lat1) * cos(lat2);
    let c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return earthRadiusKm * c;
  }

  protected static computeInterPoint(
    f: number,
    d: number,
    c1: simpleCoords,
    c2: simpleCoords,
  ) {
    console.log("frac:", f, "distance:", d);
    let lat1 = this.degreesToRadians(c1.lat);
    let lat2 = this.degreesToRadians(c2.lat);

    let lng1 = this.degreesToRadians(c1.lng);
    let lng2 = this.degreesToRadians(c2.lng);

    const a = sin((1 - f) * d) / sin(d);
    const b = sin(f * d) / sin(d);
    const x = a * cos(lat1) * cos(lng1) + b * cos(lat2) * cos(lng2);
    const y = a * cos(lat1) * sin(lng1) + b * cos(lat2) * sin(lng2);
    const z = a * sin(lat1) + b * sin(lat2);
    let lat = atan2(z, sqrt(x ** 2 + y ** 2));
    let lng = atan2(y, x);

    lat = this.radiansToDegrees(lat);
    lng = this.radiansToDegrees(lng);

    // console.log(lat, lng);
    return { lat, lng };
  }
}

export class ImportantLocation extends TripLocation {
  private closestStation: string = "";
  private currentConditions: any;

  async init(): Promise<void> {
    let city: string, state: string, timeZone: string, _: any;
    [_, this.observationStations, this.zoneId, city, state, timeZone] =
      await this.getRequestMetadata();
    this.locationInfo = { city, state, timeZone };
    this.closestStation = await this.getClosestObservationStation();
    this.currentConditions = await this.getCurrentConditions();
    console.log("Current Conditions:", this.currentConditions);
    console.log(_);
    this.alerts = await this.getActiveAlerts();
  }

  // overrides arrivalTime function, setting current time to now
  getArrivalTime(): Date {
    return new Date();
  }

  // requests for current conditions for appropriate observation station
  async getCurrentConditions(): Promise<void> {
    const res: any = await axios.get(this.closestStation);
    const data = res.data;
    const currentConditions = data.features[0];
    return currentConditions;
  }

  // determines best observation station to represent current conditions
  async getClosestObservationStation(): Promise<any> {
    const res: any = await axios.get(this.observationStations);
    const data: any = res.data;
    // const headers = res.headers;
    const features: feature[] = data.features;
    const closestStation: string = features[0].id;
    return `${closestStation}/observations`;
  }

  scheduleNextRequest(requestMethod: Function, expiry: Date): void {
    const now: Date = new Date();
    setTimeout(requestMethod, expiry.getTime() - now.getTime());
  }
}

const main = async () => {
  // const location = new TripLocation("", 38.8894, -77.0352);
  // await location.init();
  // const startLocation = new ImportantLocation("", 38.8894, -77.0352);
  // await startLocation.init();
};

main();
