const customers_query = ` 
{
  customers(first: 50) {
        nodes {
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
                company
                country
                provinceCode
                zip
                countryCode
            }
            locale
            companyContactProfiles {
                id
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
    }
}`;

module.exports = customers_query;