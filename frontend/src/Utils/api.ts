import axios from "axios";

const BASE_URL = "http://localhost:3000/"; // Replace with your API base URL

export const fetchApi = async (
  path: string,
  method: string ,
  data: any = null,
  headers: any = {}
) => {
  const url = `${BASE_URL}${path}`;
  const config = {
    method,
    url,
    data,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      
    },
    contentType: "application/json",
  };
  console.log(config);
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    // Handle error
    console.error("API Error:", error);
    throw error;
  }
};
