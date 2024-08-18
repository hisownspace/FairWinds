import fetch from "node-fetch";

class TripLocation {
  public longitude: number | null;
  public latitude: number | null;
  public address: string | null;
  private arrivalTime: Date;
  private observationStations: string;
  public forecastHourly: string;
  public forecast: string;
  public locationInfo: { city: string; state: string; timeZone: string };

  constructor(
    address: string | null = null,
    latitude: number | null = null,
    longitude: number | null = null,
  ) {
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.arrivalTime = this.getArrivalTime();
  }

  async init() {
    let city: string, state: string, timeZone: string;
    [this.forecastHourly, this.observationStations, city, state, timeZone] =
      await this.getRequestMetadata();
    this.locationInfo = { city, state, timeZone };
    this.forecast = await this.getForecast();
  }

  // determines arrival time for location
  getArrivalTime() {
    //! This is currently hardcoded to six hours in the future!!!!!
    const time: Date = new Date();
    time.setHours(time.getHours() + 6);
    return time;
  }

  // gets initial information from weather api about location
  async getRequestMetadata() {
    const res: any = await fetch(
      `https://api.weather.gov/points/${this.latitude},${this.longitude}`,
    );
    const data: any = await res.json();
    const forecastHourly: string = data.properties.forecastHourly;
    const observationStations: string = data.properties.observationStations;
    const city: string = data.properties.relativeLocation.properties.city;
    const state: string = data.properties.relativeLocation.properties.state;
    const timeZone: string = data.properties.timeZone;
    return [forecastHourly, observationStations, city, state, timeZone];
  }

  // retrieves and parses forecast information for location
  async getForecast() {
    const res: any = await fetch(this.forecastHourly);
    const data: any = await res.json();
    for (let period of data.properties.periods) {
      const startTime: Date = new Date(period.startTime);
      const endTime: Date = new Date(period.endTime);
      if (
        endTime.getTime() > this.arrivalTime.getTime() &&
        startTime.getTime() < this.arrivalTime.getTime()
      ) {
        return period;
      }
    }
  }

  // determines best observation station to represent current conditions

  // requests for current conditions for appropriate observations station

  // checks for active warnings, watches, advisories, etc...

  // schedules requests from api to keep location information up to date
}

const location = new TripLocation(null, 38.8894, -77.0352);
await location.init();
console.log(location.locationInfo);
