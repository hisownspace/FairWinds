import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import { coords } from "../../App";

interface LocRngProps {
  loc: coords;
}

export default function LocationRange({ loc }: LocRngProps) {
  const [circle, setCircle] = useState<google.maps.Circle>();

  const map = useMap();
  const maps = useMapsLibrary("maps");

  useEffect(() => {
    const acc = loc.accuracy;
    const lat = loc.lat;
    const lng = loc.lng;

    if (!maps || !acc || !lat || !lng) return;

    const circ: google.maps.Circle = new maps.Circle({
      strokeColor: "#0041a8",
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: "#0041a8",
      fillOpacity: 0.1,
      map,
      center: { lat, lng },
      radius: acc,
    });
    setCircle(circ);
  }, [maps, loc]);

  useEffect(() => {
    if (!circle) return;

    circle.setMap(map);
  }, [circle]);

  return null;
}
