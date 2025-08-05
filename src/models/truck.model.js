import { supabase } from "../db/db.js";

async function insertLocation(req, res) {
    const {truck_id, lat, lng} = req.body
    const { data, error } = await supabase
        .from('truck')
        .insert([{ 
            truck_id: truck_id,
            active: true,
            latitude: lat,
            longitude: lng,
            depot: "test"
        }]);

    if (error) throw new Error(error.message);
    return res.status(200).json(data);
}

export {insertLocation}