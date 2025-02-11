import { Grid, Card, CardContent, Typography, CardActionArea, Box, Container } from '@mui/material';
import React from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function Adminhome() {
  const cards = [
    {
      title: 'Admissions',
      icon: <SchoolIcon fontSize="large" />,
      link: 'admissions',
      description: 'Manage student admissions and application processes.',
      color: '#1976d2',
    },
    {
      title: 'Internships',
      icon: <AssignmentIcon fontSize="large" />,
      link: '/internsdashboard',
      description: 'Manage and monitor student internships and profiles.',
      color: '#d32f2f',
    },
    {
      title: 'Enquiries',
      icon: <PeopleIcon fontSize="large" />,
      link: 'enquires',
      description: 'Track and respond to prospective student enquiries.',
      color: '#4caf50',
    },
    {
      title: 'Daily Follow-ups',
      icon: <EventNoteIcon fontSize="large" />,
      link: 'followups',
      description: 'Monitor daily follow-ups for admissions and enquiries.',
      color: '#9c27b0',
    },
    {
      title: 'Trainers',
      icon: <SupervisorAccountIcon fontSize="large" />,
      link: 'trainer',
      description: 'Manage trainer profiles and training schedules.',
      color: '#3f51b5',
    }
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)', backgroundColor: '#f5f5f5' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <DashboardIcon fontSize="large" style={{ marginRight: '10px' }} />
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ backgroundColor: card.color, color: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', height: '100%' }}>
              <CardActionArea href={card.link} style={{ height: '100%' }}>
                <CardContent style={{ height: '100%' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box mr={2}>{card.icon}</Box>
                    <Typography variant="h5" component="div">
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" component="p" mb={2}>
                    {card.description}
                  </Typography>
                  <Box mt={2}>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
