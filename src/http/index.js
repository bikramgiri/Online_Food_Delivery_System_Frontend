import axios from 'axios'

// For un login user
const API = axios.create({
      baseURL : "http://localhost:3000",
      headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
      }
})


// For Login user
const APIAuthenticated = axios.create({
      baseURL : "http://localhost:3000",
      headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            'Authorization': `${localStorage.getItem("token")}`
      }
})

export { API, APIAuthenticated } 