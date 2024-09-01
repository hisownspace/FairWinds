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

class TripLocation {
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
}

class ImportantLocation extends TripLocation {
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
    const headers = res.headers;
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
  const location = new TripLocation("", 38.8894, -77.0352);
  await location.init();
  // const startLocation = new ImportantLocation("", 38.8894, -77.0352);
  // await startLocation.init();
};

main();
