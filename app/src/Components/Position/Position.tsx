import { useEffect, Dispatch, SetStateAction } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

interface PosProps {
  onLat: Dispatch<SetStateAction<number>>;
  onLng: Dispatch<SetStateAction<number>>;
  onAcc: Dispatch<SetStateAction<number>>;
  lat: number;
  lng: number;
}

export default function Position({ onLat, onLng, onAcc, lat, lng }: PosProps) {
  const map = useMap();

  const onPositionUpdate = (position: GeolocationPosition) => {
    console.log(position.coords);
    onLat(position.coords.latitude);
    onLng(position.coords.longitude);
    onAcc(position.coords.accuracy);
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
        { maximumAge: 5000 },
      );
    }
    console.log(navigator.geolocation);
  }, []);
  useEffect(() => {
    if (!map) return;

    map.setCenter({ lat, lng });
  }, [lat, lng]);

  return (
    <AdvancedMarker position={{ lat, lng }}>
      <div className="position" />
    </AdvancedMarker>
  );
}
