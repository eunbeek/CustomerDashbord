const companyAssignCustomerAsContactMutation = (company_id, customer_id) => `
  mutation {
    companyAssignCustomerAsContact(companyId: "gid://shopify/Company/${company_id}", customerId: "gid://shopify/Customer/${customer_id}") {
      companyContact {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = companyAssignCustomerAsContactMutation;
