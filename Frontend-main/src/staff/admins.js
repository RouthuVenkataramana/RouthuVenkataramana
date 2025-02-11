import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box, TextField, MenuItem, Grid, InputAdornment, IconButton } from '@mui/material';
import { Search, Visibility, VisibilityOff } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Admins() {
  const [open, setOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    branch: '',
    password: '',
    role:'admin'
  });
  const [getadmins, setGetadmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleClose();
    axios.post(`${process.env.REACT_APP_ENQUIRY}/createadmin`, adminData).then((res) => {
      if (res.status === 200) {
        Swal.fire("Admin created successfully");
     
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data,
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: "The Internet?",
        text: "Check your internet connection",
        icon: "question"
      });
    });
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getadmins`).then((res) => {
      if (res.status === 200) {
        setGetadmins(res.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!..",
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: "The Internet?",
        text: "Check your internet connection",
        icon: "question"
      });
    });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdmins = getadmins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePasswordVisibility = (id) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [id]: !prevVisibility[id],
    }));
  };

  const deletehandler=(id)=>{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
    
            axios.delete(`${process.env.REACT_APP_ENQUIRY}/deleteadmin/${id}`).then((res)=>{
                if(res.status===200){
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                      });
                      setTimeout(()=>{
                        window.location.reload()
                    },1000)
                }
                else{
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!..",
                      }); 
                }
            }).catch((err)=>{
                Swal.fire({
                    title: "The Internet?",
                    text: "Check your internet connection",
                    icon: "question"
                  });
            })
        }
      });
  }


  const handleSendEmail = (employee) => {
    axios.post(`${process.env.REACT_APP_ENQUIRY}/send-email`, employee)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Email sent to ${employee.email} successfully!`,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data,
          });
        }
      }).catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data || err.message,
        });
      });
  };

  return (
    <div style={{ marginTop: '70px' }}>
        <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleOpen} style={{padding:'10px 60px',marginLeft:'30px'}}>
            Add Admin
          </Button>
        </Grid>
        <Grid item xs>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search by Name, Email or Branch"
            value={searchTerm}
            style={{padding:'5px 35px',width:'350px',float:'right'}}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{background:'rgb(66, 135, 245)'}}>
            <TableRow>
              <TableCell style={{color:'white',fontWeight:'bold'}}>Id</TableCell>
              <TableCell style={{color:'white',fontWeight:'bold'}}>Employee Name</TableCell>
              <TableCell style={{color:'white',fontWeight:'bold'}}>Email</TableCell>
              <TableCell style={{color:'white',fontWeight:'bold'}}>Contact Number</TableCell>
              <TableCell style={{color:'white',fontWeight:'bold'}}>Password</TableCell>
              <TableCell style={{color:'white',fontWeight:'bold'}}>Branch</TableCell>
              <TableCell style={{color:'white',fontWeight:'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.map((item, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell>
                  <TextField
                    type={passwordVisibility[index] ? 'text' : 'password'}
                    value={item.password}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility(index)}
                            edge="end"
                          >
                            {passwordVisibility[index] ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" style={{background:'green'}} endIcon={<SendIcon />} onClick={()=>handleSendEmail(item)}>Send</Button>
                    <Button variant="contained" style={{background:'red'}} startIcon={<DeleteIcon />} onClick={()=>deletehandler(item.id)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Admin
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Admin Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={adminData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                value={adminData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="contactNumber"
                value={adminData.contactNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                value={adminData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Branch"
                variant="outlined"
                fullWidth
                margin="normal"
                name="branch"
                value={adminData.branch}
                onChange={handleChange}
                select
              >
                <MenuItem value="Madhurwada">Madhurawada</MenuItem>
                <MenuItem value="Ramatakies">Ramatalkies</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} color="secondary" sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
