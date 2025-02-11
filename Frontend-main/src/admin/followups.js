import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box, TextField, Grid, FormControl, MenuItem, Select, InputLabel, IconButton } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

export default function Followups() {
  const [open, setOpen] = useState(false);
  const [visibleFollowups, setVisibleFollowups] = useState(1);
  const [getfollowup, setGetfollowup] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [followedbyOptions, setFollowedbyOptions] = useState([]);
  const [selectedFollowedby, setSelectedFollowedby] = useState('');
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  const [editId, setEditId] = useState(null); // New state to store the ID of the record being edited
  const [followup, setFollowup] = useState({
    name: '',
    mobile: '',
    course: '',
    fee: '',
    location: '',
    followedby: '',
    followup1: { type: 'text', value: '' },
    followup2: { type: 'text', value: '' },
    followup3: { type: 'text', value: '' },
    followup4: { type: 'text', value: '' },
    followup5: { type: 'text', value: '' },
    remarks: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false); // Reset edit mode when closing the modal
    setFollowup({
      name: '',
      mobile: '',
      course: '',
      fee: '',
      location: '',
      followedby: '',
      followup1: { type: 'text', value: '' },
      followup2: { type: 'text', value: '' },
      followup3: { type: 'text', value: '' },
      followup4: { type: 'text', value: '' },
      followup5: { type: 'text', value: '' },
      remarks: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFollowup((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getfollowup`).then((res) => {
      let data = res.data;
  
      // Apply filter if a filter value is selected
      if (selectedFollowedby) {
        data = data.filter(item => item.followedby === selectedFollowedby);
      }
  
      setGetfollowup(data);
  
      // Count occurrences of followedby values for the dropdown options
      const followedbyCount = data.reduce((acc, curr) => {
        acc[curr.followedby] = (acc[curr.followedby] || 0) + 1;
        return acc;
      }, {});
  
      const followedbyOptions = Object.keys(followedbyCount).map(key => ({
        value: key,
        count: followedbyCount[key]
      }));
  
      setFollowedbyOptions(followedbyOptions);
    });
  }, [selectedFollowedby]);
  

  const handleFollowupChange = (index, key, value) => {
    setFollowup((prev) => ({
      ...prev,
      [`followup${index}`]: {
        ...prev[`followup${index}`],
        [key]: value
      }
    }));
  };

  const handleFollowupClick = (index) => {
    setVisibleFollowups(index + 1);
  };

  const handleSubmit = () => {
    const details = {
      name: followup.name,
      mobile: followup.mobile,
      course: followup.course,
      fee: followup.fee,
      location: followup.location,
      followedby: followup.followedby,
      followup1: followup.followup1.value,
      followup2: followup.followup2.value,
      followup3: followup.followup3.value,
      followup4: followup.followup4.value,
      followup5: followup.followup5.value,
      remarks: followup.remarks
    };

    if (editMode) {
      axios.put(`${process.env.REACT_APP_ENQUIRY}/followup/${editId}`, details)
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "FollowUP Updated Successfully",
              showConfirmButton: false,
              timer: 1500
            });
            // Update the table with the updated data
            setGetfollowup((prev) => prev.map(item => item.id === editId ? res.data : item));
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
      axios.post(`${process.env.REACT_APP_ENQUIRY}/followup`, details)
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
            setGetfollowup((prev) => [...prev, res.data]);
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
    handleClose();
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditId(item.id);
    setFollowup({
      name: item.name,
      mobile: item.mobile,
      course: item.course,
      fee: item.fee,
      location: item.location,
      followedby: item.followedby,
      followup1: { type: 'text', value: item.followup1 },
      followup2: { type: 'text', value: item.followup2 },
      followup3: { type: 'text', value: item.followup3 },
      followup4: { type: 'text', value: item.followup4 },
      followup5: { type: 'text', value: item.followup5 },
      remarks: item.remarks
    });
    handleOpen();
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const inputStyle = {
    height: '45px',
    fontSize: '14px'
  };

  const handledelete = (id) => {

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

        axios.delete(`${process.env.REACT_APP_ENQUIRY}/deletefollowup/${id}`).then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000)
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
            text: "Check Your Internet Connection?",
            icon: "question"
          });
        })
      }
    });
  }

  const datarefresh=()=>{
    window.location.reload();
  }
  const renderFollowupField = (index) => (
    <Grid item xs={12} sm={6} key={index}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Follow Up-{index}</InputLabel>
        <Select
          name={`followup${index}`}
          value={followup[`followup${index}`].type}
          onChange={(e) => handleFollowupChange(index, 'type', e.target.value)}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
        {followup[`followup${index}`].type === 'text' ? (
          <TextField
            name={`followup${index}`}
            value={followup[`followup${index}`].value}
            onChange={(e) => handleFollowupChange(index, 'value', e.target.value)}
            variant="outlined"
            InputProps={{ style: inputStyle }}
            onClick={() => handleFollowupClick(index)}
            style={{ marginTop: '8px' }}
          />
        ) : (
          <TextField
            name={`followup${index}`}
            type="date"
            value={followup[`followup${index}`].value}
            onChange={(e) => handleFollowupChange(index, 'value', e.target.value)}
            variant="outlined"
            InputProps={{ style: inputStyle }}
            InputLabelProps={{ shrink: true }}
            onClick={() => handleFollowupClick(index)}
            style={{ marginTop: '8px' }}
          />
        )}
      </FormControl>
    </Grid>
  );

  // Filter and Search Logic
  // const filteredFollowup = getfollowup.filter((item) =>
  //   Object.values(item).some(value =>
  //     typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // );

  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      
      <Grid container spacing={2} justifyContent="space-between" style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6}>
  <FormControl fullWidth variant="outlined">
    <InputLabel id="followedby-filter-label">Followed By Filter</InputLabel>
    <Select
      labelId="followedby-filter-label"
      value={selectedFollowedby}
      onChange={(e) => setSelectedFollowedby(e.target.value)}
      label="Filter by Followed By"
      style={{ marginBottom: '20px', width: '350px' }}
    >
      <MenuItem value=""><em>All</em></MenuItem>
      {followedbyOptions.map(option => (
        <MenuItem key={option.value} value={option.value}>
          Followups By {option.value} ({option.count}No's)
        </MenuItem>
      ))}
      <Button onClick={datarefresh} fullWidth>Refresh</Button>
    </Select>
    </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
          <TextField
            
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </Grid>
</Grid>
            <h1 style={{textDecoration:'underline',fontFamily:'monospace'}}>Follow Up's</h1>

      <Button variant="contained" color="primary" onClick={handleOpen}>Add Follow Up</Button>

      <TableContainer component={Paper} style={{ marginTop: '20px'}}>
        <Table style={{fontFamily:'monospace'}}>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Followed By</TableCell>
              <TableCell>Follow Up 1</TableCell>
              <TableCell>Follow Up 2</TableCell>
              <TableCell>Follow Up 3</TableCell>
              <TableCell>Follow Up 4</TableCell>
              <TableCell>Follow Up 5</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {getfollowup
    .filter(item => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((item, index) => (
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.mobile}</TableCell>
        <TableCell>{item.course}</TableCell>
        <TableCell>{item.fee}</TableCell>
        <TableCell>{item.location}</TableCell>
        <TableCell>{item.followedby}</TableCell>
        <TableCell>{item.followup1}</TableCell>
        <TableCell>{item.followup2}</TableCell>
        <TableCell>{item.followup3}</TableCell>
        <TableCell>{item.followup4}</TableCell>
        <TableCell>{item.followup5}</TableCell>
        <TableCell style={{ width: '100px' }}>{item.remarks}</TableCell>
        <TableCell >
          <IconButton onClick={() => handleEdit(item)} color='primary' style={{ fontSize: '16px' }}><EditIcon />Edit</IconButton>
          <IconButton onClick={() => handledelete(item.id)} color='secondary' style={{ fontSize: '16px' }}><DeleteIcon />Delete</IconButton>
        </TableCell>
      </TableRow>
    ))}
</TableBody>

        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>{editMode ? 'Edit Follow Up' : 'Add Follow Up'}</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
                value={followup.name}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputProps={{ style: inputStyle }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="mobile"
                label="Mobile"
                value={followup.mobile}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputProps={{ style: inputStyle }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="course"
                label="Course"
                value={followup.course}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputProps={{ style: inputStyle }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="fee"
                label="Fee"
                value={followup.fee}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputProps={{ style: inputStyle }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Location"
                value={followup.location}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputProps={{ style: inputStyle }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="followedby"
                label="Followed By"
                value={followup.followedby}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputProps={{ style: inputStyle }}
              />
            </Grid>
            {Array.from({ length: visibleFollowups }, (_, index) => renderFollowupField(index + 1))}
            <Grid item xs={12}>
              <TextField
                name="remarks"
                label="Remarks"
                value={followup.remarks}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
            {editMode ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
