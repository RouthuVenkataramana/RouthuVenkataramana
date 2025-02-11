import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import moment from 'moment';
import { Modal } from '@material-ui/core'; // Importing Material-UI Modal for showing students data

export default function Ownerhome() {
  const [studentsData, setStudentsData] = useState([]);
  const [dataCollection, setDataCollection] = useState([]);
  const [dataJoin, setDataJoin] = useState([]);
  const [dataPendingFees, setDataPendingFees] = useState([]);
  const [dataRevenue, setDataRevenue] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMM')); // Default to current month
  const [filteredStudents, setFilteredStudents] = useState([]); // For storing students based on clicked bar
  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling the modal
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);

  const possibleDomains = ['MERN', 'Python', 'Java', 'Digital Marketing', 'Graphic Design', 'DevOps', 'Testing', 'Data Science', 'TDL', 'Tally'];

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_ENQUIRY}/getstudents`).then((res) => {
      setStudentsData(res.data);
      processChartData(res.data);
    });
  }, []); // Ensure this runs only once

  const processChartData = (data) => {
    processCollectionData(data, selectedMonth); // Process weekly collection based on selected month
    processJoinData(data);                     // Process student joins by month
    processPendingFeesData(data);              // Process pending fees by domain
    processRevenueData(data);                  // Process revenue by month
  };

  const processCollectionData = (data, monthFilter) => {
    const collection = {};
    const totalWeeks = 5; // Assuming 5 weeks in a month

    const filteredData = data.filter(student => moment(student.joindate).format('MMM') === monthFilter);

    for (let i = 1; i <= totalWeeks; i++) {
      collection[i] = 0;
    }

    filteredData.forEach((student) => {
      const paymentDate = moment(student.joindate);
      const weekOfMonth = paymentDate.week() - moment(paymentDate).startOf('month').week() + 1;
      if (collection[weekOfMonth] !== undefined) {
        collection[weekOfMonth] += Number(student.paid);
      }
    });

    setDataCollection(Object.keys(collection).map((week) => ({
      name: `Week ${week}`,
      amount: collection[week],
    })));
  };

  const processJoinData = (data) => {
    const joinData = {};
    const months = moment.monthsShort();

    data.forEach((student) => {
      const month = moment(student.joindate).format('MMM');
      if (!joinData[month]) joinData[month] = 0;
      joinData[month] += 1;
    });

    setDataJoin(months.map((month) => ({ month, students: joinData[month] || 0 })));
  };

  const processPendingFeesData = (data) => {
    const pendingFees = possibleDomains.reduce((acc, domain) => {
      acc[domain.toLowerCase()] = 0;
      return acc;
    }, {});

    data.forEach((student) => {
      const { domain, balance } = student;
      const normalizedDomain = domain ? domain.toLowerCase() : null;
      const numericBalance = Number(balance);

      if (normalizedDomain && possibleDomains.map(d => d.toLowerCase()).includes(normalizedDomain) && !isNaN(numericBalance)) {
        pendingFees[normalizedDomain] += numericBalance;
      }
    });

    setDataPendingFees(Object.keys(pendingFees).map((domain) => ({
      name: domain.charAt(0).toUpperCase() + domain.slice(1),
      fees: pendingFees[domain],
    })));
  };

  const processRevenueData = (data) => {
    const revenue = {};
    const months = moment.monthsShort();

    months.forEach((month) => {
      revenue[month] = 0;
    });

    data.forEach((student) => {
      const month = moment(student.joindate).format('MMM');
      revenue[month] += Number(student.paid);
    });

    setDataRevenue(months.map((month) => ({
      name: month,
      revenue: revenue[month] || 0,
    })));
  };

  const handleCloseFeesModal = () => {
    setIsFeesModalOpen(false); // Close pending fees modal
  };

  const handleMonthChange = (event) => {
    const selected = event.target.value;
    setSelectedMonth(selected);
    processCollectionData(studentsData, selected); // Reprocess collection data for the new month
  };

  // Handle clicking on a week in the bar chart
  const handleBarClick = (weekData) => {
    const filtered = studentsData.filter(student => {
      const paymentDate = moment(student.joindate);
      const weekOfMonth = paymentDate.week() - moment(paymentDate).startOf('month').week() + 1;
      return weekOfMonth === parseInt(weekData.name.split(' ')[1]); // Compare week number
    });
    setFilteredStudents(filtered);
    setIsModalOpen(true); // Open modal
  };

  const handlePieClick = (domainData) => {
    const filtered = studentsData.filter(student => {
      return student.domain.toLowerCase() === domainData.name.toLowerCase(); // Match the domain
    });
    setFilteredStudents(filtered);
    setIsModalOpen(true); // Open modal
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div style={{ marginTop: '70px', padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* Month Selection for Weekly Collection */}
      <div style={{ marginBottom: '20px', marginRight: '1000px', display: 'flex', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
          Select Month (For Weekly Collection):
        </label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            fontSize: '16px',
            backgroundColor: '#f9f9f9',
            color: '#333',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.target.style.border = '1px solid #888'}
          onMouseLeave={(e) => e.target.style.border = '1px solid #ccc'}
        >
          {moment.monthsShort().map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {/* Total Collection This Month (By Week) */}
        <div style={{ width: '48%', height: 300 }}>
          <h2>{selectedMonth}'s Total Collection (By Week)</h2>
          <ResponsiveContainer>
            <BarChart data={dataCollection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" onClick={handleBarClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Month-wise Student Joins */}
        <div style={{ width: '48%', height: 300 }}>
          <h2>Month-wise Student Joins</h2>
          <ResponsiveContainer>
            <LineChart data={dataJoin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Fees By Domain */}
        <div style={{ width: '48%', height: 300, marginTop: '60px' }}>
          <h2>Pending Fees</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={dataPendingFees}
                dataKey="fees"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                onClick={handlePieClick} 
              >
                {dataPendingFees.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#a85232', '#f54e5f', '#26cc16', '#800080'][index % 7]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue By Month */}
        <div style={{ width: '48%', height: 300, marginTop: '60px' }}>
          <h2>Revenue By Month</h2>
          <ResponsiveContainer>
            <LineChart data={dataRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal to show students data */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            width: '60%',
            maxWidth: '800px',
            maxHeight: '80vh', // Limit height to 80% of the viewport height
            margin: 'auto',
            marginTop: '5%', // Center the modal vertically
            borderRadius: '15px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden', // Ensure overflow handling
            position: 'relative',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            Students Fee Details
          </h2>

          <div
            style={{
              overflowY: 'auto', // Enable vertical scrolling
              maxHeight: '50vh', // Limit the height of the scrollable content
              marginBottom: '20px', // Leave space for the close button
            }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow >
                  <TableCell style={{fontWeight:'bold'}}>S.no</TableCell>
                    <TableCell style={{fontWeight:'bold'}}>ID</TableCell>
                    <TableCell style={{fontWeight:'bold'}}>Student Name</TableCell>
                    <TableCell style={{fontWeight:'bold'}}>Course</TableCell>
                    <TableCell style={{fontWeight:'bold'}}>Paid</TableCell>
                    <TableCell style={{fontWeight:'bold'}}>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student,index) => (
                      <TableRow key={student.id}>
                        <TableCell >{index+1  }</TableCell>
                        <TableCell>HC{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.domain}</TableCell>
                        <TableCell style={{color:'green',fontWeight:'bold'}}>{student.paid}</TableCell>
                        <TableCell style={{color:'red',fontWeight:'bold'}}>{student.balance}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>No students found for this week.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <button
            onClick={handleCloseModal}
            style={{
              backgroundColor: '#ff7e5f',
              border: 'none',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#feb47b')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff7e5f')}
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal open={isFeesModalOpen} onClose={handleCloseFeesModal}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '80%',
          overflow: 'auto',
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
          borderRadius: '8px'
        }}>
          <h2>Students Data for Selected Domain</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell> Course Fee</TableCell>
                  <TableCell>Balance Fee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.domain}</TableCell>
                    <TableCell>{student.finalfee}</TableCell>
                    <TableCell>{student.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Modal>
    </div>
  );
}
