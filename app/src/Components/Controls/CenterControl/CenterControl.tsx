import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { mapCamState } from "../../../App";

interface CenterProps {
  onMapStateChange: Dispatch<SetStateAction<mapCamState>>;
}

export default function CenterControl({ onMapStateChange }: CenterProps) {
  return (
    <MapControl position={ControlPosition.RIGHT_BOTTOM}>
      <div className="center-container">
        <button
          onClick={() =>
            onMapStateChange((mapState) => ({ ...mapState, tracking: true }))
          }
          className="center-button"
        >
          <FontAwesomeIcon icon={faCrosshairs} />
        </button>
      </div>
    </MapControl>
  );
}
