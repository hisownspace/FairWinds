import { useEffect, Dispatch, SetStateAction, useState } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import { coords } from "../../App";

interface PosMarkProps {
  onLocSelected: Dispatch<SetStateAction<coords>>;
  loc: coords;
  tracking: boolean;
  onTracking: Dispatch<SetStateAction<boolean>>;
  heading: number;
  onHeadingChange: Dispatch<SetStateAction<number>>;
  onTrip: boolean;
}

export default function PositionMarker({
  onLocSelected,
  loc,
  tracking,
  onTracking,
  heading,
  onHeadingChange,
  onTrip,
}: PosMarkProps) {
  const [watchId, setWatchId] = useState<number>(0);
  const map = useMap();

  // updates the currLoc state when new location information is received
  const onPositionUpdate = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const bearing = position.coords.heading;
    const accuracy = position.coords.accuracy;

    const locInfo = { lat, lng, bearing, accuracy };

    if (JSON.stringify(locInfo) === JSON.stringify(loc)) return;
    onLocSelected({ lat, lng, bearing, accuracy });
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
    const lat = loc.lat;
    const lng = loc.lng;

    if (!lat || !lng || !map || !tracking) return;

    map.panTo({ lat, lng });
    map.addListener("drag", () => {
      onTracking(false);
    });
  }, [tracking, map, loc, onTrip]);

  return loc.lat && loc.lng ? (
    <AdvancedMarker position={{ lat: loc.lat, lng: loc.lng }}>
      <div className="position" />
    </AdvancedMarker>
  ) : null;
}
