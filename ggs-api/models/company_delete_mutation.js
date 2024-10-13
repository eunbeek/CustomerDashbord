const companyDeleteMutation = (id) => `
  mutation {
    companyDelete(id: "gid://shopify/Company/${id}") {
      deletedCompanyId
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = companyDeleteMutation;