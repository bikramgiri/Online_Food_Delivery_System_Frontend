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

export { API, APIAuthenticated } 