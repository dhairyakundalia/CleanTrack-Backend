import * as UserModel from "../models/user.model.js";

const userSocketHandler = (socket) => {


    socket.on("getLiveUpdates", ({user_id}) => {
        UserModel.joinGeofences({socket, user_id})
    });

    socket.on("disconnect", () => {
        console.log("🔌 Client disconnected:", socket.id);
    });
};

export { userSocketHandler};