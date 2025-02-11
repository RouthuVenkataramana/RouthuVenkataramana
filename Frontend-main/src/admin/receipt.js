import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Receipt() {

  const location=useLocation();
  const id=location.state;

  const [fee,setFee]=useState({
    studentName:"",
    domain:"",
    join_date:"",
    receiptNo:"",
    receiptDate:"",
    amount:"",
    paymentMode:"",
    totalFee:"",
    discount:"",
    finalfee:"",
    balance:"",
    next_dueDate:"",
    branch:""
  })

useEffect(() => {
  axios.get(`${process.env.REACT_APP_ENQUIRY}/getfeereceipt/${id}`).then((res) => {
    if (res.status === 200) {
      console.log(res.data[0]); // Log the data to verify finalfee
      setFee({
        studentName: res.data[0].name,
        domain: res.data[0].domain,
        join_date: res.data[0].joindate,
        receiptNo: res.data[0].id,
        receiptDate: res.data[0].paid_on,
        amount: res.data[0].current_payment,
        paymentMode: res.data[0].payment_method,
        totalFee: res.data[0].totalfee,
        discount: res.data[0].discount,
        finalfee: res.data[0].finalfee, // Ensure this is not undefined
        balance: res.data[0].reamaining_balance,
        next_dueDate: res.data[0].next_duedate,
        branch: res.data[0].branch
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch receipt details.',
      });
    }
  }).catch((err) => {
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong. Please try again later.',
      icon: 'error',
      confirmButtonText: 'Close'
    });
  });
}, [id]);
  
  const companyLogo = 'hippo-cloud-technlogies-logo-3.png'; 
  const companyName = 'Hippocloud Technologies Pvt. Ltd.';
  const companyAddress = '2nd floor, CBM Compound, 9-16-23/1/1 Block -1, Asilmetta, Visakhapatnam, Andhra Pradesh 530003';
  const companyAddress2 = '122, D, No 3-73/2B, H. I. G_, near S F S school, Midhilapuri Vuda Colony, Madhurawada, Visakhapatnam, Andhra Pradesh 530041';
  const companyContact = 'Ph. No. : 93478 62547';


  const handlePrint = () => {
    const printContent = document.getElementById('receiptContent').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload the page to restore the original content
  };

  return (
    <div style={{ marginTop: '70px', textAlign: 'center' }}>
      <button 
        onClick={handlePrint} 
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
      >
        Print Receipt
      </button>

      <div id="receiptContent" style={{ 
        maxWidth: '800px', 
        margin: 'auto', 
        padding: '30px', 
        border: '1px solid #000', 
        fontFamily: 'Arial, sans-serif', 
        color: '#000' 
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={companyLogo} alt="Company Logo" style={{ maxWidth: '100px', marginBottom: '15px' }} />
          <h2 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>{companyName}</h2>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>{companyAddress}</p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>{companyAddress2}</p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>{companyContact}</p>
          <h3 style={{ marginTop: '20px', fontSize: '18px', textDecoration: 'underline' }}>FEE RECEIPT</h3>
        </div>

        {/* Receipt Details Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <p><strong>Receipt No :</strong> HCS{fee.receiptNo}</p>
            <p><strong>Receipt Date :</strong> {fee.receiptDate}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <p><strong>Student :</strong> {fee.studentName}</p>
            <p><strong>Branch :</strong> {fee.branch}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <p><strong>Domain :</strong> {fee.domain ==="gd" ? "Graphic designing" : fee.domain==="dm" ? "Digital Marketing" : fee.domain}</p>
            <p><strong>Join Date :</strong> {fee.join_date}</p>
          </div>
        </div>

        {/* Particulars and Amount Section */}
        <table style={{ width: '100%', border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>S.NO</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Details</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>1</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Fee for {fee.domain} course</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>₹ {fee.amount}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}><strong>Total</strong></td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>₹ {fee.amount}</td>
            </tr>
          </tfoot>
        </table>

        {/* Payment Details Section */}
        <div style={{ fontSize: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <p><strong>Payment Mode :</strong> {fee.paymentMode}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <p><strong>Total Fee :</strong> ₹ {fee.totalFee}</p>
            
            <p><strong>Discount :</strong> {fee.discount}%</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
  <p><strong>Final Fee :</strong> ₹ {fee.finalfee}</p>
</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            
            <p><strong>Balance :</strong> ₹ {fee.balance}</p>
            <p><strong>Next Due Date :</strong> {fee.next_dueDate}</p>
          </div>
        </div>

        {/* Request for Timely Payment */}
        <div style={{ textAlign: 'center', fontSize: '14px', margin: '20px 0', color: 'red', fontWeight: 'bold' }}>
          <p>We kindly request all students to ensure timely payment of fees to avoid any inconvenience.</p>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '20px' }}>
          <p>This is a Computer Generated Receipt</p>
          <p>Note: Please produce this receipt for any future clarification regarding fees paid.</p>
          <hr />
          <p><b>Thank you for choosing Hippocloud</b></p>
        </div>
      </div>
    </div>
  );
}
