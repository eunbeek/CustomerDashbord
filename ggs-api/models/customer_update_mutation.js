const customerUpdateMutation = (id, firstName, lastName, phone, address1, address2, city, countryCode, zip, country) => {
    return `
      mutation {
        customerUpdate(input: {
          id: "gid://shopify/Customer/${id}"
          firstName: "${firstName}",
          lastName: "${lastName}",
          phone: "${phone}"
          addresses: [{
            address1: "${address1}",
            address2: "${address2}",
            city: "${city}",
            countryCode: ${countryCode},
            zip: "${zip}",
            country: "${country}"
          }]
        }) {
          customer {
            id
            email
            firstName
            lastName
            phone
            addresses {
              id
              address1
              address2
              city
              country
              zip
              countryCode
              province
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
  };
  
  module.exports = customerUpdateMutation;
  