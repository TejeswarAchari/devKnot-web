// const BASEURL = "http://localhost:7777/";
// export default BASEURL;


// src/utils/constants.js

// 🔥 Auto-detect environment and set backend URL smartly
const isLocalhost = window.location.hostname === "localhost";

// 👇 Local backend while developing
const LOCAL_URL = "http://localhost:7777/";

// 👇 Production backend after deployment (change THIS only ONCE)
const PROD_URL = "https://devknot-backend.onrender.com/"; 
// ❗ Replace with your backend URL after deploying
// Example: https://devknot-backend.onrender.com/
// OR: https://backend.devknot.in/

const BASEURL = isLocalhost ? LOCAL_URL : PROD_URL;

export default BASEURL;
