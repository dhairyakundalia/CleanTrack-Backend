import { supabase } from "../db/db.js";

const createUser = async ({ email, password, username }) => {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username,
            },
        },
    })
    if (error) return { error };
    const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select(`
            user_id,
            role, 
            username,
        `)
        .eq("user_id", data.user.id)
        .single();
    if (profileError) return { profileError };
    return {
        data: {
            email: data.user.email,
            username: profileData.username,
            role: profileData.role,
            user_id: profileData.user_id
        }
    }
};

const loginUser = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) return { error };
    const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select(`
            user_id,
            role, 
            username,
        `)
        .eq("user_id", data.user.id)
        .single();
    if (profileError) return { profileError };
    return {
        data: {
            email: data.user.email,
            username: profileData.username,
            role: profileData.role,
            user_id: profileData.user_id
        }
    }
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
        if (error) return { error }
        else dataArray.push(data);
    });
    return { dataArray };
};

const geofenceSelected = async ({ user_id }) => {
    const { data, error } = await supabase
        .from("geofence_user")
        .select("*")
        .eq("user_id", user_id);
    if (error)
        return new ApiError(404, error.message, error);
    else if (data.length > 0)
        return { selected: true, data: data }
    else
        return { selected: false, data: null }
}

const joinGeofences = async ({ user_id, socket }) => {
    const { selected, data } = await geofenceSelected({ user_id });
    if (selected) {
        data.forEach(row => {
            socket.join(row.geofence_id);
        });
    }
}



export { createUser, loginUser, logoutUser, selectGeofences, geofenceSelected, joinGeofences };