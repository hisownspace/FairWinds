import { useEffect, Dispatch, SetStateAction, useState } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import { coords, mapCamState } from "../../../App";

interface PosMarkProps {
  onPosUpdate: Dispatch<SetStateAction<coords>>;
  pos: coords;
  heading: number;
  onHeadingChange: Dispatch<SetStateAction<number>>;
  mapCam: mapCamState;
  onMapStateChange: Dispatch<SetStateAction<mapCamState>>;
}

export default function PositionMarker({
  onPosUpdate,
  pos,
  heading,
  onHeadingChange,
  mapCam,
  onMapStateChange,
}: PosMarkProps) {
  const [watchId, setWatchId] = useState<number>(0);
  const map = useMap();

  // updates the currPos state when new location information is received
  const onPositionUpdate = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const bearing = position.coords.heading;
    const accuracy = position.coords.accuracy;

    const posInfo = { lat, lng, bearing, accuracy };

    if (JSON.stringify(posInfo) === JSON.stringify(pos)) return;
    onPosUpdate({ lat, lng, bearing, accuracy });
  };

  // updates heading state when phone changes orientation
  // (nothing happens when accessed from desktop/laptop)
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (!e.alpha) return;
    if (Math.abs(e.alpha - heading) < 5) return;
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
      navigator.geolocation.getCurrentPosition(
        onPositionUpdate,
        handleGeolocationError,
      );
      setWatchId(
        navigator.geolocation.watchPosition(
          onPositionUpdate,
          handleGeolocationError,
        ),
      );
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
    return () => {
      navigator.geolocation.clearWatch(watchId);
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
