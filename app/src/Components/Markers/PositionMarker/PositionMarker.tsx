import { useEffect, Dispatch, SetStateAction, useRef } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import { coords, mapCamState } from "../../../App";

interface PosMarkProps {
  onPosUpdate: Dispatch<SetStateAction<coords>>;
  pos: coords;
  onHeadingChange: Dispatch<SetStateAction<number>>;
  mapCam: mapCamState;
  onMapStateChange: Dispatch<SetStateAction<mapCamState>>;
}

const numDeltas: number = 10;

export default function PositionMarker({
  onPosUpdate,
  pos,
  onHeadingChange,
  mapCam,
  onMapStateChange,
}: PosMarkProps) {
  const map = useMap();
  const watchIdRef = useRef<number>(0);

  // updates the currPos state when new location information is received
  const onPositionUpdate = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const heading = position.coords.heading;
    const accuracy = position.coords.accuracy;
    const time = Date.now();

    const speed: number = 0;

    if (speed > 5) {
    }

    const posInfo = { lat, lng, heading, accuracy, time };

    // Prevents rerendering
    if (JSON.stringify(posInfo) === JSON.stringify(pos)) return;
    transition(lat, lng);
  };

  const transition = (lat: number, lng: number) => {
    const heading = pos.heading;
    const accuracy = pos.accuracy;
    const time = pos.time;
    for (let i = 1; i < numDeltas + 1; i++) {
      lng = pos.lng + (i * (lng - pos.lng)) / numDeltas;
      lat = pos.lat + (i * (lat - pos.lat)) / numDeltas;
      onPosUpdate({ lat, lng, heading, accuracy, time });
    }
  };

  // updates heading state when phone changes orientation
  // (nothing happens when accessed from desktop/laptop)
  const handleAbsoluteOrientation = (e: DeviceOrientationEvent) => {
    if (!e.alpha) return;
    // if (Math.abs(e.alpha - heading) < 5) return;
    // console.log(e);
    onHeadingChange(e.alpha);
  };

  const handleGeolocationError = (err: GeolocationPositionError) => {
    const { code }: { code: number } = err;
    switch (code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        // Handle Permission Denied Error
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        // Handle Position Unavailable Error
        break;
      case GeolocationPositionError.TIMEOUT:
        // Handle Timeout Error
        break;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition(
      //   onPositionUpdate,
      //   handleGeolocationError,
      // );
      (watchIdRef.current = navigator.geolocation.watchPosition(
        onPositionUpdate,
        handleGeolocationError,
        { enableHighAccuracy: true },
      )),
        window.addEventListener(
          "deviceorientationabsolute",
          handleAbsoluteOrientation,
          true,
        );
    }
    return () => {
      console.log("WATCH ID ==================>>>>>>>>>", watchIdRef.current);
      navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  useEffect(() => {
    const lat = pos.lat;
    const lng = pos.lng;

    if (!lat || !lng || !map || !mapCam.tracking) return;

    map.panTo({ lat, lng });
    map.addListener("drag", () => {
      onMapStateChange((camState) => ({ ...camState, tracking: false }));
    });
  }, [mapCam, map, pos]);

  return pos.lat && pos.lng ? (
    <AdvancedMarker position={{ lat: pos.lat, lng: pos.lng }}>
      <div className="position" />
    </AdvancedMarker>
  ) : null;
}
