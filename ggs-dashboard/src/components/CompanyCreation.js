import React from 'react';
import { Drawer, Box, Typography, Avatar, Button,  TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CompanyCreation = ({ selectedCustomer, open, handleClose, handleSubmit }) => {
  const [customerData, setCustomerData] = React.useState({ ...selectedCustomer });

  React.useEffect(() => {
    if (selectedCustomer) {
      setCustomerData({ ...selectedCustomer });
    }
  }, [selectedCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Drawer anchor="right" variant={selectedCustomer ? "persistent" : "temporary"} open={open} onClose={handleClose}>
      <Box sx={{ width: 450, padding: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={handleClose}>
                <CloseIcon />
            </IconButton>
            <Typography variant="h6">{selectedCustomer ? 'Customer Detail': 'Create New Customer'}</Typography>
        </Box>
        {customerData && (
          <>
            {selectedCustomer && 
                <Box display="flex" alignItems="center" mt={2}>
                <Avatar src={customerData.image_url || '/defaultProfile.png'} sx={{ width: 64, height: 64 }} />
                <Box ml={2}>
                    <Typography variant="h6">{customerData.first_name} {customerData.last_name}</Typography>
                </Box>
                </Box>
            }
            <Box mt={4}>
                <TextField
                    label="Email"
                    name="email"
                    disabled={true}
                    value={customerData.email || ''}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="First Name"
                    name="first_name"
                    value={customerData.first_name || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={customerData.last_name || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={customerData.phone || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Address Line 1"
                    name="address1"
                    value={customerData.address1 || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Address Line 2"
                    name="address2"
                    value={customerData.address2 || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="City"
                    name="city"
                    value={customerData.city || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Country"
                    name="country"
                    value={customerData.country || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="ZIP Code"
                    name="zip"
                    value={customerData.zip || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(customerData)}
                sx={{ mt: 2 }}
            >
                {selectedCustomer ? 'Update' : 'Create'}
            </Button>

            {selectedCustomer && (
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleClose}
                    sx={{ mt: 2, ml: 2 }}
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

export default CompanyCreation;
