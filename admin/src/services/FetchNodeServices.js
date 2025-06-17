import axios from "axios";
// const serverURL = "http://localhost:18001";
const serverURL ="https://api.biziffy.com"


const postData = async (url, body) => {
  try {
    // console.log(JSON.stringify(body));

    var response = await axios.post(`${serverURL}/api/${url}`, body);

    var data = response.data;
    return data;
  } catch (e) {
    return null;
  }
};

const getData = async (url) => {
  try {
    var response = await axios.get(`${serverURL}/api/${url}`);
    var data = response.data;
    return data;
  } catch (e) {
    return null;
  }
};

export { serverURL, postData, getData };
