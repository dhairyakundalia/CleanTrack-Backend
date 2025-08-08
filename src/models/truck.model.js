import { supabase } from "../db/db.js";

async function insertLocation(req, res) {
  const { truck_id, lat, lng } = req.body;

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



export {insertLocation}