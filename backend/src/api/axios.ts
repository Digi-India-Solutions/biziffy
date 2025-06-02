import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.biziffy.comapi", // Replace with your actual backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
