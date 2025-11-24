import { getOne, updateOne } from "./HandlerFactory.js";

const getProfile = getOne("user");
const updateProfile = updateOne("user");

export { getProfile, updateProfile };
