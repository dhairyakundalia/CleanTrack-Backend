import { supabase } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";

async function insertLocation({truck_id, lat, lng}) {
  if (truck_id && lat && lng) {
    const { data, error } = await supabase
      .from("truck")
      .insert([
        {
          truck_id: truck_id,
          active: true,
          latitude: lat,
          longitude: lng,
          depot: "test",
        },
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } else {
    return res.status(400).json({ error: "Missing required fields" });
  }
}


async function updateLocation({truck_id, lat, lng}) {
    const { error } = await supabase
        .from('truck')
        .update({ 
            latitude: lat,
            longitude: lng,
        })
        .eq('truck_id', truck_id);

    if (error) return new ApiError(404, error.message, error);
    return res.status(200);
}

const updateStatus = async ({truck_id, status}) => {
    const { error } = await supabase
        .from('truck')
        .update({ 
            active: status,
        })
        .eq('truck_id', truck_id);

    if (error) return new ApiError(404, error.message, error);
    return res.status(200);
}
const getLocation = async ({truck_id}) => {
	const {data, error} = await supabase
		.from("truck")
		.select("latitude, longitude")
		.in("truck_id", truck_id);

	if (error) 
		return new ApiError(404, error.message, error);
	
	return res.status(200).json(data);
}

export {insertLocation, updateLocation, getLocation, updateStatus}