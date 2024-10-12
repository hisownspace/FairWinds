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

export default function PositionMarker({
  onPosUpdate,
  pos,
  onHeadingChange,
  mapCam,
  onMapStateChange,
}: PosMarkProps) {
  const map = useMap();
  const userPosition = useRef<coords[]>([]);
  const watchIdRef = useRef<number>(0);

  // updates the currPos state when new location information is received
  const onPositionUpdate = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const heading = position.coords.heading;
    const accuracy = position.coords.accuracy;

    const posInfo = { lat, lng, heading, accuracy };

    const deltaLat = userPosition.current.reduce((prev, curr) => {
      const tempDelta = curr.lat - lat;
      return tempDelta >= 0
        ? Math.max(prev, tempDelta)
        : Math.min(prev, tempDelta);
    }, 0);
    const deltaLng = userPosition.current.reduce((prev, curr) => {
      const tempDelta = curr.lng - lng;
      return tempDelta >= 0
        ? Math.max(prev, tempDelta)
        : Math.min(prev, tempDelta);
    }, 0);

    if (Math.sqrt(deltaLat ** 2 + deltaLng ** 2) > 0.0001) {
      const direction = 90 - (Math.atan2(deltaLat, deltaLng) * 180) / Math.PI;
      const distance = Math.sqrt(deltaLat ** 2 + deltaLng ** 2);
      console.log("DIRECTION ===============>", direction);
      console.log("HEADING =================>", heading);
      console.log("DISTANCE MOVED ==========>", distance);
      userPosition.current = [];
    } else if (userPosition.current.length > 100) {
      userPosition.current = [];
    }
    console.log(userPosition.current.length);

    // if (userPosition.current.length > 100 || Math.sqrt(deltaLat ** 2 + deltaLng ** 2))

    if (JSON.stringify(posInfo) === JSON.stringify(pos)) return;
    userPosition.current.push(posInfo);
    onPosUpdate({ lat, lng, heading, accuracy });
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
