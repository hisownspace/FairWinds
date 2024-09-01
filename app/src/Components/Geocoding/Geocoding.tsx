import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { coords } from "../../App";

interface GeoProps {
  address: string;
  onDestSelect: Dispatch<SetStateAction<coords>>;
}

export default function Geocoding({ address, onDestSelect }: GeoProps) {
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
    });
  }, [geocoding, address]);

  useEffect(() => {
    if (!map || !lat || !lng) return;
    onDestSelect({ lat, lng, accuracy: NaN });
  }, [lat, lng]);

  return null;
}
