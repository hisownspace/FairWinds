import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction } from "react";

interface CenterProps {
  onTrackingSet: Dispatch<SetStateAction<boolean>>;
}

export default function CenterControl({ onTrackingSet }: CenterProps) {
  return (
    <MapControl position={ControlPosition.RIGHT_CENTER}>
      <div className="center-container">
        <button onClick={() => onTrackingSet(true)} className="center-button">
          Center
        </button>
      </div>
    </MapControl>
  );
}
