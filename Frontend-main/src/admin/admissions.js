import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Box, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Admissions() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Fetch courses from courses table
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getcourse`)
      .then((res) => {
        if (res.status === 200) {
          setCourses(res.data);  // Store courses data
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch courses. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close'
        });
      });

    // Fetch row counts for each domain
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getrowscount`)
      .then((res) => {
        if (res.status === 200) {
          const newCounts = {};
          res.data.forEach(item => {
            newCounts[item.domain] = item.rowCount;
          });
          setCounts(newCounts);
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch row counts. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close'
        });
      });
  }, []);

  const dashboardItems = courses.map(course => {
    // Check if course.courses exists before using toUpperCase
    const courseName = course.courses ? course.courses.toLowerCase() : 'unknown';

    return {
      title: course.courses || 'Unknown Course',
      icon: <img src='teach.png' height='60px' width='80px' alt='imag' />,  // Set default image if no image URL is provided
      description: course.description || 'No description available',
      studentCount: counts[courseName] || 0,  // Fetch the count dynamically
      progress: counts[courseName] || 0,
      link: '/academystudents',
      state: { domain: courseName}  // Use domain in uppercase
    };
  });


  return (
    <div style={{ marginTop: '60px', padding: '20px' }}>
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardActionArea
                onClick={() => navigate(item.link, { state: item.state })}
              >
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    component="div"
                    style={{ position: 'absolute', top: 10, right: 10, color: '#000' }}
                  >
                    {item.studentCount}
                  </Typography>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Box mb={-1}>{item.icon}</Box>
                    <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>

                    <Typography variant="body2" component="p" style={{ marginBottom: '5px' }}>
                      Students: {item.studentCount}
                    </Typography>
                    <Box width="100%" mt={1}>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        style={{ height: 8, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="caption" component="div" style={{ marginTop: '5px', color: '#757575' }}>
                      Progress: {item.progress}%
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
