const express = require('express');
const dotenv = require('dotenv');
const customerRoutes = require('./routes/customer_routes');
const companyRoutes = require('./routes/company_routes');
const { syncDatasWithShopify } = require('./controllers/customer_scheduler');

// api config
dotenv.config();
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// declare routes by user type
app.use('/api/customers', customerRoutes);
app.use('/api/companies', companyRoutes);

// default url
app.get('/', (req, res) => {
  res.send('Success to connect in Shopify API');
});

// 404 error
app.use((req, res, next) => {
  res.status(404).json({ message: '404 Not Found - Invalid URL' });
});

// 500 error(server error)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  syncDatasWithShopify;
});