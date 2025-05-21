import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.biziffy.com/api", // Replace with your actual backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
