import React from 'react';
import './App.css';
import DataTables from './components/DataTables';
import { Container, Typography, Chip, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

function App() {
  return (
    <div className="App" style={{backgroundColor:'#3E4A60'}}>
      <Container sx={{ paddingBottom: '20px', maxWidth: '80%' }}>
        <Grid container spacing={2} sx={{ paddingY: '50px' }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', paddingBottom: '20px', color:'white' }}>
              GGS Dashboard 
               <Chip label="V 1.0.0" sx={{ backgroundColor: '#FF6B6B', color: 'white', marginLeft: '10px' }} /> 
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{paddingBottom:'50px'}}>
          <DataTables />
        </Box>
      </Container>
    </div>
  );
}

export default App;
