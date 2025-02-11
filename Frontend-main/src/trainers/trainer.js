import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Grid, Modal, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Trainer() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    number: '',
    domain: '',
    branch: ''
  });
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [domains, setDomains] = useState([]);

  // Fetch trainers from backend
  const fetchTrainers = () => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/gettrainers`)
      .then((res) => {
        if (res.status === 200) {
          setTrainers(res.data);
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
  };

  // Fetch courses for domains
  const fetchCourses = () => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getcourse`)
      .then((res) => {
        if (res.status === 200) {
          setDomains(res.data); // Assuming your API returns an array of course objects
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
  };

  useEffect(() => {
    fetchTrainers();
    fetchCourses(); // Fetch courses when the component mounts
  }, []);

  const handleOpenModal = (trainer = null) => {
    setSelectedTrainer(trainer);
    setEditMode(!!trainer);
    setFormValues(trainer || {
      name: '',
      email: '',
      number: '',
      domain: '',
      branch: ''
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCloseModal();
    if (editMode) {
      axios.put(`${process.env.REACT_APP_ENQUIRY}/updatetrainer/${selectedTrainer.id}`, formValues)
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Trainer Updated Successfully",
              showConfirmButton: false,
              timer: 1500
            });
            fetchTrainers();
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
    } else {
      axios.post(`${process.env.REACT_APP_ENQUIRY}/createtrainer`, formValues)
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Trainer Added Successfully",
              showConfirmButton: false,
              timer: 1500
            });
            fetchTrainers();
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
  };

  const capitalize = (str) => {
    return str.toUpperCase();
  };

  const handleDelete = (id) => {
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
        axios.delete(`${process.env.REACT_APP_ENQUIRY}/deletetrainer/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
              fetchTrainers(); // Refresh trainer list after deletion
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
    });
  };

  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>Add Trainer</Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No.</TableCell>
              <TableCell>Trainer Name</TableCell>
              <TableCell>Contact Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.filter(trainer => {
              return (
                trainer.name.toLowerCase().includes(search.toLowerCase()) ||
                trainer.email.toLowerCase().includes(search.toLowerCase()) ||
                trainer.number.toLowerCase().includes(search.toLowerCase()) ||
                trainer.domain.toLowerCase().includes(search.toLowerCase()) ||
                trainer.branch.toLowerCase().includes(search.toLowerCase())
              );
            }).map((trainer, index) => (
              <TableRow key={trainer.id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{trainer.name}</TableCell>
                <TableCell>{trainer.email}</TableCell>
                <TableCell>{trainer.number}</TableCell>
                <TableCell>{trainer.domain}</TableCell>
                <TableCell>{trainer.branch}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => handleOpenModal(trainer)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(trainer.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Update Trainer Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-trainer-modal"
        aria-describedby="add-trainer-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <h2 id="add-trainer-modal">{editMode ? "Edit Trainer" : "Add Trainer"}</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {editMode ? <TextField label="Id" name="id" value={formValues.id} aria-readonly /> : ""}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  name="name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Number"
                  name="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Domain</InputLabel>
                  <Select
                    name="domain"
                    value={formValues.domain}
                    onChange={handleChange}
                    label="Domain"
                  >
                    {domains.map((domain) => (
                      <MenuItem key={domain.id} value={domain.courses}>
                        {capitalize(domain.courses)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Branch"
                  name="branch"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.branch}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Button type="submit" variant="contained" color="primary">
                  {editMode ? "Update" : "Add"}
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
