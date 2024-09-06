import { useMapsLibrary } from "@vis.gl/react-google-maps";

const geocoder = new useMapsLibrary("geocoding").Geocoder();

const newGeo = geocoder.geocode(
  "2305 Montebello Terrace, Baltimore, MD, 22714",
);
