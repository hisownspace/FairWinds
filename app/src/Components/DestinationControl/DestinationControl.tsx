import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapControl, ControlPosition } from "@vis.gl/react-google-maps";

interface DestProps {
  onPlaceSelect: Dispatch<SetStateAction<string>>;
}

export default function DestinationControl({ onPlaceSelect }: DestProps) {
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);

  const [dest, setDest] = useState<google.maps.places.Autocomplete>();

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = { fields: ["name", "formatted_address"] };
    setDest(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!dest) return;

    dest.addListener("place_changed", () => {
      onPlaceSelect(dest.getPlace().formatted_address!);
      console.log("place changed");
    });
  }, [dest]);

  return (
    <MapControl position={ControlPosition.BLOCK_START_INLINE_START}>
      <div className="destination-container">
        <input className="destination-input" ref={inputRef} />
      </div>
    </MapControl>
  );
}
