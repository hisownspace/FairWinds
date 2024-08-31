import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function Geocoding({ address }: { address: string }) {
  const map = useMap();
  const geocoding = useMapsLibrary("geocoding");

  const [lat, setLat] = useState(NaN);
  const [lng, setLng] = useState(NaN);

  useEffect(() => {
    if (!geocoding || !map) return;

    const geocoder = new geocoding.Geocoder();

    geocoder.geocode({ address }, (geocoderResponse) => {
      if (!geocoderResponse) return;
      setLat(geocoderResponse[0].geometry.location.lat());
      setLng(geocoderResponse[0].geometry.location.lng());
      // const lat = geocoderResponse[0].geometry.location.lat();
      // const lng = geocoderResponse[0].geometry.location.lng();
      // map.setCenter({ lat, lng });
    });
  }, [geocoding, address]);

  useEffect(() => {
    if (!map || !lat || !lng) return;
    map.setCenter({ lat, lng });
    console.log("center changed!");
  }, [lat, lng]);

  return null;
}
