import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

import { coords } from "../../App";

interface LocRngProps {
  loc: coords;
}

export default function LocationRange({ loc }: LocRngProps) {
  const circleRef = useRef<google.maps.Circle | null>(null);

  const map = useMap();
  const maps = useMapsLibrary("maps");

  useEffect(() => {
    const acc = loc.accuracy;
    const lat = loc.lat;
    const lng = loc.lng;

    if (!maps || !acc || !lat || !lng) return;

    console.log(circleRef.current);
    if (!circleRef.current) {
      circleRef.current = new maps.Circle({
        strokeColor: "#0041a8",
        strokeOpacity: 0.4,
        strokeWeight: 1,
        fillColor: "#0041a8",
        fillOpacity: 0.1,
        map,
        center: { lat, lng },
        radius: acc,
      });
    } else {
      circleRef.current.setRadius(acc);
      circleRef.current.setCenter({ lat, lng });
    }
  }, [maps, loc]);

  return null;
}
