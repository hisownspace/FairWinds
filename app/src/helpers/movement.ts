import { coords } from "../App";

export const onPositionUpdate = (
  position: GeolocationPosition,
  userPosition: any,
) => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  let heading = position.coords.heading;
  const accuracy = position.coords.accuracy;

  const posInfo = { lat, lng, heading, accuracy };

  const deltaLat = userPosition.current.reduce((prev: number, curr: coords) => {
    const tempDelta = curr.lat - lat;
    return tempDelta >= 0
      ? Math.max(prev, tempDelta)
      : Math.min(prev, tempDelta);
  }, 0);
  const deltaLng = userPosition.current.reduce((prev: number, curr: coords) => {
    const tempDelta = curr.lng - lng;
    return tempDelta >= 0
      ? Math.max(prev, tempDelta)
      : Math.min(prev, tempDelta);
  }, 0);

  if (Math.sqrt(deltaLat ** 2 + deltaLng ** 2) > 0.0001) {
    const direction = 90 - (Math.atan2(deltaLat, deltaLng) * 180) / Math.PI;
    const distance = Math.sqrt(deltaLat ** 2 + deltaLng ** 2);
    console.log("DIRECTION ===============>", direction);
    console.log("HEADING =================>", heading);
    console.log("DISTANCE MOVED ==========>", distance);
    // heading = direction;
    userPosition.current = [];
  } else if (userPosition.current.length > 100) {
    userPosition.current = [];
  }
  console.log(userPosition.current.length);

  // if (userPosition.current.length > 100 || Math.sqrt(deltaLat ** 2 + deltaLng ** 2))

  userPosition.current.push(posInfo);
  return { lat, lng, heading, accuracy };
};

export const onDeviceAccelerate = (device: DeviceMotionEvent) => {
  if (
    !device.acceleration ||
    device.acceleration.x === null ||
    device.acceleration.y === null
  )
    return;
  const acceleration =
    90 -
    (Math.atan2(device.acceleration.x, device.acceleration.y) * 180) / Math.PI;
  console.log(acceleration);
};
