const companyContactRemoveMutation = (companyContactId) => `
  mutation {
    companyContactRemoveFromCompany(companyContactId: "gid://shopify/CompanyContact/${companyContactId}") {
      removedCompanyContactId
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = companyContactRemoveMutation;
