import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

interface CenterProps {
  onTrackingChange: Dispatch<SetStateAction<boolean>>;
  tracking: boolean;
}

export default function CenterControl({
  onTrackingChange,
  tracking,
}: CenterProps) {
  return !tracking ? (
    <MapControl position={ControlPosition.RIGHT_BOTTOM}>
      <div className="center-container">
        <button
          onClick={() => onTrackingChange(true)}
          className="center-button"
        >
          <FontAwesomeIcon icon={faCrosshairs} />
        </button>
      </div>
    </MapControl>
  ) : null;
}
