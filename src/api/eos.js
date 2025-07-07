// src/api/eos.js
import axios from 'axios';

const EOS_API_BASE_URL = '/api/v2'; // Use relative path for proxy
const API_KEY = '4d550f64-4f89-449b-83ce-a3eec1bc83b4';

export async function getFilesAndFolders(workspace = 'Default', path = '\\') {
  try {
    const response = await axios.get(`${EOS_API_BASE_URL}/folders/lookup`, {
      params: {
        workspace,
        path,
        includeFolders: true,
        includeFiles: true,
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (e) {
    console.error('Files API error:', e);
    if (e.response) {
      console.error('Files API error response:', e.response);
    }
    throw e;
  }
}

// Authenticated call using session token as HTTP Basic Auth, matching Postman XHR
export async function getFilesAndFoldersWithToken(token, workspace = 'Default', path = '\\') {
  const basicAuth = btoa(`TOKEN:${token}:`); // username: TOKEN:<token>, password: (blank)
  try {
    const response = await axios.get(`${EOS_API_BASE_URL}/folders/lookup`, {
      params: {
        workspace,
        path,
        includeFolders: true,
        includeFiles: true,
        apiKey: API_KEY
      },
      headers: {
        'Authorization': `Basic ${basicAuth}`
      },
      withCredentials: true
    });
    return response.data;
  } catch (e) {
    console.error('Files API (token) error:', e);
    if (e.response) {
      console.error('Files API (token) error response:', e.response);
    }
    throw e;
  }
}

// Use the Node.js proxy for EngageCX API calls (bypasses CORS)
export async function getFilesAndFoldersViaProxy({ token = '', workspace = 'Default', path = '\\' } = {}) {
  try {
    const params = {
      workspace,
      path,
      includeFolders: true,
      includeFiles: true,
      apiKey: API_KEY
    };
    if (token) params.token = token.replace(/^TOKEN:/, '');
    const response = await axios.get('/proxy/folders/lookup', { params });
    return response.data;
  } catch (e) {
    console.error('Proxy Files API error:', e);
    if (e.response) {
      console.error('Proxy Files API error response:', e.response);
    }
    throw e;
  }
}

// Use the Node.js proxy for EngageCX authentication (bypasses CORS)
export async function getTokenViaProxy(username, password) {
  try {
    const credentials = `Demo#${username}:${password}`;
    const encoded = btoa(credentials);
    const response = await axios.get('/proxy/token', {
      headers: {
        'Authorization': `Basic ${encoded}`
      }
    });
    return response.data;
  } catch (e) {
    console.error('Proxy Token API error:', e);
    if (e.response) {
      console.error('Proxy Token API error response:', e.response);
    }
    throw e;
  }
}

export default {
  getFilesAndFolders,
  getFilesAndFoldersWithToken,
  getFilesAndFoldersViaProxy,
  getTokenViaProxy
};
