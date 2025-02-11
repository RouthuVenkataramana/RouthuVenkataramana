import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Courses() {
  const [course, setCourse] = useState({ courses: '' });
  const [getCourses, setGetCourses] = useState([]);
  const [open, setOpen] = useState(false); // To handle modal open/close
  const [editMode, setEditMode] = useState(false); // To check if it's edit mode
  const [currentCourseId, setCurrentCourseId] = useState(null); // To track which course is being edited

  const handleSubmit = (e) => {
    e.preventDefault();

    if (course.courses) {
      if (editMode) {
        // Edit existing course
        axios.put(`${process.env.REACT_APP_ENQUIRY}/course/${currentCourseId}`, course)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Course Updated Successfully",
                showConfirmButton: false,
                timer: 1500
              });
              fetchCourses();
              handleClose(); // Close modal after success
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
        // Add new course
        axios.post(`${process.env.REACT_APP_ENQUIRY}/course`, course)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Course Added Successfully",
                showConfirmButton: false,
                timer: 1500
              });
              fetchCourses();
              handleClose(); // Close modal after success
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
      setCourse({ courses: '' }); // Clear input
    }
  };

  const fetchCourses = () => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getcourse`)
      .then((res) => {
        if (res.status === 200) {
          setGetCourses(res.data);
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

  const capitalize = (str) => {
    return str.toUpperCase();
  };

  // Open the add modal
  const handleOpen = () => {
    setCourse({ courses: '' });
    setEditMode(false); // Ensure we are in add mode
    setOpen(true);
  };

  // Open the edit modal with course data
  const handleEdit = (courseData) => {
    setCourse({ courses: courseData.courses });
    setCurrentCourseId(courseData.id); // Set the current course ID for editing
    setEditMode(true); // Switch to edit mode
    setOpen(true);
  };

  const handleClose = () => setOpen(false); // Close modal handler

  useEffect(() => {
    fetchCourses();
  }, []);

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
        axios.delete(`${process.env.REACT_APP_ENQUIRY}/deletecourse/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
              fetchCourses(); // Refresh trainer list after deletion
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
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Course
      </Button>

      {/* Modal for adding or editing course */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? 'Edit Course' : 'Add Course'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Course Name"
              variant="outlined"
              value={course.courses}
              onChange={(e) => setCourse({ courses: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Update Course' : 'Add Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Course tiles */}
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {getCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">Course {index + 1}</Typography>
                <Typography variant="body1" style={{fontWeight:'bold'}}>
                  {capitalize(course.courses)}
                </Typography>
                <div style={{ marginTop: '10px' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    style={{ marginRight: '10px' }} 
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={()=>handleDelete(course.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
