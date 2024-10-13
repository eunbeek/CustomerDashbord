const express = require('express');
const { syncCompaniesFromShopifyToDB, getAllCompanies, getCompanyById, addCompany, updateCompany, deleteCompany } = require('../controllers/company_controller');
const router = express.Router();

router.get('/sync', syncCompaniesFromShopifyToDB);
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.post('/', addCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

module.exports = router;
