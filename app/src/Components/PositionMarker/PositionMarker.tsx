import { useEffect, Dispatch, SetStateAction, useState } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import { coords } from "../../App";

interface PosMarkProps {
  onLocSelected: Dispatch<SetStateAction<coords>>;
  loc: coords;
  tracking: boolean;
  onTracking: Dispatch<SetStateAction<boolean>>;
}

export default function PositionMarker({
  onLocSelected,
  loc,
  tracking,
  onTracking,
}: PosMarkProps) {
  const [watchId, setWatchId] = useState<number>(0);
  const map = useMap();

  const onPositionUpdate = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const heading = position.coords.heading;
    const accuracy = position.coords.accuracy;
    // console.log(lat, lng, heading, accuracy);
    onLocSelected({ lat, lng, heading, accuracy });
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
    console.log("In geolocation effect");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onPositionUpdate,
        handleGeolocationError,
        { maximumAge: 5000 },
      );
      setWatchId(
        navigator.geolocation.watchPosition(
          onPositionUpdate,
          handleGeolocationError,
          { maximumAge: 5000 },
        ),
      );
    }
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    const lat = loc.lat;
    const lng = loc.lng;

    if (!lat || !lng || !map || !tracking) return;

    map.setCenter({ lat, lng });
    map.addListener("drag", () => {
      onTracking(false);
      console.log("no longer tracking position!");
    });
  }, [tracking, map, loc]);

  return loc.lat && loc.lng ? (
    <AdvancedMarker position={{ lat: loc.lat, lng: loc.lng }}>
      <div className="position" />
    </AdvancedMarker>
  ) : null;
}
