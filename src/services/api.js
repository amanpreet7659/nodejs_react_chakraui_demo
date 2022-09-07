import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.image = (url) => {
  console.log(new URL("uploads/" + url, process.env.REACT_APP_API_URL));
  return new URL("uploads/" + url, process.env.REACT_APP_API_URL);
};

function mapResponseData(response) {
  if (response.data.error) {
    console.log(response.data.error);
    throw new Error(response.data.error);
  }
  return response.data;
}

function mapResponseError(error) {
  if (error.response.data && error.response.data.error) {
    throw new Error(error.response.data.error);
  } else {
    throw error;
  }
}

api.interceptors.response.use(mapResponseData, mapResponseError);

export default api;
