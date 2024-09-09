// import { Dispatch, SetStateAction } from "react";
//
// interface MapViewConstructorParams {
//   map: google.maps.Map;
//   tracking: boolean;
//   onTrip: boolean;
//   showingTripSummary: boolean;
//   setTracking: Dispatch<SetStateAction<boolean>>;
//   setOnTrip: Dispatch<SetStateAction<boolean>>;
//   setShowingTripSummary: Dispatch<SetStateAction<boolean>>;
// }
//
// export default class MapView {
//   private map: google.maps.Map;
//   private tracking: boolean;
//   private onTrip: boolean;
//   private showingTripSummary: boolean;
//   private setTracking: Dispatch<SetStateAction<boolean>>;
//   private setOnTrip: Dispatch<SetStateAction<boolean>>;
//   private setShowingTripSummary: Dispatch<SetStateAction<boolean>>;
//
//   constructor({
//     map,
//     tracking,
//     onTrip,
//     showingTripSummary,
//     setTracking,
//     setOnTrip,
//     setShowingTripSummary,
//   }: MapViewConstructorParams) {
//     this.map = map;
//     this.tracking = tracking;
//     this.onTrip = onTrip;
//     this.showingTripSummary = showingTripSummary;
//
//     this.setTracking = setTracking;
//     this.setOnTrip = setOnTrip;
//     this.setShowingTripSummary = setShowingTripSummary;
//   }
//
//   changeState(setState: Dispatch<SetStateAction<any>>, state: boolean) {
//     
//   }
// }

export const handleMapStateChange(tracking: boolean, onTrip: boolean, tripSummary: boolean, map: google.maps.Map) {
  if (tripSummary && tracking) {
    // pan to bounds that include all points on trip
    // allow drag and show center location button and startTrip button
  } else if (tripSummary && !tracking) {
    // allow to drag and show center location button and startTrip button
  } else if (onTrip && tracking) {
    // set zoom and tilt
    // center map at device location
    // don't show any buttons
    // allow drag
  } else if (onTrip && !tracking) {
    // allow drag and show center location button (as re-center button)
    // set tilt 0 deg
  } else if (tracking) {
    // place posMarker and center map at device location
    // allow drag
  } else {
    // allow drag
    // show setCenter button
  }
}
