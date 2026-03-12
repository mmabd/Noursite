const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_SCRIPT_ID = "nass-google-maps-loader";

declare global {
  interface Window {
    google?: any;
    __nassGoogleMapsPromise?: Promise<any>;
  }
}

export function loadGoogleMaps() {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (window.__nassGoogleMapsPromise) {
    return window.__nassGoogleMapsPromise;
  }

  window.__nassGoogleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

    const handleFailure = () => {
      document.getElementById(GOOGLE_MAPS_SCRIPT_ID)?.remove();
      window.__nassGoogleMapsPromise = undefined;
      reject(new Error("Google Maps failed to load."));
    };

    const handleSuccess = () => {
      if (window.google?.maps) {
        const script = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
        if (script) {
          script.dataset.status = "loaded";
        }
        resolve(window.google.maps);
        return;
      }

      handleFailure();
    };

    if (existingScript) {
      if (existingScript.dataset.status === "loaded") {
        handleSuccess();
        return;
      }

      if (existingScript.dataset.status === "error") {
        existingScript.remove();
      } else {
        existingScript.addEventListener("load", handleSuccess, { once: true });
        existingScript.addEventListener("error", handleFailure, { once: true });
        return;
      }
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.dataset.status = "loading";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleSuccess, { once: true });
    script.addEventListener("error", () => {
      script.dataset.status = "error";
      handleFailure();
    }, { once: true });
    document.head.appendChild(script);
  });

  return window.__nassGoogleMapsPromise;
}
