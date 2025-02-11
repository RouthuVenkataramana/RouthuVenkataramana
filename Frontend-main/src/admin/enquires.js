import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl, Grid, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';


export default function Enquires() {
  const [open, setOpen] = useState(false);
  const [getenquires, setGetenquires] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  const [editId, setEditId] = useState(null); // New state to store the ID of the record being edited
  const [enquiry, setEnquiry] = useState({
    name: '',
    contactNumber: '',
    branch: '',
    demo: '',
    interested: '',
    interestDetails: '',
    expectedJoinDate: '',
    remarks: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false); // Reset edit mode when closing the modal
    setEnquiry({
      name: '',
      contactNumber: '',
      branch: '',
      demo: '',
      interested: '',
      interestDetails: '',
      expectedJoinDate: '',
      remarks: ''
    });
  };

  const handleChange = (e) => {
    setEnquiry({
      ...enquiry,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getenquires`).then((res) => {
      setGetenquires(res.data);
    });
  }, []);

  const handleSubmit = () => {
    const details = {
      name: enquiry.name,
      contactNumber: enquiry.contactNumber,
      branch: enquiry.branch,
      demo: enquiry.demo,
      interested: enquiry.interested,
      interestDetails: enquiry.interestDetails,
      expectedJoinDate: enquiry.expectedJoinDate,
      remarks: enquiry.remarks
    };

    if (editMode) {
      axios.put(`${process.env.REACT_APP_ENQUIRY}/enquiry/${editId}`, details)
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Enquiry Updated Successfully",
              showConfirmButton: false,
              timer: 1500
            });
            // Update the table with the updated data
            setGetenquires((prev) => prev.map(item => item.id === editId ? res.data : item));
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.data,
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "The Internet?",
            text: "Check Your Internet Connection?",
            icon: "question"
          });
        });
        window.location.reload();
    } else {
    axios.post(`${process.env.REACT_APP_ENQUIRY}/enquiry`, details)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "FollowUP Added Successfully",
            showConfirmButton: false,
            timer: 1500
          });
          // Add the new data to the table
          setGetenquires((prev) => [...prev, res.data]);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data,
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "The Internet?",
          text: "Check Your Internet Connection?",
          icon: "question"
        });
      });
    }
    console.log(enquiry);
    handleClose();
  };

  const handledelete=(id)=>{

    Swal.fire({
        title: "Are you sure?",
        text: "You want to remove trainer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {

            axios.delete(`${process.env.REACT_APP_ENQUIRY}/deleteenquiry/${id}`).then((res)=>{
                if(res.status===200){
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                      });
                      setTimeout(()=>{
                        window.location.reload();
                      },1000)
                }
                else{
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: res.data,
                      });
                }
               }).catch((err)=>{
                Swal.fire({
                    title: "The Internet?",
                    text: "Check Your Internet Connection?",
                    icon: "question"
                  });
               })
        }
      });
  }

  const handleEdit = (item) => {
    setEditMode(true);
    setEditId(item.id);
    setEnquiry({
      name: item.name,
      contactNumber: item.contactNumber,
      branch: item.branch,
      demo: item.demo,
      interested: item.interested,
      interestDetails: item.interestDetails,
      expectedJoinDate: item.expectedJoinDate,
      remarks: item.remarks
    });
    handleOpen();
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      <Grid item xs={12} sm={3}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
          style={{ marginBottom: '20px',width:'300px' }}
        />
      </Grid>
      <h1 style={{textDecoration:'underline',fontFamily:'monospace'}}>Enquires</h1>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
        Add Enquiry
      </Button>

      <TableContainer component={Paper}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>Sl. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Demo</TableCell>
              <TableCell>Interested</TableCell>
              <TableCell>Interest Details</TableCell>
              <TableCell>Expected Join Date</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getenquires.map((item, index) =>
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.contactNumber}</TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell>{item.demo}</TableCell>
                <TableCell>{item.interested}</TableCell>
                <TableCell>{item.interestDetails}</TableCell>
                <TableCell>{item.expectedJoinDate}</TableCell>
                <TableCell>{item.remarks}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)} color='primary' style={{ fontSize: '16px' }}><EditIcon />Edit</IconButton>
                  <IconButton onClick={()=>handledelete(item.id)} color='secondary' style={{ fontSize: '16px' }}><DeleteIcon />Delete</IconButton>
                </TableCell>

              </TableRow>
            )

            }
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>Add Enquiry</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Name"
                  name="name"
                  value={enquiry.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Contact Number"
                  name="contactNumber"
                  value={enquiry.contactNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branch"
                  value={enquiry.branch}
                  onChange={handleChange}
                >
                  <MenuItem value="Ramatakies">Ramatakies</MenuItem>
                  <MenuItem value="Madhurawada">Madhurawada</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Demo Conducted</InputLabel>
                <Select
                  name="demo"
                  value={enquiry.demo}
                  onChange={handleChange}
                >
                  <MenuItem value="Conducted">Conducted</MenuItem>
                  <MenuItem value="Not Conducted">Not Conducted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Interested</InputLabel>
                <Select
                  name="interested"
                  value={enquiry.interested}
                  onChange={handleChange}
                >
                  <MenuItem value="Interested">Interested</MenuItem>
                  <MenuItem value="Not Interested">Not Interested</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Interest Details"
                  name="interestDetails"
                  value={enquiry.interestDetails}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Expected Join Date"
                  name="expectedJoinDate"
                  type="date"
                  value={enquiry.expectedJoinDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={enquiry.remarks}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
