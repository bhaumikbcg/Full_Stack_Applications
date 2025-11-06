import userModel from "../models/user.model.js";

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'username'); // Fetch all users and username fields
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export default getUsers;