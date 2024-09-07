import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { SetStateAction } from "react";
import { Dispatch } from "react";

interface StartTripCtrlProps {
  showStartTripButton: boolean;
  onStartTrip: Dispatch<SetStateAction<boolean>>;
  tracking: boolean;
  onTracking: Dispatch<SetStateAction<boolean>>;
}

export default function StartTripControl({
  showStartTripButton,
  onStartTrip,
  tracking,
  onTracking,
}: StartTripCtrlProps) {
  const handleStartTrip = () => {
    onTracking(true);
    onStartTrip(true);
    console.log("hadnling shit");
  };
  return showStartTripButton && !tracking ? (
    <MapControl position={ControlPosition.LEFT_BOTTOM}>
      <div className="start-trip-container">
        <button className="start-trip-button" onClick={handleStartTrip}>
          <FontAwesomeIcon icon={faLocationArrow} />
        </button>
      </div>
    </MapControl>
  ) : null;
}
