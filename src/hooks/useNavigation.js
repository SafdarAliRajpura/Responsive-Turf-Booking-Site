import { useState } from "react";

const useNavigation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const clearError = () => setError(null);

  const startNavigation = (venueCoords) => {
    // 1. Clear any previous error
    setError(null);

    // 2. Set pre-navigation notification
    setNotification("We need your location to generate a route to this turf.");

    // 3. Check geolocation support
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }

    // 4. Set loading state
    setIsLoading(true);

    // 5. Request current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${venueCoords.lat},${venueCoords.lng}`;
        window.open(url, "_blank");
        setNotification(null);
        setIsLoading(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "Location access denied. Please enable location in your browser settings to use navigation."
          );
        } else {
          setError("Unable to retrieve your location. Please try again.");
        }
        setNotification(null);
        setIsLoading(false);
      }
    );
  };

  return { startNavigation, isLoading, error, notification, clearError };
};

export default useNavigation;
