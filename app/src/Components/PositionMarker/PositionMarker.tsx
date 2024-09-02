import { useEffect, Dispatch, SetStateAction, useState } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import { coords } from "../../App";

interface PosMarkProps {
  onLocSelected: Dispatch<SetStateAction<coords>>;
  loc: coords;
  tracking: boolean;
}

export default function PositionMarker({
  onLocSelected,
  loc,
  tracking,
}: PosMarkProps) {
  const [watchId, setWatchId] = useState<number>(0);
  const map = useMap();

  const onPositionUpdate = (position: GeolocationPosition) => {
    console.log(position.coords);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const heading = position.coords.heading;
    const accuracy = position.coords.accuracy;
    onLocSelected({ lat, lng, heading, accuracy });
    if (map) {
      map.setCenter({ lat, lng });
    }
  };

  const onPositionFind = (position: GeolocationPosition) => {
    console.log(position.coords);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const heading = position.coords.heading;
    const accuracy = position.coords.accuracy;
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
    if (navigator.geolocation) {
      if (tracking) {
        console.log("HELLO!!!");
        setWatchId(
          navigator.geolocation.watchPosition(
            onPositionUpdate,
            handleGeolocationError,
            { maximumAge: 5000 },
          ),
        );
      } else {
        console.log("in get conditional");
        navigator.geolocation.getCurrentPosition(
          onPositionFind,
          handleGeolocationError,
          { maximumAge: 5000 },
        );
      }
    }
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [tracking]);

  return loc.lat && loc.lng ? (
    <AdvancedMarker position={{ lat: loc.lat, lng: loc.lng }}>
      <div className="position" />
    </AdvancedMarker>
  ) : null;
}
