import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EmailIcon from '@mui/icons-material/Email';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  Grid,
  Typography,
  MenuItem,
  Stack
} from '@mui/material';
import axios from 'axios';

export default function Paymentpage() {
  const location = useLocation();
  const studentId = useMemo(() => location.state || {}, [location.state]);

  const [open, setOpen] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    stuid:'',
    name: '',
    email: '',
    number: '',
    domain: '',
    totalfee: '',
    discount: '',
    finalfee:'',
    paid: '',
    balance: '',
    cpa: '',
    remainingBalance: '',
    recentPaidDate: '',
    paymentMethod: '',
    cashPersonName: '',
    nextDueDate: '',
  });

  const [studentDetails, setStudentDetails] = useState({
    id: "",
    student_id: '',
    name: "",
    email: "",
    number: "",
    domain: "",
    totalfee: "",
    discount: "", 
    finalfee:"",
    paid: "",
    balance: "",
    joindata:"",
    branch:""
  });

  const usenav=useNavigate();

  const [paymenthistory,setPaymenthistory]=useState([]);

  useEffect(() => {


    axios.get(`${process.env.REACT_APP_ENQUIRY}/getpaymentshistory/${studentId}`).then((res)=>{
      if(res.status===200){
        setPaymenthistory(res.data)
      }
      else{
        console.log("Error")
      }
    }).catch((err)=>{
      console.log(err)
    })


    if (open) {
      axios.get(`${process.env.REACT_APP_ENQUIRY}/getstudentforpayment/${studentId}`)
        .then((res) => {
          if (res.status === 200) {
            const studentData = res.data[0];
            setStudentDetails(studentData);
            setPaymentDetails(prevDetails => ({
              ...prevDetails,
              ...studentData,
              balance: studentData.balance,
            }));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Failed to fetch student data.',
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
        });
    }
  }, [open, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => {
      const updatedDetails = { ...prevDetails, [name]: value };

      if (name === 'cpa') {
        const currentPayment = parseFloat(value) || 0;
        const balance = parseFloat(prevDetails.balance) || 0;
        updatedDetails.remainingBalance = balance - currentPayment;
      }

      return updatedDetails;
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setPaymentDetails({
      name: '',
      email: '',
      number: '',
      domain: '',
      totalfee: '',
      discount: '',
      finalfee:'',
      paid: '',
      balance: '',
      cpa: '',
      remainingBalance: '',
      recentPaidDate: '',
      paymentMethod: '',
      cashPersonName: '',
      nextDueDate: ''
    });
    setOpen(false);
  };

  const handleSendEmail = (student) => {
    axios.post(`${process.env.REACT_APP_ENQUIRY}/student-send-email`, student)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            height:"200px",
            width:"400px",
            icon: "success",
            title: `Email sent to ${student.name} successfully!`,
            showConfirmButton: false,
            timer: 1000
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const owner = localStorage.getItem('name');

    const details = {
      studentId: studentDetails.id,
      ...paymentDetails,
      currentpayment: paymentDetails.cpa,
      remaining: paymentDetails.remainingBalance,
      paiddate: formattedDate,
      owner: owner,
      newduedate: paymentDetails.nextDueDate
    };

    axios.post(`${process.env.REACT_APP_ENQUIRY}/createpayment`, details)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Payment submitted successfully!',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to submit payment.',
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
      });

    const updatedFeeDetails = {
      paid: parseInt(studentDetails.paid) + parseInt(paymentDetails.cpa),
      balance: paymentDetails.remainingBalance,
      duedate: paymentDetails.nextDueDate
    };

    axios.post(`${process.env.REACT_APP_ENQUIRY}/updatefee/${studentId}`, updatedFeeDetails)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: res.data,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to update fee.',
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
      });
  };

  const print=(id)=>{
    usenav('/receipt', { state: id });
  }

  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      <h1>Payments History</h1>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
        Make a Payment
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Payment Form
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={studentDetails.name}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={studentDetails.email}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Number"
                  name="contactNumber"
                  value={studentDetails.number}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Domain"
                  name="domain"
                  value={studentDetails.domain}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Fee"
                  name="totalFee"
                  value={studentDetails.totalfee}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Discount"
                  name="discount"
                  value={studentDetails.discount}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Final Fee"
                  name="finalfee"
                  value={studentDetails.finalfee}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Paid"
                  name="paid"
                  value={studentDetails.paid}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Balance"
                  name="balance"
                  value={studentDetails.balance}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Payment"
                  name="cpa"
                  value={paymentDetails.cpa}
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Remaining Balance"
                  name="remainingBalance"
                  value={paymentDetails.remainingBalance}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payment Method"
                  name="paymentMethod"
                  value={paymentDetails.paymentMethod}
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </TextField>
              </Grid>
              {paymentDetails.paymentMethod === "cash" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cash Person Name"
                    name="cashPersonName"
                    value={paymentDetails.cashPersonName}
                    variant="outlined"
                    size="small"
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              )}
            
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Next Due Date"
                  name="nextDueDate"
                  value={paymentDetails.nextDueDate}
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              fullWidth
            >
              Submit Payment
            </Button>
          </Box>
        </Box>
      </Modal>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Toatl Fee</TableCell>
              <TableCell>Discount%</TableCell>
              <TableCell>finalfee Fee</TableCell>
              <TableCell>Total Paid fee</TableCell>
              <TableCell>New Due Amount</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Paid On</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Cash Person Name</TableCell>
              <TableCell>Next Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymenthistory.map((item)=><>
            <TableRow>
              <TableCell>HCP {item.id}</TableCell>
              <TableCell>{item.student_id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.domain}</TableCell>
              <TableCell>{item.totalfee}</TableCell>
              <TableCell>{item.discount}%</TableCell>
              <TableCell>{item.finalfee}</TableCell>
              <TableCell>{item.paid}</TableCell>
              <TableCell>{item.current_payment}</TableCell>
              <TableCell>{item.reamaining_balance}</TableCell>
              <TableCell>{item.paid_on}</TableCell>
              <TableCell>{item.payment_method}</TableCell>
              <TableCell>{item.cashier === undefined || item.cashier === "undefined" ? '---' : item.cashier}</TableCell>
              <TableCell>{item.next_duedate}</TableCell>
              <TableCell>
              <Stack direction="row" spacing={1}>
    <Button 
      variant="contained"
      startIcon={<ReceiptIcon />}
      onClick={()=>print(item.id)}
    >
      Receipt
    </Button>
    <Button 
      variant="contained" 
      color="secondary"
      startIcon={<EmailIcon />}
      onClick={()=>handleSendEmail(item)}
    >
      Email
    </Button>
  </Stack>
</TableCell>
            </TableRow>
            </>)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
