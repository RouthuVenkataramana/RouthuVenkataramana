import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box
} from '@mui/material';
import axios from 'axios';

export default function Academystudents() {
  const location = useLocation();
  const { domain } = location.state || {};
  const [trainer, setTrainer] = useState([]);
  const usenav = useNavigate();
  const [open, setOpen] = useState(false);
  const owner = localStorage.getItem('name');
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  const [editId, setEditId] = useState(null); // New state to store the ID of the record being edited
  const [domains, setDomains] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    number: '',
    leadType: '',
    leadBy: '',
    domain: '',
    trainer: '',
    joinDate: '',
    totalFee: '',
    discount: '',
    finalfee: '',
    paid: '',
    balance: '',
    dueDate: '',
    classTiming: '',
    branch: '',
    addedby: owner
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getacademystudents/${domain}`).then((res) => {
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
      })
    });
  })

  const handleClickOpen = () => {
    setOpen(true);
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
    fetchCourses(); // Fetch courses when the component mounts
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setNewStudent({
      name: '',
      email: '',
      number: '',
      leadType: '',
      leadBy: '',
      domain: '',
      trainer: '',
      joinDate: '',
      totalFee: '',
      discount: '',
      finalfee: '',
      paid: '',
      balance: '',
      dueDate: '',
      classTiming: '',
      branch: '',
      addedby: owner
    })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Calculate balance and finalFee automatically based on discount and total fee
    let balance = newStudent.paid;
    let finalFee = newStudent.finalfee;
  
    if (name === 'discount' || name === 'totalFee' || name === 'paid') {
      const discount = name === 'discount' ? value : newStudent.discount;
      const totalFee = name === 'totalFee' ? value : newStudent.totalFee;
      const paid = name === 'paid' ? value : newStudent.paid;
  
      // Calculate the discount amount
      const discountAmount = totalFee * (discount / 100);
  
      // Calculate the final fee after discount
      finalFee = totalFee - discountAmount;
  
      // Update the balance
      balance = finalFee - paid;
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
  
    setNewStudent({
      ...newStudent,
      [name]: value,
      finalfee: finalFee,
      balance: balance
    });
  };

  const handleSendEmail = (student) => {
    axios.post(`${process.env.REACT_APP_ENQUIRY}/send-email`, student)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Email sent to ${student.email} successfully!`,
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
  

  const handleAddStudent = () => {
    const details={
      name: newStudent.name,
      email:  newStudent.email,
      number:  newStudent.number,
      leadType:  newStudent.leadType,
      leadBy:  newStudent.leadBy,
      domain:  newStudent.domain,
      trainer:  newStudent.trainer,
      joinDate: newStudent.joinDate,
      totalFee:  newStudent.totalFee,
      discount:  newStudent.discount,
      finalfee:  newStudent.finalfee,
      paid:  newStudent.paid,
      balance: newStudent.balance,
      dueDate:  newStudent.dueDate,
      classTiming:  newStudent.classTiming,
      branch:  newStudent.branch,
      addedby:  newStudent.addedby
    }
  
    if(editMode){
      axios.put(`${process.env.REACT_APP_ENQUIRY}/updatestudent/${editId}`, details)
      .then((res)=>{
        if(res.status === 200){
          console.log(res.data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Student Updated Successfully",
            showConfirmButton: false,
            timer: 1500
          });
          
          
         // Update the table with the updated data
          setStudents((prev) => prev.map(item => item.id === editId ? res.data : item));
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
      axios.post(`${process.env.REACT_APP_ENQUIRY}/addstudent`, details).then((res) => {
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: res.data + " Student Added Successfully",
        })
        // Add the new data to the table
        setStudents((prev) => [...prev, res.data]);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data,
        })
      }
    }).catch((err) => {
      Swal.fire({
        title: "The Internet?",
        text: "Check your internet connection",
        icon: "question",
      })
    })}

    handleClose();
  };

  const paymenthandler = (id) => {
    usenav('/paymentpage', { state: id })
  }

  const handledelete=(id)=>{
    console.log(id);
    
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

            axios.delete(`${process.env.REACT_APP_ENQUIRY}/deletestudent/${id}`).then((res)=>{
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
    setNewStudent({
      name: item.name,
    email: item.email,
    number: item.number,
    leadType: item.lead_type,
    leadBy: item.lead_by,
    domain: item.domain,
    trainer: item.trainer,
    joinDate: item.joindate,
    totalFee: item.totalfee,
    discount: item.discount,
    finalfee: item.finalfee,
    paid: item.paid,
    balance: item.balance,
    dueDate: item.duedate,
    classTiming: item.timeing,
    branch: item.branch,
    addedby: item.addedby
    });
    handleClickOpen();
  };

  const capitalize = (str) => {
    return str.toUpperCase();
  };

  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="div">
          Academy Students ({domain})
        </Typography>
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name"
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Student
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Lead Type</TableCell>
              <TableCell>Lead By</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Trainer</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Total Fee</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Final Fee</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Class Timing</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>HC{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.number}</TableCell>
                <TableCell>{student.lead_type}</TableCell>
                <TableCell>{student.lead_by}</TableCell>
                <TableCell>{student.domain}</TableCell>
                <TableCell>{student.trainer}</TableCell>
                <TableCell>{student.branch}</TableCell>
                <TableCell>{student.joindate}</TableCell>
                <TableCell>{student.totalfee}</TableCell>
                <TableCell>{student.discount}%</TableCell>
                <TableCell>{student.finalfee}</TableCell>
                <TableCell>{student.paid}</TableCell>
                <TableCell>{student.balance}</TableCell>
                <TableCell>{student.duedate}</TableCell>
                <TableCell>{student.timeing}</TableCell>
                <TableCell style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="contained" color="success" size="small" onClick={() => paymenthandler(student.id)}>
                    Payments
                  </Button>

                  <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(student)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" size="small" onClick={()=>handledelete(student.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Student Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Name"
                name="name"
                value={newStudent.name}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={newStudent.email}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number"
                name="number"
                value={newStudent.number}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Lead Type"
                name="leadType"
                value={newStudent.leadType}
                onChange={(e) => {
                  handleChange(e);
                  // Reset leadBy when leadType changes
                  setNewStudent((prev) => ({
                    ...prev,
                    leadType: e.target.value,
                    leadBy: '' // Resetting leadBy value
                  }));
                }}
                variant="outlined"
                size="small"
                fullWidth
                select
              >
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="smc">Social media campaign</MenuItem>
                <MenuItem value="walkin">Walkin</MenuItem>
                <MenuItem value="fu">Follow-Ups</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={
                  newStudent.leadType === 'referral' ? 'Referral Source' : newStudent.leadType === 'smc' ? 'Campaign Lead Follow-up By' : newStudent.leadType === 'walkin' ? 'Walkin Assist By' : 'Lead Follow-Up By'
                }
                name="leadBy"
                value={newStudent.leadBy}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />

            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Domain"
                name="domain"
                value={newStudent.domain}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
                select
              >
                {domains.map((domain) => (
                      <MenuItem key={domain.id} value={domain.courses}>
                        {capitalize(domain.courses)}
                      </MenuItem>
                    ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Trainer"
                name="trainer"
                value={newStudent.trainer}
                onChange={handleChange}
                variant="outlined"
                size="small"
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
              <TextField
                label="Join Date"
                name="joinDate"
                type="date" // Set input type to date
                value={newStudent.joinDate}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true, // Ensures the label shrinks to fit when the input is of type date
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Next payment due Date"
                name="dueDate"
                type="date" // Set input type to date
                value={newStudent.dueDate}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true, // Ensures the label shrinks to fit when the input is of type date
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Class Timing"
                name="classTiming"
                value={newStudent.classTiming}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
                select // Add this to enable dropdown functionality
              >
                <MenuItem value="morning">Morning Session</MenuItem>
                <MenuItem value="afternoon">Afternoon Session</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Branch"
                name="branch"
                value={newStudent.branch}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
                select // Add this to enable dropdown functionality
              >
                <MenuItem value="ramatakies">Ramatakies</MenuItem>
                <MenuItem value="madhuruwada">Madhuruwada</MenuItem>
                <MenuItem value="online">Online</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Fee"
                name="totalFee"
                value={newStudent.totalFee}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount (%)"
                name="discount"
                value={newStudent.discount}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="finalfee"
                name="finalfee"
                value={newStudent.finalfee}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Paid"
                name="paid"
                value={newStudent.paid}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Balance"
                name="balance"
                value={newStudent.balance}
                onChange={handleChange}
                variant="outlined"
                size="small"
                fullWidth
                disabled
              />
            </Grid>



          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddStudent} color="primary">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

