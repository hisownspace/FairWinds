import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useMemo } from "react";

import { coords } from "../../App";

interface LocRngProps {
  loc: coords;
}

export default function LocationRange({ loc }: LocRngProps) {
  // const [circle, setCircle] = useState<google.maps.Circle>();
  const map = useMap();
  const maps = useMapsLibrary("maps");

  const circle = useMemo(() => {
    const acc = loc.accuracy;
    const lat = loc.lat;
    const lng = loc.lng;

    if (!maps || !lat || !lng || !acc) return null;

    const circ = new maps.Circle({
      strokeColor: "#0041a8",
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: "#0041a8",
      fillOpacity: 0.1,
      map,
      center: { lat: loc.lat, lng: loc.lng },
      radius: loc.accuracy,
    });
    circ.setMap(map);
    return circ;
  }, [loc, maps]);

  useEffect(() => {
    const acc = loc.accuracy;
    const lat = loc.lat;
    const lng = loc.lng;

    if (!acc || !lat || !lng || !circle) return;
    console.log(lat, lng);

    circle.setRadius(acc);
    circle.setCenter({ lat, lng });
    return () => {
      circle.setVisible(false);
    };
  }, [circle, loc]);

  return null;
}
