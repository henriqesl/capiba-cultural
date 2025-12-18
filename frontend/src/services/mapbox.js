const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZ3VpbW9udGVuZWdybyIsImEiOiJjbWo0d2JyaGswYXN1M2hxMjZ2ejN2dGoyIn0.fxxtwS3S493xLPud44zD3A";

export const geocodeLocation = async (locationName) => {
  if (!locationName) return null;

  try {
    const encodedLocation = encodeURIComponent(locationName);

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro de API do Mapbox: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      console.log(`Geocoding Sucesso: Lat ${latitude}, Lng ${longitude}`);
      return { latitude, longitude };
    }

    return null;
  } catch (error) {
    console.error("Erro no Geocoding do Mapbox:", error);
    return null;
  }
};

export const reverseGeocodeLocation = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1&language=pt`,
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name_pt || data.features[0].place_name;
    }
    return null;
  } catch (error) {
    console.error("Erro no Reverse Geocoding:", error);
    return null;
  }
};
