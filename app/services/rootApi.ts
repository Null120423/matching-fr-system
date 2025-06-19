import initApi from "./init";
console.log("Initializing rootApi with URL:", process.env.EXPO_PUBLIC_API_URL);
const rootApi = initApi(process.env.EXPO_PUBLIC_API_URL);
export { rootApi };
