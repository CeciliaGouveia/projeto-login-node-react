import axios from "axios"

// criando uma instância personalizada do Axios
const api = axios.create({
  baseURL: "http://localhost:3000",
})

export default api
