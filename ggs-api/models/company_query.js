const company_query = (id)=> `
  {
    company(id: "gid://shopify/Company/${id}") {
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
`;

module.exports = company_query;

