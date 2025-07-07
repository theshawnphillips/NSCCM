// Simple EngageCX proxy server for CORS/browser workaround
import express from 'express';
import axios from 'axios';
import multer from 'multer';

const app = express();
const PORT = 3001;

// Configure multer for file uploads
const upload = multer();

app.use(express.json());

// Proxy for EngageCX folders/lookup endpoint
app.get('/proxy/folders/lookup', async (req, res) => {
  try {
    const { workspace, path, includeFolders, includeFiles, apiKey, token } = req.query;
    const headers = {};
    if (token) {
      const basicAuth = Buffer.from(`TOKEN:${token}:`).toString('base64');
      headers['Authorization'] = `Basic ${basicAuth}`;
    }
    const result = await axios.get('https://engagecxdemo-enterprise.mhccom.net/api/v2/folders/lookup', {
      params: { workspace, path, includeFolders, includeFiles, apiKey },
      headers
    });
    res.json(result.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || { error: e.message });
  }
});

// Proxy for EngageCX authentication (token) endpoint
app.get('/proxy/token', async (req, res) => {
  try {
    const auth = req.headers['authorization'];
    const result = await axios.get('https://engagecxdemo-enterprise.mhccom.net/api/v2/token', {
      headers: { 'Authorization': auth }
    });
    console.log('EngageCX /token response:', result.data); // Log raw response
    res.json(result.data);
  } catch (e) {
    console.error('Proxy /proxy/token error:', e.response?.data || e.message);
    res.status(e.response?.status || 500).json(e.response?.data || { error: e.message });
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
