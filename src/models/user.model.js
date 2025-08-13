import { supabase } from "../db/db.js";

const createUser = async ({ email, password, username }) => {
    return await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username,
            },
        },
    })
};

const loginUser = async ({ email, password }) => {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
};

const logoutUser = async () => {
    return await supabase.auth.signOut();
};

const selectGeofences = async ({ geofences_id, user_id }) => {
    geofences_id.forEach(async (element) => {
        const { data, error } = await supabase
            .from("geofence_user")
            .insert([
                {
                    geofence_id: element,
                    user_id: user_id
                }
            ])
    });

    if (error) return new ApiError(404, error.message, error);
    return res.status(200).json(data);
};

const geofenceSelected = async ({ user_id }) => {
    const { data, error } = await supabase
        .from("geofence_user")
        .select("*")
        .eq("user_id", user_id);
    if (error) return new ApiError(404, error.message, error);
    return res.status(200).json({
        selected: data.length > 0
    });
}

export { createUser, loginUser, logoutUser, selectGeofences, geofenceSelected };