import { APIAuthenticated } from ".";

class ApiService {
      async getDatas(endpoint) {
            try {
                  const response = await APIAuthenticated.get(`${endpoint}`);
            return response.data.data;
            } catch (error) {
                  console.error("Error fetching data:", error);
                  throw error;
            }
      }
}


const api = new ApiService();
export default api;
