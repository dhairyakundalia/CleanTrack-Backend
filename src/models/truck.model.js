import { supabase } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
import { getIO } from "../app.js";

const truckGeofences = {}
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

const broadcastLocation = ({truck_id, lat, lng}) => {
    const io = getIO();
    truckGeofences[truck_id].forEach(geofence => {
        io.to(`geofence:${geofence}`).emit("TruckLocation", {truck_id: truck_id, lat: lat, lng: lng});
    });
}

const handleGeofenceUpdates = ({socket, truck_id, newGeofences, lat, lng}) => {
    const oldGeofences = truckGeofences[truck_id] || [];

    const toJoin = newGeofences.filter(geofence => !oldGeofences.includes(geofence));
    const toLeave = oldGeofences.filter(geofence => !newGeofences.includes(geofence));

    toJoin.forEach(geofence => {
        socket.join(geofence);
    });
    toLeave.forEach(geofence => {
        socket.leave(geofence);
    });
    truckGeofences[truck_id] = newGeofences;
    broadcastLocation({truck_id, lat, lng});
}

export {insertLocation, updateLocation, getLocation, updateStatus, handleGeofenceUpdates, broadcastLocation}