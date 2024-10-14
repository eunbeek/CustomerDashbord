const pool = require('../config/postgres_db');
const shopifyApi = require('../config/shopify_config');
const companies_query = require('../models/companies_query');
const companyCreateMutation = require('../models/company_create_mutation');
const companyUpdateMutation = require('../models/company_update_mutation');
const companyDeleteMutation = require('../models/company_delete_mutation');

// Sync companies from Shopify to DB
const syncCompaniesFromShopifyToDB = async (req, res) => {

  try {
    // fetch companies by Shopify GraphQL API
    const response = await shopifyApi.post('', { query: companies_query });

    const companies = response.data.data.companies.nodes;

    // add the data from shopify to db
    for (let company of companies) {
      const { id, name, contactsCount, createdAt, totalSpent } = company;

      await pool.query(`
        INSERT INTO companies (id, name, contacts_count, created_at, amount, currency_code)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE 
        SET name = EXCLUDED.name,
            contacts_count = EXCLUDED.contacts_count,
            created_at = EXCLUDED.created_at,
            amount = EXCLUDED.amount,
            currency_code = EXCLUDED.currency_code
      `, [
        id.split('/').pop(), 
        name, 
        contactsCount.count || 0, 
        createdAt,
        totalSpent.amount || 0,
        totalSpent.currencyCode || 'CAD'
      ]);          
    }

    res?.status(200).json({ message: 'Companies synced successfully from Shopify to DB' });
  } catch (error) {
    console.error('Error syncing companies from Shopify to DB:', error.message);
    res?.status(500).json({ message: 'Error syncing companies from Shopify to DB', error: error.message });
  }
};

// get all list of companies from database
const getAllCompanies = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies from DB', error: error.message });
  }
};

// get company by id from DB
const getCompanyById = async (req, res) => {
  const { id } = req.params; 

  try {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    const company = result.rows[0];

    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company from DB', error: error.message });
  }
};

// add new company 
const addCompany = async (req, res) => {
  const { 
    name,
  } = req.body;

  // Prepare the mutation for Shopify API
  const mutation = companyCreateMutation(
    name,
  );

  try {
    // Call Shopify API to create the company
    const response = await shopifyApi.post('', { query: mutation });
    const userErrors = response.data.data.companyCreate.userErrors;
    if (userErrors && userErrors.length > 0) {
      return res.status(400).json({ errors: userErrors });
    }

    const company = response.data.data.companyCreate.company;
    const { id, name, contactsCount, createdAt, totalSpent } = company;

    // Insert the new company into the local database
    await pool.query(`
      INSERT INTO companies (id, name, contacts_count, created_at, amount, currency_code)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      id.split('/').pop(), 
      name, 
      contactsCount.count || 0, 
      createdAt,
      totalSpent.amount || 0,
      totalSpent.currencyCode || 'CAD'
    ]);

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error adding company', error: error.message });
  }
};

// update company
const updateCompany = async (req, res) => {
  const { id } = req.params;
  const {
    name,
  } = req.body;

  const mutation = companyUpdateMutation(id, name);

  try {
    const response = await shopifyApi.post('', { query: mutation });

    const userErrors = response.data.data.companyUpdate.userErrors;
    if (userErrors && userErrors.length > 0) {
      return res.status(400).json({ errors: userErrors });
    }

    const updatedCompany = response.data.data.companyUpdate.company;

    await pool.query(`
      UPDATE companies
      SET name = $1
      WHERE id = $2
    `, [
      name, id
    ]);

    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: 'Error updating company', error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;

  const mutation = companyDeleteMutation(id);

  try {
    const response = await shopifyApi.post('', { query: mutation });
    const userErrors = response.data.data.companyDelete.userErrors;
    if (userErrors && userErrors.length > 0) {
      return res.status(400).json({ errors: userErrors });
    }

    const deletedId = response.data.data.companyDelete.deletedCompanyId?.split('/').pop();

    // 1. Set company_id to NULL for customers linked to the company
    await pool.query('UPDATE customers SET company_id = NULL WHERE company_id = $1', [deletedId]);

    // 2. Delete any association in company_customer_contacts
    await pool.query('DELETE FROM company_customer_contacts WHERE company_id = $1', [deletedId]);

    // 3. Delete the company from the companies table
    await pool.query('DELETE FROM companies WHERE id = $1', [deletedId]);

    res.status(200).json({ message: `Company ${deletedId} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error: error.message });
  }
};


module.exports = { 
  syncCompaniesFromShopifyToDB,  // Shopify에서 동기화
  getAllCompanies,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany
};
