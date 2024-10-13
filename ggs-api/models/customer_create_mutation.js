const customerCreateMutation = (firstName, lastName, email, phone, address1, address2, city, zip, provinceCode, country) => `
  mutation {
    customerCreate(input: {
      firstName: "${firstName}",
      lastName: "${lastName}",
      email: "${email}",
      phone: "${phone}",
      addresses: [{
        address1: "${address1}",
        address2: "${address2}",
        city: "${city}",
        zip: "${zip}",
        provinceCode: "${provinceCode}",
        country: "${country}"
      }]
    }) {
      customer {
        id
        email
        firstName
        lastName
        phone
        image {
            id
            url
        }
        addresses {
            id
            address1
            address2
            city
            country
            provinceCode
            zip
        }
        locale
        tags
        companyContactProfiles {
            company {
                id
                name
            }
        }
        numberOfOrders
        amountSpent {
            amount
            currencyCode 
        }
        createdAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = customerCreateMutation;
