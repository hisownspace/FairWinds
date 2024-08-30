import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

// const ADDRESS: string = "2708 Unicorn Ln NW, Washington, DC 20015";
const ADDRESS: string = "";

export default function Geocoding() {
  const map = useMap();
  const geocoding = useMapsLibrary("geocoding");

  const [lat, setLat] = useState(NaN);
  const [lng, setLng] = useState(NaN);

  useEffect(() => {
    if (!geocoding || !map) return;

    const geocoder = new geocoding.Geocoder();

    geocoder.geocode({ address: ADDRESS }, (geocoderResponse) => {
      if (!geocoderResponse) return;
      setLat(geocoderResponse[0].geometry.location.lat());
      setLng(geocoderResponse[0].geometry.location.lng());
      // const lat = geocoderResponse[0].geometry.location.lat();
      // const lng = geocoderResponse[0].geometry.location.lng();
      // map.setCenter({ lat, lng });
    });
  }, [geocoding]);

  useEffect(() => {
    if (!map || !lat || !lng) return;
    map.setCenter({ lat, lng });
    console.log("center changed!");
  }, [lat, lng]);

  return null;
}
