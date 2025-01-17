const shopifyApi = require('../config/shopify_config');
const pool = require('../config/postgres_db');
const customers_query = require('../models/customers_query');
const company_query = require('../models/company_query');
const companyAssignCustomerAsContactMutation = require('../models/company_assign_contact_mutation');
const companyContactDeleteMutation = require('../models/company_contact_delete_mutation');
const companyContactRemoveMutation = require('../models/company_contact_remove_mutation');
const customerCreateMutation = require('../models/customer_create_mutation');
const customerUpdateMutation = require('../models/customer_update_mutation');
const customerDeleteMutation = require('../models/customer_delete_mutation');

// sync customer data from Shopify to Database
const syncCustomersFromShopifyToDB = async (req, res) => {
  try {
    // fetch customers from Shopify
    const response = await shopifyApi.post('', { query: customers_query });
    const customers = response.data.data.customers.nodes;

    // save customers to database
    for (let customer of customers) {
      await addCustomerToDB(customer);
    }
    res?.status(200).json('Customers successfully synced from Shopify to DB');
  } catch (error) {
    console.error('Error syncing customers from Shopify to DB:', error.message);
  }
};

// get all list of customers from database
const getAllCustomers = async (req, res) => {
  try {
    const customers = await pool.query('SELECT cust.*, comp.name AS company_name FROM customers AS cust LEFT JOIN companies AS comp ON cust.company_id = comp.id');

    res.status(200).json(customers.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers from DB' });
  }
};

// get customer by id from database
const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT cust.*, comp.name AS company_name FROM customers AS cust LEFT JOIN companies AS comp ON cust.company_id = comp.id WHERE id = $1', [id]);
    const customer = result.rows[0];

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer from DB', error });
  }
};

const addCustomer = async (req, res) => {
  const { firstName, lastName, email, phone, address1, address2, city, zip, country, zoneCode } = req.body;

  const mutation = customerCreateMutation(firstName, lastName, email, phone, address1, address2, city, zip, zoneCode, country);
  
  try {
    const response = await shopifyApi.post('', { query: mutation });

    const userErrors = response.data.data.customerCreate.userErrors;
    if (userErrors && userErrors.length > 0) {
      return res.status(400).json({ errors: userErrors });
    }

    const customer = response.data.data.customerCreate.customer;

    addCustomerToDB(customer);

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer', error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, address1, address2, city, countryCode, zip, country, company_id, zone_code } = req.body;

  try {
    // get exisitng customer data to avoid null value
    const existingCustomerResult = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    const existingCustomer = existingCustomerResult.rows[0];

    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const updatedFirstName = firstName || existingCustomer.first_name;
    const updatedLastName = lastName || existingCustomer.last_name;
    const updatedPhone = phone || existingCustomer.phone;
    const updatedAddress1 = address1 || existingCustomer.address1;
    const updatedAddress2 = address2 || existingCustomer.address2;
    const updatedCity = city || existingCustomer.city;
    const updatedCountryCode = countryCode || existingCustomer.country_code;
    const updatedZip = zip || existingCustomer.zip;
    const updatedCountry = country || existingCustomer.country;
    const updatedCompanyId = company_id || existingCustomer.company_id;

    // Shopify API로 mutation 전송
    const mutation = customerUpdateMutation(
      id,
      updatedFirstName,
      updatedLastName,
      updatedPhone,
      updatedAddress1,
      updatedAddress2,
      updatedCity,
      updatedCountryCode,
      updatedZip,
      updatedCountry,
    );

    const response = await shopifyApi.post('', { query: mutation });
  
    const userErrors = response.data.data.customerUpdate.userErrors;
    if (userErrors && userErrors.length > 0) {
      return res.status(400).json({ errors: userErrors });
    }

    const customer = response.data.data.customerUpdate.customer;

    // DB update
    await pool.query(`
      UPDATE customers
      SET first_name = $1, 
          last_name = $2, 
          phone = $3, 
          address1 = $4, 
          address2 = $5, 
          city = $6, 
          country_code = $7, 
          zip = $8, 
          country = $9,
          company_id = $10
      WHERE id = $11
    `, [
      updatedFirstName,
      updatedLastName,
      updatedPhone,
      updatedAddress1,
      updatedAddress2,
      updatedCity,
      updatedCountryCode,
      updatedZip,
      updatedCountry,
      updatedCompanyId,
      id
    ]);

    // Assign company to customer if `company_id` is provided
    if (company_id) {
      await assignCompanyToCustomer(id, company_id); // Pass customer_id and company_id to the function
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};

const assignCompanyToCustomer = async (customer_id, company_id) => {
  try {
    // Remove customer from related tables(compay_customer_contacts)
    const existingContact = await pool.query('SELECT * FROM company_customer_contacts WHERE customer_id = $1', [customer_id]);

    if (existingContact.rows.length > 0) {
      // remove contact from previous company
      const removeMutation = companyContactRemoveMutation(existingContact.rows[0].id);
      const responseRemove = await shopifyApi.post('', { query: removeMutation });
      const userErrors = responseRemove.data.data.companyContactRemoveFromCompany?.userErrors;
      if (userErrors && userErrors.length > 0) {
        console.log({ errors: userErrors });
        return;
      }
      // delete previous record in related table
      await pool.query('DELETE FROM company_customer_contacts WHERE id = $1', [existingContact.rows[0].id]);

      // update previouse company's contactCount
      const originCompanyId = existingContact.rows[0]?.company_id;
      const query = company_query(originCompanyId);
      const responseUpdated = await shopifyApi.post('', { query: query });
      const newCount = responseUpdated.data.data.company.contactsCount.count;
      await pool.query('UPDATE companies SET contacts_count=$1 WHERE id=$2',[newCount, originCompanyId]);
    }

    // Assign company to customer
    const mutation = companyAssignCustomerAsContactMutation(company_id, customer_id);
    const responseAssign = await shopifyApi.post('', { query: mutation });
    const assginedContact = responseAssign.data.data.companyAssignCustomerAsContact;

    const userErrorsAssign = assginedContact?.userErrors;
    if (userErrorsAssign && userErrorsAssign.length > 0) {
      console.log({ errors: userErrorsAssign });
      return;
    }

    const contactId = assginedContact.companyContact?.id?.split('/').pop();
    const contactsCount = assginedContact.companyContact.company.contactsCount.count;

    if (contactId) {
      // add onboarding record in related table
      await pool.query('INSERT INTO company_customer_contacts (id, company_id, customer_id) VALUES ($1, $2, $3)', [contactId, company_id, customer_id]);
      // update onboarding company's contactCount
      await pool.query('UPDATE companies SET contacts_count=$1 WHERE id=$2',[contactsCount, company_id]);
    }
    console.log({ message: 'Customer successfully assigned to company'});
  } catch (error) {
    console.error('Error assigning company to customer', error);
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  const mutation = customerDeleteMutation(id);

  try {
    const response = await shopifyApi.post('', { query: mutation });
    const userErrors = response.data.data.customerDelete.userErrors;
    if (userErrors && userErrors.length > 0) {
      return res.status(400).json({ errors: userErrors });
    }

    const deletedId = response.data.data.customerDelete.deletedCustomerId?.split('/').pop();
    var associatedCompanyId;
    const deletedCustomer = await pool.query('SELECT company_id FROM customers WHERE id=$1',[id]);
    if (deletedCustomer.rows.length > 0) {
      associatedCompanyId =  deletedCustomer.rows[0].company_id;
      // Remove customer from related tables
      await pool.query('DELETE FROM company_customer_contacts WHERE customer_id = $1', [deletedId]);
    }


    // Remove from database
    await pool.query('DELETE FROM customers WHERE id = $1', [deletedId]);

    // update company contacts number
    if(associatedCompanyId != null){
      const query = company_query(associatedCompanyId);
      const responseUpdated = await shopifyApi.post('', { query: query });
      const newCount = responseUpdated.data.data.company.contactsCount.count;
      await pool.query('UPDATE companies SET contacts_count=$1 WHERE id=$2',[newCount, associatedCompanyId]);
    }

    res.status(200).json({ message: `Customer ${deletedId} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};


// function to add each customer to db
const addCustomerToDB = async (customer) => {
  const {
    id,
    email,
    firstName,
    lastName,
    numberOfOrders,
    amountSpent: { amount: totalSpent, currencyCode: currency },
    phone,
    addresses,
    companyContactProfiles,
    createdAt
  } = customer;

  // extract company information
  const companyInfo = companyContactProfiles.length > 0 ? companyContactProfiles[0].company : null;
  const companyId = companyInfo ? companyInfo.id.split('/').pop() : null;
  const customerId = id?.split('/').pop();
  // extract address information
  const address = addresses.length > 0 ? addresses[0] : {};
  const {
    address1, address2, city, provinceCode, country, zip, countryCode
  } = address;

  try {
    await pool.query(`
      INSERT INTO customers 
        (id, email, first_name, last_name, phone, image_url, number_of_orders, amount_spent, currency_code, locale, address1, address2, city, zone_code, country, zip, country_code, company_id, created_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (id) DO UPDATE 
      SET email = EXCLUDED.email, 
          first_name = EXCLUDED.first_name, 
          last_name = EXCLUDED.last_name, 
          phone = EXCLUDED.phone, 
          image_url = EXCLUDED.image_url,
          number_of_orders = EXCLUDED.number_of_orders, 
          amount_spent = EXCLUDED.amount_spent, 
          currency_code = EXCLUDED.currency_code,
          locale = EXCLUDED.locale,
          address1 = EXCLUDED.address1,
          address2 = EXCLUDED.address2,
          city = EXCLUDED.city,
          zone_code = EXCLUDED.zone_code,
          country = EXCLUDED.country,
          zip = EXCLUDED.zip,
          country_code = EXCLUDED.country_code,
          company_id = EXCLUDED.company_id
    `, [
      customerId, 
      email, 
      firstName || null, 
      lastName || null, 
      phone || null,
      customer.image?.url || null,
      numberOfOrders || 0, 
      totalSpent || 0,  
      currency, 
      customer.locale || null, 
      address1 || null, 
      address2 || null, 
      city || null, 
      provinceCode || null, 
      country || null, 
      zip || null, 
      countryCode || null, 
      companyId || null,
      createdAt 
    ]);

    // if company id exists, fin
    if (companyId) {
      console.log('Assign Company :'+companyId);
      const contactId = companyContactProfiles[0].id?.split('/').pop();
      await pool.query('INSERT INTO company_customer_contacts (id, company_id, customer_id) VALUES ($1, $2, $3) ',[ contactId, companyId,customerId]);
    }

    console.log(`Customer with ID ${id} inserted/updated successfully.`);
  } catch (error) {
    console.error(`Error inserting/updating customer or company: ${error.message}`);
  }
};

module.exports = { 
  syncCustomersFromShopifyToDB,
  getAllCustomers,
  getCustomerById, 
  addCustomer, 
  updateCustomer,
  deleteCustomer 
};
