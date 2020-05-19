import axios from "axios"

export const stateHealth = () => axios.post("/api/corona/state_health")
