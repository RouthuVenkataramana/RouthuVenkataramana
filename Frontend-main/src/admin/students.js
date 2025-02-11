import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
  Typography,
  Card,
  CardActionArea,
  
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Students() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null); // Track the selected domain
  const [domainNames, setDomainNames] = useState([]); // Domain names from API
  //const [selectedFormDomain, setSelectedFormDomain] = useState(''); // For add student form dropdown

  useEffect(() => {
    // Fetch students data
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getstudents`).then((res) => {
      setData(res.data);
    });

// Helper function to generate a random dark color
const getRandomDarkColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    // Limit range to darker shades by using 0-7 for the first two characters
    color += letters[Math.floor(Math.random() * 8)]; // Use 0 to 7 for darker colors
  }
  return color;
};

axios.get(`${process.env.REACT_APP_ENQUIRY}/getcourse`)
  .then((res) => {
    if (res.data && Array.isArray(res.data)) {
      const domains = res.data.map((course) => ({
        key: course.courses?.toLowerCase() || '', // Ensure course.name exists
        label: course.courses?.toUpperCase() || 'Unknown Domain',
        color: getRandomDarkColor(), // Use dark random color for tiles
      }));
      setDomainNames(domains);
    } else {
      console.error('Invalid response data:', res.data);
    }
  })
  .catch((error) => {
    console.error('Error fetching courses:', error);
  });


  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((item) =>
    Object.keys(item).some((key) =>
      item[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getDomainData = (domain) => {
    return filteredData.filter((item) => item.domain.toLowerCase() === domain.key.toLowerCase());
  };

  

  return (
    <div style={{ marginTop: '20px', padding: '20px' }}>
      {/* Domain Tiles */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {domainNames.map((domain) => {
          const domainData = getDomainData(domain);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={domain.key}>
              <Card
                style={{
                  backgroundColor: selectedDomain === domain.key ? domain.color : '#f0f0f0',
                  color: selectedDomain === domain.key ? '#fff' : '#000',
                }}
              >
                <CardActionArea onClick={() => setSelectedDomain(domain.key)}>
                  <div style={{ padding: '20px' }}>
                    <Typography variant="h6" align="center" style={{ fontWeight: 'bold' }}>
                      {domain.label}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {domainData.length} students
                    </Typography>
                  </div>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <br />

      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={3}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon />,
              style: { height: 36 },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Display the Table if a domain is selected */}
      {selectedDomain && (
        <div style={{ marginTop: '30px' }}>
          <Typography
            variant="h5"
            gutterBottom
            style={{
              color: domainNames.find((domain) => domain.key === selectedDomain)?.color,
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            {domainNames.find((domain) => domain.key === selectedDomain)?.label} -{' '}
            {getDomainData(domainNames.find((domain) => domain.key === selectedDomain)).length} Students
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>Lead Type</TableCell>
                  <TableCell>Lead By</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Trainer</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Total Fee</TableCell>
                  <TableCell>Discount %</TableCell>
                  <TableCell>Final Fee</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Timing</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Added By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getDomainData(domainNames.find((domain) => domain.key === selectedDomain)).length >
                0 ? (
                  getDomainData(domainNames.find((domain) => domain.key === selectedDomain)).map(
                    (item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>HC&nbsp;{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.number}</TableCell>
                        <TableCell>{item.lead_type}</TableCell>
                        <TableCell>{item.lead_by}</TableCell>
                        <TableCell>{item.domain}</TableCell>
                        <TableCell>{item.trainer}</TableCell>
                        <TableCell>{item.joindate}</TableCell>
                        <TableCell>{item.totalfee}</TableCell>
                        <TableCell>{item.discount}</TableCell>
                        <TableCell>{item.finalfee}</TableCell>
                        <TableCell>{item.paid}</TableCell>
                        <TableCell>{item.balance}</TableCell>
                        <TableCell>{item.duedate}</TableCell>
                        <TableCell>{item.timeing}</TableCell>
                        <TableCell>{item.branch}</TableCell>
                        <TableCell>{item.addedby}</TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} align="center">
                      No students found in this domain.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      
    </div>
  );
}
