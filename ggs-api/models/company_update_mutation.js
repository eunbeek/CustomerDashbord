const companyUpdateMutation = (id, name) => `
  mutation {
    companyUpdate(companyId: "gid://shopify/Company/${id}", input: {
      name: "${name}",
    }) {
      company {
        id
        name
      }
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = companyUpdateMutation;
