import { supabase } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";

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

const getAllGeofences = async () => {
    // console.log("Inside display geofences method...")
    const {data, error} = await supabase.from("geofence")
    .select("geofence_id, lat, lng, radius");
    // console.log(data);
    // console.log(error);
    if(error) return {error};
    return {data};
}

export { insertGeofence, getAllGeofences }