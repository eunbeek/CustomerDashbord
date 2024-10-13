const express = require('express');
const { syncCustomersFromShopifyToDB, getAllCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer_controller');
const router = express.Router();

router.get('/sync', syncCustomersFromShopifyToDB);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', addCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
