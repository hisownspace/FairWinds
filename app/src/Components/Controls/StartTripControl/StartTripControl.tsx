import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { SetStateAction } from "react";
import { Dispatch } from "react";

interface StartTripCtrlProps {
  onStartTripSelected: Dispatch<SetStateAction<boolean>>;
  onTrackingChange: Dispatch<SetStateAction<boolean>>;
}

export default function StartTripControl({
  onStartTripSelected,
  onTrackingChange,
}: StartTripCtrlProps) {
  const handleStartTrip = () => {
    onTrackingChange(true);
    onStartTripSelected(true);
  };
  return (
    <MapControl position={ControlPosition.LEFT_BOTTOM}>
      <div className="start-trip-container">
        <button className="start-trip-button" onClick={handleStartTrip}>
          <FontAwesomeIcon icon={faLocationArrow} />
        </button>
      </div>
    </MapControl>
  );
}
