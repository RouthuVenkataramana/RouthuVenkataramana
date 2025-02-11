import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, IconButton } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function Internsdashboard() {
  const [colleges, setColleges] = useState([]);
  const [open, setOpen] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: '', location: '' });
  const usenav=useNavigate();

  // Function to generate random light colors
  const getRandomLightColor = () => {
    const letters = 'BCDEF'; // Choose lighter colors
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 5)];
    }
    return color;
  };

  useEffect(() => {
    // Fetch colleges data when the component mounts
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getcolleges`)
      .then((res) => {
        if (res.status === 200) {
          // Adding random light colors to each college item
          const collegesWithColors = res.data.tables.map(college => ({
            ...college,
            color: getRandomLightColor() // Assign random light color
          }));
          setColleges(collegesWithColors);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch colleges.',
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close'
        });
        console.log(err);
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollege({ ...newCollege, [name]: value });
  };

  const handleAddCollege = () => {
    handleClose();
    axios.post(`${process.env.REACT_APP_ENQUIRY}/createcollege`, newCollege)
      .then((res) => {
        if (res.status === 200) {
          // Add the new college to the list with random light color
          setColleges([...colleges, { ...newCollege, color: getRandomLightColor() }]);
          Swal.fire('Success', 'College added successfully!', 'success');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to add college.',
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close'
        });
        console.log(err);
      });
  };
  

  const handleDeleteCollege = (name) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the college ${name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.REACT_APP_ENQUIRY}/deletecollege`, { data: { name } })
          .then((res) => {
            if (res.status === 200) {
              setColleges(colleges.filter(college => college.name !== name));
              Swal.fire('Deleted!', `${name} has been deleted.`, 'success');
              setTimeout(()=>{
                window.location.reload();
              },1000)
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to delete college.',
              });
            }
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong. Please try again later.',
              icon: 'error',
              confirmButtonText: 'Close'
            });
            console.error(err);
          });
      }
    });
};

const listhandler=(college)=>{
    usenav('/college', {state:college})
}


  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Internship Partners</h1>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        onClick={handleClickOpen}
      >
        Add College
      </Button>
      <Grid container spacing={4}>
        {colleges.map((college, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ backgroundColor: college.color, color: '#333', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {college.table}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Students Count: {college.count}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteCollege(college.table)}
                  style={{ position: 'absolute', top: 10, right: 10, color: '#333' }}
                >
                  
                  <DeleteIcon />
                </IconButton>
                <Button onClick={()=>{listhandler(college.table)}}>Click here for list</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Adding College */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add College</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="College Name"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
            />
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCollege} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
