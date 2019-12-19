import axios from 'axios'

export async function getPreferences() {
  const { data } = await axios.get('preferences')
  return data
}
