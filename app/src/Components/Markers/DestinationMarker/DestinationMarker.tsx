import { AdvancedMarker } from "@vis.gl/react-google-maps";

import { coords } from "../../../App";

interface DestMarkProps {
  dest: coords;
}

export default function DestinationMarker({ dest }: DestMarkProps) {
  return dest.lat && dest.lng ? (
    <AdvancedMarker position={{ lat: dest.lat, lng: dest.lng }} />
  ) : null;
}
