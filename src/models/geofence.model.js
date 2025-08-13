import { supabase } from "../db/db";

const insertGeofence = async ({geofence_id, lat, lng, radius}) => {
    const { data, error } = await supabase.from("geofence").insert([{
        geofence_id: geofence_id,
        lat: lat,
        lng: lng,
        radius: radius
    }]);
    if (error) return new ApiError(404, error.message, error);
    return res.status(200).json(data);
}

export { insertGeofence }