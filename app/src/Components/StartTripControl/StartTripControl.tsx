import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";

export default function StartTripControl({
  showStartTripButton,
  onStartTrip,
  tracking,
}) {
  return showStartTripButton && !tracking ? (
    <MapControl position={ControlPosition.LEFT_BOTTOM}>
      <div className="start-trip-container">
        <button className="start-trip-button" onClick={() => onStartTrip(true)}>
          <FontAwesomeIcon icon={faLocationArrow} />
        </button>
      </div>
    </MapControl>
  ) : null;
}
