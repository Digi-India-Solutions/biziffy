import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:18001api", // Replace with your actual backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
