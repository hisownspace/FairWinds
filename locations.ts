import fetch from "node-fetch";

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

class TripLocation {
  public longitude: number;
  public latitude: number;
  public address: string;
  private arrivalTime: Date;
  private observationStations: string = "";
  private forecastHourly: string = "";
  private forecast: string = "";
  // private zoneId: string = "";
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
  async init() {
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
    const zoneParts: string[] = data.properties.forecastZone.split("/");
    const zoneId: string = zoneParts[zoneParts.length - 1];
    return [forecastHourly, observationStations, zoneId, city, state, timeZone];
  }

  // retrieves and parses forecast information for location
  async getForecast() {
    const res: any = await fetch(this.forecastHourly);
    const expiry: Date = new Date(await res.headers.get("expires"));
    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    );
    console.log("getForecast request made at", new Date().toString());
    console.log("next expiry:               ", expiry.toString());
    const data: any = await res.json();
    for (let period of data.properties.periods) {
      const startTime: Date = new Date(period.startTime);
      const endTime: Date = new Date(period.endTime);
      if (
        endTime.getTime() > this.arrivalTime.getTime() &&
        startTime.getTime() < this.arrivalTime.getTime()
      ) {
        const now: Date = new Date();
        setTimeout(
          this.getForecast.bind(this),
          expiry.getTime() - now.getTime(),
        );
        return period;
      }
    }
  }

  // determines best observation station to represent current conditions
  async getClosestObservationStation(): Promise<string> {
    const res: any = await fetch(this.observationStations);
    const data: any = await res.json();
    const features: feature[] = data.features;
    const closestStation: string = features[0].id;
    return `${closestStation}/observations`;
  }

  // requests for current conditions for appropriate observation station

  // checks for active warnings, watches, advisories, etc...
  async getActiveAlerts(): Promise<feature[]> {
    const res: any = await fetch(
      `https://api.weather.gov/alerts/active/zone/${this.zoneId}`,
    );
    const expiry: Date = new Date(await res.headers.get("expires"));
    console.log("getActiveAlerts request made at", new Date().toString());
    console.log("next expiry:                   ", expiry.toString());
    const data: any = await res.json();
    const now: Date = new Date();
    setTimeout(
      this.getActiveAlerts.bind(this),
      expiry.getTime() - now.getTime(),
    );
    return data.features;
  }

  // schedules requests from api to keep location information up to date
  // schedule(func: Function, expiry: string) {
  //   setTimeout(func, parseInt(expiry) * 1000);
  // }
}

const main = async () => {
  const location = new TripLocation("", 38.8894, -77.0352);
  await location.init();
  console.log(location.locationInfo);
  console.log(await location.getClosestObservationStation());
  console.log(location.zoneId);
  console.log(location.getActiveAlerts());
};

main();
