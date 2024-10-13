const companies_query = `
  {
    companies(first: 10) {
      nodes {
        id
        name
        contactsCount {
          count
        }
        createdAt
        totalSpent {
          amount
          currencyCode
        }
        contacts(first:10) {
            nodes {
                id
                customer {
                    id
                }
            }
        }
      }
    }
  }
`;

module.exports = companies_query;

