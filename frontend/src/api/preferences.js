import axios from "axios"

export const getPreferences = async () => {
  const res = await axios.get("preferences")
  return res.data
}
