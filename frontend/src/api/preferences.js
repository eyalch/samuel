import axios from "axios"

export const getPreferences = () => axios.get("/api/preferences")
