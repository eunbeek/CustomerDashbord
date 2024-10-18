import React, {useEffect, useState} from 'react';
import { Drawer, Box, Typography, Avatar, Button,  TextField, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';

const DrawerDetail = ({ open, isCustomer, selectedData, companyList, handleClose, setCompletedMessage }) => {
  const [newData, setNewData] = useState({ ...selectedData });
  const [isLoading, setIsLoading] = useState(false);

  console.log(selectedData);

  useEffect(() => {
    if (selectedData) {
      setNewData({ ...selectedData });
    }
  }, [selectedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDrawerClose = () => {
    handleClose();
    setNewData(null);
  }

  const handleCustomerCreate = () => {
    console.log('customer create');
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_GGS_API_URL}/customers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: newData.first_name,
        lastName: newData.last_name,
        email: newData.email,
        phone: newData.phone,
        address1: newData.address1,
        address2: newData.address2,
        city: newData.city,
        zoneCode: newData.zone_code,
        zip: newData.zip,
        country: newData.country
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Customer created successfully:', data);
      setIsLoading(false);
      setCompletedMessage('Customer created successfully');
      handleDrawerClose();
    })
    .catch((error) => {
      console.error('Error creating customer:', error);
      setIsLoading(false);
      setCompletedMessage('Error creating customer: '+ error);
    });
  };  

  const handleCustomerUpdate = () => {
    console.log('customer update');
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_GGS_API_URL}/customers/${selectedData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: newData.first_name || selectedData.first_name,
        lastName: newData.last_name || selectedData.last_name,
        email: newData.email || selectedData.email,
        phone: newData.phone || selectedData.phone,
        address1: newData.address1 || selectedData.address1,
        address2: newData.address2 || selectedData.address2,
        city: newData.city || selectedData.city,
        zoneCode: newData.zoneCode || selectedData.zone_code,
        zip: newData.zip || selectedData.zip,
        country: newData.country || selectedData.country,
        company_id: newData.company_id || selectedData.company_id,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Customer updated successfully:', data);
      setIsLoading(false);
      setCompletedMessage('Customer updated successfully');
      handleDrawerClose();
    })
    .catch((error) => {
      console.error('Error updating customer:', error);
      setIsLoading(false);
      setCompletedMessage('Error updating customer');
    });
  };  

  const handleCustomerDelete = () => {
    console.log('customer delete');
    fetch(`${process.env.REACT_APP_GGS_API_URL}/customers/${selectedData.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Customer deleted successfully:', data);
      setCompletedMessage('Customer deleted successfully');
      handleDrawerClose();
    })
    .catch((error) => {
      console.error('Error deleting customer:', error);
      setCompletedMessage('Error deleting customer');
    });
  };  

  const handleCompanyCreate = () => {
    console.log('company create');
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_GGS_API_URL}/companies/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newData.name,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Company created successfully:', data);
      setIsLoading(false);
      setCompletedMessage('Company created successfully');
      handleDrawerClose();
    })
    .catch((error) => {
      console.error('Error creating company:', error);
      setIsLoading(false);
      setCompletedMessage('Error creating company');
    });
  };

  const handleCompanyUpdate = () => {
    console.log('company update');
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_GGS_API_URL}/companies/${selectedData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newData.name,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Company updated successfully:', data);
      setIsLoading(false);
      setCompletedMessage('Company updated successfully');
      handleDrawerClose();
    })
    .catch((error) => {
      console.error('Error updating company:', error);
      setIsLoading(false);
      setCompletedMessage('Error updating company');
    });
  }

  const handleCompanyDelete = () => {
    console.log('company delete');
    console.log(newData);
    fetch(`${process.env.REACT_APP_GGS_API_URL}/companies/${selectedData.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Company deleted successfully:', data);
      setCompletedMessage('Company deleted successfully');
      handleDrawerClose();
    })
    .catch((error) => {
      console.error('Error deleting company:', error);
      setCompletedMessage('Error deleting company');
    });
  }

  return (
    <Drawer 
      anchor="right" 
      variant={selectedData ? "persistent" : "temporary"} 
      open={open} 
      onClose={handleDrawerClose}   
      PaperProps={{
        sx: {
          borderTopLeftRadius : '30px',
          borderBottomLeftRadius: '30px',
          width: 500,
          backgroundColor:'#EDEFF7'
        }
      }}
    >
      <Box sx={{padding: 2}}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={handleDrawerClose} >
                <CloseIcon />
            </IconButton>
            <Typography variant="h6">{selectedData ? isCustomer ? 'Customer Detail': 'Company Detail' : isCustomer ? 'Create New Customer' : 'Create New Company'}</Typography>
        </Box>
        {isCustomer && (
          <>
            {selectedData && 
                <Box display="flex" alignItems="center" mt={2}>
                  <Avatar src={selectedData?.image_url || '/defaultProfile.png'} sx={{ width: 64, height: 64 }} />
                  <Box ml={2}>
                      <Typography variant="h6">{selectedData?.first_name} {selectedData?.last_name} ({selectedData?.id})</Typography>
                  </Box>
                </Box>
            }
            <Box mt={4}>
                <TextField
                    label="Email"
                    name="email"
                    disabled={selectedData ? true : false}
                    value={newData?.email || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Box display="flex">
                  <TextField
                      label="First Name"
                      name="first_name"
                      value={newData?.first_name || ''}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2, mr: 2}}
                  />
                  <TextField
                      label="Last Name"
                      name="last_name"
                      value={newData?.last_name || ''}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                  />
                </Box>
                <TextField
                    label="Phone"
                    name="phone"
                    value={newData?.phone || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Address"
                    name="address1"
                    value={newData?.address1 || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="City"
                    name="city"
                    value={newData?.city || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Box display="flex">
                  <TextField
                      label="Province Code"
                      name="zone_code"
                      value={newData?.zone_code || ''}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2, mr: 2 }}
                  />
                  <TextField
                      label="Country"
                      name="country"
                      value={newData?.country || ''}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                  />
                </Box>
                <TextField
                    label="ZIP Code"
                    name="zip"
                    value={newData?.zip || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                {selectedData && (
                  <FormControl fullWidth>
                    <InputLabel id="company-simple-select-label">Assign Company</InputLabel>
                    <Select
                      label='Assign Company'
                      value={newData?.company_id || ''} 
                      onChange={(e) => setNewData({ ...newData, company_id: e.target.value })} 
                      sx={{textAlign:'left'}}
                      fullWidth
                    >
                      {companyList.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={selectedData ? handleCustomerUpdate : handleCustomerCreate}
                sx={{ mt: 2, backgroundColor: '#1A3E5F', color: 'white' }}
            >
                {selectedData ? 'Update' : 'Create'}
            </Button>

            {selectedData && (
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleCustomerDelete}
                    sx={{ mt: 2, ml: 2, backgroundColor: '#D9534F', color: 'white' }}
                >
                    Delete
                </Button>
            )}
          </>
        )}
        {!isCustomer && (
          <>
            {selectedData && 
                <Box display="flex" alignItems="center" mt={2}>
                  <Box ml={2}>
                      <Typography variant="h6">{newData?.name}</Typography>
                  </Box>
                </Box>
            }
            <Box mt={4}>
              {selectedData && (
                <TextField
                    label="Company Id"
                    name="id"
                    disabled={true}
                    value={newData?.id || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
              )}
              <TextField
                label="Company Name"
                name="name"
                value={newData?.name || ''}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              {selectedData && (
                <>
                  <TextField
                    label="Total Amount"
                    name="amount"
                    disabled={true}
                    value={newData?.amount || ''}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Number of Contacts"
                    name="contacts_count"
                    disabled={true}
                    value={newData?.contacts_count || ''}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </>
              )}
            </Box>  
            <LoadingButton
                loading={isLoading}
                variant="contained"
                onClick={selectedData ? handleCompanyUpdate : handleCompanyCreate}
                sx={{ mt: 2, backgroundColor: '#1A3E5F', color: 'white' }}
            >
                {selectedData ? 'Update' : 'Create'}
            </LoadingButton>

            {selectedData && (
                <Button
                    variant="contained"
                    onClick={handleCompanyDelete}
                    sx={{ mt: 2, ml: 2, backgroundColor: '#D9534F', color: 'white' }}
                >
                    Delete
                </Button>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default DrawerDetail;
