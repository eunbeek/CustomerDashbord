import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Avatar, IconButton, Tooltip, ToggleButton, ToggleButtonGroup, Snackbar } from '@mui/material';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import DomainIcon from '@mui/icons-material/Domain';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import DrawerDetail from './DrawerDetail';

const DataTables = () => {
  // customer and company lists
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [alignment, setAlignment] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // drawer
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [completedMessage, setCompletedMessage] = useState('');

  useEffect(() => {
     fetch(`${process.env.REACT_APP_GGS_API_URL}/customers/`)
        .then(response => response.json())
        .then(data => setCustomers(data)) 
     fetch(`${process.env.REACT_APP_GGS_API_URL}/companies/`)
        .then(response => response.json())
        .then(data => setCompanies(data));
  }, [alignment, open]);

  // switch data table
  const handleTableChange = () => {
    handleDrawerClose();
    setAlignment(!alignment);
    setSearchKeyword('');
  }

  // customer detail page on
  const handleClickForDetail = (customer) => {
    setOpen(true);
    setSelectedCustomer(customer);
    setSelectedCompany(null);
  }

  // company detail page on
  const handleClickForCompanyDetail = (company) => {
    setOpen(true);
    setSelectedCustomer(null);
    setSelectedCompany(company);
  }

  // customer creation page on
  const handleCreation = () => {
    setOpen(true);
    setSelectedCustomer(null);
    setSelectedCompany(null);
  };

  // drawer page off
  const handleDrawerClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
    setSelectedCompany(null);
  };

  // search by email, name, company
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  }

  const filteredCustomers = customers.filter(customer =>
    customer.email?.toLowerCase().includes(searchKeyword?.toLowerCase()) ||
    customer.first_name?.toLowerCase().includes(searchKeyword?.toLowerCase()) ||
    customer.last_name?.toLowerCase().includes(searchKeyword?.toLowerCase()) ||
    customer.company_name?.toLowerCase().includes(searchKeyword?.toLowerCase())
  );

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchKeyword?.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ borderRadius: '35px', backgroundColor:'#F2F2F2' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '20px' ,
        }}
      >
        <Box>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleTableChange}
            aria-label="Platform"
            color='primary'
            sx={{
              '& .MuiToggleButton-root': {
                borderColor: '#7CB19D',
                color: '#7CB19D',
                '&.Mui-selected': {
                  backgroundColor: '#7CB19D',
                  color: '#fff',
                },
              },
            }}
          >
            <Tooltip title="Customers">
              <ToggleButton value={true}><GroupOutlinedIcon /></ToggleButton>
            </Tooltip>
            <Tooltip title="Companies">
              <ToggleButton value={false}><DomainIcon /></ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{width: '100%', paddingX:"20px"}}>
          <TextField
            label={alignment ? "Search Customers by Keywords" : "Search Companies by Keywords"}
            sx={{
              width: '100%',
              borderColor: '#e0e0e0',
              borderRadius: '16px',
              '& fieldset': { borderRadius: '16px' }
            }}
            value={searchKeyword}
            onChange={handleSearch}
          />
        </Box>
        <Box>
          <Tooltip title={alignment ? 'Add Customer' : 'Add Company'}>
            <IconButton onClick={handleCreation}>
              <AddCircleTwoToneIcon sx={{ color: '#FF6B6B', fontSize: 35 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <TableContainer sx={{maxHeight: 600}}>
        {alignment ? (
          <Table stickyHeader sx={{'th': { borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' } }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => handleClickForDetail(customer)}
                  sx={{
                    backgroundColor: selectedCustomer?.id === customer.id ? '#A7CFC0' : 'transparent',
                    '&:hover': { backgroundColor: '#D1E8E0', cursor: 'pointer' }
                  }}
                >
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar alt={customer.first_name} src={customer.image_url || '/defaultProfile.png'} sx={{ marginRight: 2 }} />
                      <Typography>{customer.first_name} {customer.last_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.company_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table stickyHeader sx={{ 'th': { borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' } }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Number of Contacts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  onClick={() => handleClickForCompanyDetail(company)}
                  sx={{
                    backgroundColor: selectedCompany?.id === company.id ? '#A7CFC0' : 'transparent',
                    '&:hover': { backgroundColor: '#D1E8E0', cursor: 'pointer' }
                  }}
                >
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.amount}</TableCell>
                  <TableCell>{company.contacts_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <DrawerDetail open={open} isCustomer={alignment} selectedData={alignment ? selectedCustomer:selectedCompany} companyList={companies} handleClose={handleDrawerClose} setCompletedMessage={setCompletedMessage} />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={Boolean(completedMessage)}
        autoHideDuration={3000} // Automatically close after 3 seconds
        onClose={() => setCompletedMessage('')} // Reset message when closed
        message={completedMessage}
      />
    </Paper>
  );
};

export default DataTables;
