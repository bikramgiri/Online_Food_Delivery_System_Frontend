import axios from 'axios'

// For unlogin user
const API = axios.create({
      baseURL : "http://localhost:3000",
      // withCredentials: true, // cookies
      headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
      }
})


// For Login user
const APIAuthenticated = axios.create({
      baseURL : "http://localhost:3000",
      // withCredentials: true, // cookies
      headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            'Authorization': `${localStorage.getItem("token")}`
      }
})

// Request Interceptor: Set Authorization from localStorage dynamically
APIAuthenticated.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { API, APIAuthenticated } 