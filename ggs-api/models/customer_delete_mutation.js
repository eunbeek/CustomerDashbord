const customerDeleteMutation = (id) => {
  return `
    mutation {
      customerDelete(input: {id: "gid://shopify/Customer/${id}"}) {
        deletedCustomerId
        userErrors {
          field
          message
        }
      }
    }
  `;
};

module.exports = customerDeleteMutation;
