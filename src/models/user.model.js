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

const selectGeofences = async ({ geofences, user_id }) => {
    const dataArray = [];
    geofences.forEach(async (element) => {
        const { data, error } = await supabase
            .from("geofence_user")
            .insert([
                {
                    geofence_id: element,
                    user_id: user_id
                }
            ])
            if(error) return {error}
            else dataArray.push(data);
    });
    return {dataArray};
};

const geofenceSelected = async ({ user_id }) => {
    const { data, error } = await supabase
        .from("geofence_user")
        .select("*")
        .eq("user_id", user_id);
    if(error)
        return new ApiError(404, error.message, error);
    else if(data.length > 0)
        return {selected: true, data: data}
    else 
        return {selected: false, data: null}
}

const joinGeofences = async ({user_id, socket}) => {
    const { selected, data } = await geofenceSelected({ user_id });
    if(selected){
        data.forEach(row => {
            socket.join(row.geofence_id);
        });
    }
}



export { createUser, loginUser, logoutUser, selectGeofences, geofenceSelected, joinGeofences };