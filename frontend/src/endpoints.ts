// Central place for a few raw endpoint URLs.
// Prefer the shared Axios client in `src/api/client.ts` for new code — it adds
// the base URL and the auth token automatically.

const API_URL = process.env.REACT_APP_API_URL ?? 'https://localhost:7192';

export const urlCustomers = `${API_URL}/api/Customer/get-customers`;
