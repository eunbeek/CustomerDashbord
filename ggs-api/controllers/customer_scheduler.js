const schedule = require('node-schedule');
const syncCustomersFromShopifyToDB = require('./customer_controller');
const syncCompaniesFromShopifyToDB = require('./company_controller');

// every 12:00:00 AM Sync the customer/ company data
const syncDatasWithShopify = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await syncCompaniesFromShopifyToDB();
    await syncCustomersFromShopifyToDB();
    console.log('Customer data synced successfully');
  } catch (error) {
    console.error('Error syncing customer data from Shopify', error);
  }
});
