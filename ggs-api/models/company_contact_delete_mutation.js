const companyContactDeleteMutation = (companyContactId) => `
  mutation {
    companyContactDelete(companyContactId: "gid://shopify/CompanyContact/${companyContactId}") {
      deletedCompanyContactId
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = companyContactDeleteMutation;
