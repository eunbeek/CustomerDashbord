const companyCreateMutation = (name) => `
  mutation {
    companyCreate(input: {
      company: {
        name: "${name}",
      }
    }) {
      company {
        id
        name
        createdAt
        totalSpent {
          amount
          currencyCode
        }
        contactsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = companyCreateMutation;
