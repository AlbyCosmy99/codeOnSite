export const BACKEND_DEV = 'http://localhost:3000/';
export const BACKEND_PROD = 'https://frontend-code-on-site-backend.onrender.com/';

export const DEBUG = true;

const BACKEND = DEBUG ? BACKEND_DEV : BACKEND_PROD;
export default BACKEND;
