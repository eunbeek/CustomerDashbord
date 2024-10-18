import React, {useEffect, useState} from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import Grid from '@mui/material/Grid2';

const SummaryList = () => {
    const [customers, setCustomers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        var orders = 0;
        var sales = 0;
        fetch(`${process.env.REACT_APP_GGS_API_URL}/customers/`)
          .then(response => response.json())
          .then(data => { 
            customers.forEach((customer)=> orders += customer.number_of_orders);
            setOrderCount(orders);
            setCustomers(data); 
        });
          
        fetch(`${process.env.REACT_APP_GGS_API_URL}/companies/`)
          .then(response => response.json())
          .then(data => { 
            companies.forEach((company)=>sales+=company.amount)
            setCompanies(data); 
            setTotalSales(sales);
        });
      }, []);
    return (
        <Grid container spacing={2} justifyContent="flex-start">
            <Grid item size={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Total Sales
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {totalSales}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item size={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Number of Orders
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {orderCount}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item size={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div" sx={{textAlign:'left'}}>
                        New Users in the last 7 days
                        </Typography>
                        <LineChart
                            xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7] }]}
                            series={[
                                {
                                data: [2, 3, 5.5, 8.5, 1.5, 5, 1],
                                showMark: ({ index }) => index % 2 === 0,
                                },
                            ]}
                            width={500}
                            height={300}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default SummaryList;
