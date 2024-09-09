import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";

import { coords } from "../../App";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import axios from "axios";
import { API_KEY } from "../../App";

interface NavProps {
  start: coords | undefined;
  dest: coords | undefined;
  onTracking: Dispatch<SetStateAction<boolean>>;
  tracking: boolean;
  onShowStartTripButton: Dispatch<SetStateAction<boolean>>;
  startTrip: boolean;
  camHeading: number;
  nextTurn: string;
  setNextTurn: Dispatch<SetStateAction<string>>;
}

export default function Navigation({
  start,
  dest,
  tracking,
  onTracking,
  onShowStartTripButton,
  startTrip,
  camHeading,
  setNextTurn,
}: NavProps) {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [routeSections, setRouteSections] = useState<google.maps.LatLng[]>();

  const map = useMap();
  const maps = useMapsLibrary("maps");
  const geometry = useMapsLibrary("geometry");

  const getRoute = async (a: coords, b: coords) => {
    const origin = {
      location: { latLng: { latitude: a.lat, longitude: a.lng } },
    };
    const destination = {
      location: { latLng: { latitude: b.lat, longitude: b.lng } },
    };
    const headers = {
      "Content-Type": "application/JSON",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "*",
    };
    const body = {
      origin,
      destination,
    };
    const URL: string =
      "https://routes.googleapis.com/directions/v2:computeRoutes";
    const res = await axios.post(URL, body, { headers });
    const data = res.data;
    console.log(data);
    setNextTurn(
      data.routes[0].legs[0].steps[0].navigationInstruction.instructions,
    );
    setRouteSections(
      geometry?.encoding.decodePath(data.routes[0].polyline.encodedPolyline),
    );
  };

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

    if (!start || !dest || !geometry) return;

    const startIsEmpty = Object.values(start).every((x) => !x);
    const destIsEmpty = Object.values(dest).every((x) => !x);

    if (!map || startIsEmpty || destIsEmpty || startTrip) return;

    onShowStartTripButton(true);

    const latLngBndsLit = getBounds(start, dest);
    getRoute(start, dest);
    // console.log(latLngBndsLit);

    map.fitBounds(latLngBndsLit, 15);
    onTracking(false);
  }, [start, dest, maps, tracking]);

  useEffect(() => {
    if (!maps || !routeSections || !map) return;
    polylineRef.current = new maps.Polyline({
      path: routeSections,
      strokeColor: "blue",
      strokeWeight: 10,
    });
    polylineRef.current.setMap(map);
    return () => {
      polylineRef.current?.setVisible(false);
    };
  }, [routeSections, maps, map]);

  useEffect(() => {
    if (!startTrip || !map || !start) return;
    if (start.bearing) {
      map.setHeading(start.bearing);
    } else if (camHeading) {
      map.setHeading(360 - camHeading);
    }
    map.setZoom(18);
    map.setTilt(45);
  }, [startTrip, camHeading, start]);

  return null;
}
