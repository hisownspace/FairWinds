import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function LocationRange({
  accuracy,
  lat,
  lng,
}: {
  accuracy: number;
  lat: number;
  lng: number;
}) {
  const [circle, setCircle] = useState<google.maps.Circle>();

  const map = useMap();
  const maps = useMapsLibrary("maps");

  useEffect(() => {
    if (!maps) return;
    console.log(accuracy);

    const circ: google.maps.Circle = new maps.Circle({
      strokeColor: "#0041a8",
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: "#0041a8",
      fillOpacity: 0.1,
      map,
      center: { lat, lng },
      radius: accuracy,
    });
    setCircle(circ);
  }, [maps, lat, lng, accuracy]);

  useEffect(() => {
    if (!circle) return;

    circle.setMap(map);
    return () => {
      circle.setVisible(false);
    };
  }, [circle]);

  return null;
}
