import axiosInstance from "../api/axiosInstance.js";

// Create a new chat
const createChat = async () => {
    const { data } = await axiosInstance.post("/chats");

    return data.chat;
};

// Send a message to an existing chat
const sendMessage = async (chatId, message) => {
    const { data } = await axiosInstance.post(
        `/chats/${chatId}/messages`,
        { message }
    );

    return data;
};

// Get all chats belonging to the logged-in user
const getAllChats = async () => {
    const { data } = await axiosInstance.get("/chats");

    return data.chats;
};

// Get one chat and its messages
const getChatById = async (chatId) => {
    const { data } = await axiosInstance.get(`/chats/${chatId}`);

    return data.chat;
};

// Delete a chat
const deleteChat = async (chatId) => {
    const { data } = await axiosInstance.delete(`/chats/${chatId}`);

    return data;
};

// Toggle Star / Unstar status
const toggleStarChat = async (chatId) => {
    const { data } = await axiosInstance.patch(
        `/chats/${chatId}/star`
    );

    return data.chat;
};

export {
    createChat,
    sendMessage,
    getAllChats,
    getChatById,
    deleteChat,
    toggleStarChat,
};