import * as TruckModel from "../models/truck.model.js"
import { supabase } from "../db/db.js";
const updateTruckLocation = async (req, res) => {
    const { truck_id, lat, lng } = req.body;
    TruckModel.updateLocation(truck_id, lat, lng);
}

const enteredGeofence = async (req, res) => {
    const { geofence_id, truck_id } = req.body;
    const { data, error } = await supabase
        .from("geofence_truck")
        .insert([
            {
                geofence_id: geofence_id,
                truck_id: truck_id
            }
        ])

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
}

const exitedGeofence = async (req, res) => {
    const { geofence_id, truck_id } = req.body;
    const { error } = await supabase
        .from("geofence_truck")
        .delete()
        .eq("geofence_id", geofence_id)
        .eq("truck_id", truck_id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json("Deletion Successful");
}

const truckSocketHandler = (socket) => {
    // socket.on("updateGeofences", ({ newGeofences, truck_id, lat, lng }) => {
    //     TruckModel.handleGeofenceUpdates({ socket, truck_id, newGeofences, lat, lng });
    // })

    socket.on("updateLocation", ({truck_id, lat, lng, currentGeofences}) => {
        TruckModel.broadcastLocation({truck_id, lat, lng, currentGeofences });
    })

    socket.on("disconnect", () => {
        console.log("🔌 Client disconnected:", socket.id);
    })
}
export { updateTruckLocation, enteredGeofence, exitedGeofence, truckSocketHandler }