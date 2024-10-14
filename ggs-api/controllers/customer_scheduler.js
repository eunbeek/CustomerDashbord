// customer_scheduler.js
const schedule = require('node-schedule');
const pool = require('../config/postgres_db');
const {syncCustomersFromShopifyToDB} = require('./customer_controller');
const {syncCompaniesFromShopifyToDB} = require('./company_controller');

// Schedule the job
const syncDatasWithShopify = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await pool.query('DELETE FROM company_customer_contacts');
    await syncCompaniesFromShopifyToDB();
    await syncCustomersFromShopifyToDB();
    console.log('Customer data synced successfully');
  } catch (error) {
    console.error('Error syncing customer data from Shopify', error);
  }
});

module.exports = { syncDatasWithShopify };
