import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { mapCamState } from "../../../App";

interface StartTripCtrlProps {
  onMapStateChange: Dispatch<SetStateAction<mapCamState>>;
}

export default function StartTripControl({
  onMapStateChange,
}: StartTripCtrlProps) {
  const handleStartTrip = () => {
    onMapStateChange((mapState) => ({
      ...mapState,
      tracking: true,
      onTrip: true,
    }));
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
