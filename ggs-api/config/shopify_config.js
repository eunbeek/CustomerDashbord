const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const shopifyApi = axios.create({
  baseURL: `${process.env.SHOPIFY_API_URL}/admin/api/2024-07/graphql.json`,
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json'
  }
});

module.exports = shopifyApi;
