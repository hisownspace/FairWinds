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

const numDeltas: number = 100;

export default function PositionMarker({
  onPosUpdate,
  pos,
  onHeadingChange,
  mapCam,
  onMapStateChange,
}: PosMarkProps) {
  const map = useMap();
  const watchIdRef = useRef<number>(0);
  // position ref does not require the heading or time values, but it seemed
  // simpler to use the coords type than create a new one for this ref
  const positionRef = useRef<coords>(pos);

  // updates the currPos state when new location information is received
  const onPositionUpdate = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    let heading = position.coords.heading;
    const acc = position.coords.accuracy;
    const time = Date.now();

    // uses haversines formula to calculate distance travelled between last
    // two given locations, then using the two timestamps determines the
    // approximate speed of the device. if the speed is below a certain
    // threshold, heading information is ignored.

    const R = 3960; // appromixate radius of earth in miles
    const prevLat = positionRef.current.lat;
    const prevLng = positionRef.current.lng;
    const deltaLat = prevLat - lat;
    const deltaLng = prevLng - lng;
    const sin = Math.sin;
    const cos = Math.cos;
    const asin = Math.asin;
    const sqrt = Math.sqrt;

    // haversine formula
    const distance =
      2 *
      R *
      asin(
        sqrt(
          sin(convertToRad(deltaLat) / 2) ** 2 +
            cos(convertToRad(prevLat)) *
              cos(convertToRad(lat)) *
              sin(convertToRad(deltaLng) / 2) ** 2,
        ),
      );

    const elapsedTime = time - positionRef.current.time;
    const mph = distance / (elapsedTime * 3600000);

    if (mph < 10) {
      heading = NaN;
    }

    // prevents jumping of marker if new location is received during animation
    if (time - positionRef.current.time < 1000) return;
    transition(lat, lng, heading, acc, time);
  };

  const convertToRad = (deg: number) => {
    return (deg / 180) * Math.PI;
  };

  const transition = (
    lat: number,
    lng: number,
    heading: number | null,
    acc: number,
    time: number,
  ) => {
    // smooths movement of position marker and accuracy circle when new location is received
    if (!positionRef.current.lat || !positionRef.current.lng) {
      // sets initial position of marker
      onPosUpdate({ lat, lng, heading, acc, time });
      positionRef.current = { lat, lng, heading, acc, time };
    } else {
      // sets numDelta intermediary steps between previous and current location to create
      // appearance of smooth movement. causes a 1 second delay, which is barely noticeable
      const tempLat = positionRef.current.lat;
      const tempLng = positionRef.current.lng;
      const tempAcc = positionRef.current.acc;
      let i = 0;
      const animate = () => {
        setTimeout(
          () => {
            // each calculation here moves the corresponding attribute
            // from the orginal value to 1/numDelta of the way to the
            // current value
            let accuracy = tempAcc + (i * (acc - tempAcc)) / numDeltas;
            let longitude = tempLng + (i * (lng - tempLng)) / numDeltas;
            let latitude = tempLat + (i * (lat - tempLat)) / numDeltas;
            onPosUpdate({
              lat: latitude,
              lng: longitude,
              heading,
              acc: accuracy,
              time,
            });
            positionRef.current = {
              lat: latitude,
              lng: longitude,
              heading,
              acc: accuracy,
              time,
            };
            i++;
            if (i <= numDeltas) animate();
          },
          Math.floor(1000 / numDeltas),
        );
      };
      animate();
    }
  };

  // updates heading state when phone changes orientation
  // (nothing happens when accessed from desktop/laptop)
  const handleAbsoluteOrientation = (e: DeviceOrientationEvent) => {
    if (!e.alpha) return;
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
