import { useEffect, Dispatch, SetStateAction } from "react";

import { coords } from "../../App";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

interface NavProps {
  start: coords | undefined;
  dest: coords | undefined;
  setTracking: Dispatch<SetStateAction<boolean>>;
}

export default function Navigation({ start, dest, setTracking }: NavProps) {
  // const [bounds, setBounds] = useState<google.maps.LatLngBounds>();

  const map = useMap();
  const maps = useMapsLibrary("maps");

  const getBounds = (a: coords, b: coords) => {
    const north = Math.max(a.lat, b.lat);
    const south = Math.min(a.lat, b.lat);

    const highLng = Math.max(a.lng, b.lng);
    const lowLng = Math.min(a.lng, b.lng);
    let west, east: number;
    // find the best viewport
    if (Math.abs(highLng - lowLng) < 180) {
      west = lowLng;
      east = highLng;
    } else {
      east = lowLng;
      west = highLng;
    }
    const bounds = { north, east, south, west };
    return bounds;
  };

  useEffect(() => {
    console.log("in navigation effect");
    console.log(map, start, dest);
    if (!start || !dest) return;
    const startIsEmpty = Object.values(start).every((x) => !x);
    const destIsEmpty = Object.values(dest).every((x) => !x);
    if (!map || startIsEmpty || destIsEmpty) return;
    const latLngBndsLit = getBounds(start, dest);
    console.log(latLngBndsLit);

    map?.fitBounds(latLngBndsLit, 15);
    setTracking(false);
  }, [start, dest, maps]);

  return null;
}
