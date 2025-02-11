import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Grid, Modal, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';



export default function College() {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const usenav = useNavigate();
  const [trainer, setTrainer] = useState([]);
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  const [editId, setEditId] = useState(null); // New state to store the ID of the record being edited
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    contact: '',
    domain: '',
    trainer: '',
    branch: '',
    company: '',
    totalFee: '',
    paid: '',
    balance: '',
    joinDate: '',
    dueDate: '',
  });

  console.log(location);
  

  const [students, setStudents] = useState([]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    student.contact.toLowerCase().includes(search.toLowerCase()) ||
    student.domain.toLowerCase().includes(search.toLowerCase()) ||
    student.trainer.toLowerCase().includes(search.toLowerCase()) ||
    student.branch.toLowerCase().includes(search.toLowerCase()) ||
    student.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let balance = formValues.paid;

    if (name === 'totalFee' || name === 'paid') {
      const totalFee = name === 'totalfee' ? value : formValues.totalFee;
      const paid = name === 'paid' ? value : formValues.paid

      balance = totalFee - paid;
    }

    if (name === "domain") {
      axios.get(`${process.env.REACT_APP_ENQUIRY}/gettrainername/${value}`).then((res) => {
        if (res.status === 200) {
          setTrainer(res.data)
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
          icon: "question",
        });
      })
    }


    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
      balance: balance
    });
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditId(item.id);
    setFormValues({
      name: item.name,
      email: item.email,
      contact: item.contact,  // Ensure this is consistent with the API response
      domain: item.domain,
      trainer: item.trainer,
      branch: item.branch,
      company: item.company,
      totalFee: item.totalfee,  // Ensure this matches the backend response
      paid: item.paid,
      balance: item.balance,
      joinDate: item.joindate,  // Match with backend response field
      dueDate: item.duedate,    // Match with backend response field

    });
    handleOpenModal();
  };

  const handleBranchChange = (e) => {
    setFormValues({
      ...formValues,
      branch: e.target.value,
    });
  };

  const handleCompanyChange = (e) => {
    setFormValues({
      ...formValues,
      company: e.target.value,
    });
  };

  // const handleDomainChange = (e) => {
  //   setFormValues({
  //     ...formValues,
  //     domain: e.target.value,
  //   });
  // };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    const owner = localStorage.getItem('name');
    const details = {
      name: formValues.name,
      email: formValues.email,
      contact: formValues.contact,
      domain: formValues.domain,
      trainer: formValues.trainer,
      branch: formValues.branch,
      company: formValues.company,
      totalFee: formValues.totalFee,  // Ensure backend uses `totalFee`, not `total`
      paid: formValues.paid,
      balance: formValues.balance,
      joinDate: formValues.joinDate,
      dueDate: formValues.dueDate,
      createby: owner,
    };
  
    const url = editMode
      ? `${process.env.REACT_APP_ENQUIRY}/collegestudentupdate/${location.state}/${editId}`
      : `${process.env.REACT_APP_ENQUIRY}/createcollegestudent/${location.state}`;
  
    const axiosRequest = editMode
      ? axios.put(url, details)
      : axios.post(url, details);
  
    axiosRequest
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: editMode ? "FollowUP Updated Successfully" : "Student Added Successfully",
            showConfirmButton: false,
            timer: 1500
          });
          
          // Update the table with the updated data in state before refreshing the page
          setStudents((prev) => {
            if (editMode) {
              return prev.map(item => item.id === editId ? res.data : item);
            } else {
              return [...prev, res.data];
            }
          });
  
          // Optional: If you want to see the update immediately without reloading the page
          // You could remove this line to prevent the reload and see updates dynamically
          setTimeout(() => {
            window.location.reload();
          }, 1000);
  
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
  
    handleCloseModal();
  };
  

  const handledelete = (id, college) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove the student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_ENQUIRY}/deleteCollegeStudent/${college}/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "The student has been deleted.",
                icon: "success",
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
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
              icon: "question",
            });
          });
      }
    });
  };


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getcollegestudents/${location.state}`).then((res) => {
      if (res.status === 200) {
        setStudents(res.data)
      }
      else {
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
        icon: "question",
      });
    })
  },[location])

  // const paymenthandler = (id) => {
  //   usenav('/internpaymentpage', { state: {id:id,college:location.state}})
  // }

  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>Add Student</Button>
        </Grid>
        <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
          <h1>College: {location.state}</h1>
        </Grid>
        <Grid item xs={12} md={4} style={{ textAlign: 'right' }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No.</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Trainer</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Total Fee</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {filteredStudents.map((item, index) => (
              <TableRow key={item.id} >
                <TableCell >{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.contact}</TableCell>
                <TableCell>{item.domain === 'gd' ? "Graphic design" : item.domain === 'dg' ? "Digital marketing" : item.domain}
                </TableCell>

                <TableCell>{item.trainer}</TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell>{item.company}</TableCell>
                <TableCell>{item.totalfee}</TableCell>
                <TableCell>{item.paid}</TableCell>
                <TableCell>{item.balance}</TableCell>
                <TableCell>{item.joindate}</TableCell>
                <TableCell>{item.duedate}</TableCell>
                <TableCell>{item.createby}</TableCell>
                <TableCell style={{display:'flex',gap:'5px'}}>
                {/* <Button variant="contained"  size="small" color="success" onClick={() => paymenthandler(item.id)}>
                    Payments
                  </Button> */}
                  <Button variant="contained"  size="small" onClick={() => handleEdit(item)} color='primary' >Edit</Button>
                  <Button variant="contained"  size="small"
                    onClick={() => handledelete(item.id, location.state)}
                    color="secondary"
            
                  >
                     Delete
                  </Button>



                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Student Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-student-modal"
        aria-describedby="add-student-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto', // Enable vertical scrolling
            overflowX: 'hidden', // Prevent horizontal scrolling
          }}
        >
          <h2 id="add-student-modal">Add Student</h2>
          <form onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Contact Number"
                  name="contact"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.contact}
                  onChange={handleChange}
                />

                <TextField
                  label="Domain"
                  name="domain"
                  value={formValues.domain}
                  onChange={handleChange}
                  variant="outlined"
                  size="large"
                  margin="normal"
                  fullWidth
                  select
                >
                  <MenuItem value="mern">MERN</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="dm">Digital Marketing</MenuItem>
                  <MenuItem value="gd">Graphic Designing</MenuItem>
                  <MenuItem value="devops">Devops</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="ds">Data Science</MenuItem>
                  <MenuItem value="tdl">TDL</MenuItem>
                  <MenuItem value="tally">Tally</MenuItem>
                  <MenuItem value="ml_ai">ML/AI</MenuItem>
                </TextField>
                <TextField
                  label="Trainer"
                  name="trainer"
                  value={formValues.trainer}
                  onChange={handleChange}
                  variant="outlined"
                  size="large"
                  margin="normal"
                  fullWidth
                  select
                >
                  {trainer.length > 0 ? (
                    trainer.map((item) => (
                      <MenuItem key={item.name} value={item.name}>
                        {item.name === "" ? 'No Trainer Available For this Course' : item.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Trainers Available</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Branch</InputLabel>
                  <Select
                    label="Branch"
                    name="branch"
                    value={formValues.branch}
                    onChange={handleBranchChange}
                  >
                    <MenuItem value="Ramatakies">Ramatakies</MenuItem>
                    <MenuItem value="Madhurwada">Madhurwada</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Branch</InputLabel>
                  <Select
                    label="Company"
                    name="company"
                    value={formValues.company}
                    onChange={handleCompanyChange}
                  >
                    <MenuItem value="HippoClouds">HippoCloud</MenuItem>
                    <MenuItem value="Nlite">Nlite</MenuItem>
                    <MenuItem value="Rise">Rise</MenuItem>
                    <MenuItem value="Schemax">Schemax</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Total Fee"
                  name="totalFee"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.totalFee}
                  onChange={handleChange}
                />
                <TextField
                  label="Paid"
                  name="paid"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.paid}
                  onChange={handleChange}
                />
                <TextField
                  label="Balance"
                  name="balance"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.balance}
                  onChange={handleChange}
                />
                <TextField
                  label="Join Date"
                  name="joinDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.joinDate}
                  onChange={handleChange}
                />
                <TextField
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formValues.dueDate}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="contained" color="primary" type="submit">Submit</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
