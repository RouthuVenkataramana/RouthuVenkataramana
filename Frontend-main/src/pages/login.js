import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const [input, setInput] = useState({ email: '', password: '' });
  const usenav=useNavigate();

  const handler = (e) => {
    const { name, value } = e.target;
    setInput(prevState => ({ ...prevState, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      axios.post(`${process.env.REACT_APP_ENQUIRY}/login`, input)
        .then((res) => {
          console.log(res.data);
          localStorage.setItem('id',res.data[0].id);
          localStorage.setItem('name',res.data[0].name);
          localStorage.setItem('role',res.data[0].role);
         if(res.status===200 && res.data[0].role==="owner"){
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login Success..",
            showConfirmButton: false,
            timer: 1500
          });
          usenav('/ownerhome');
         }
         else if(res.status===200 && res.data[0].role==="admin"){
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login Success..",
            showConfirmButton: false,
            timer: 1500
          });
          usenav('/adminhome');
         }
         else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data,
          });
         }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Close'
          });
        });
    } else {
      Swal.fire({
        title: "Please fill out all fields",
        icon: 'warning',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      });
    }
  };

  return (
    <div id="login-div">
      <img src='blob-scene-haikei (1).png' alt='background' id="login-background" />
      <div id="login-container">
        <h1 id="login-title">Login</h1>
        <form method='post'>
        <label id="input-label">Email</label>
        <input type='email' name="email" id="login-input" placeholder='Ex: User@gmail.com' onChange={handler} /><br />
        <label id="input-label">Password</label>
        <input type='password' name="password" id="login-input" placeholder='Ex: Abcd@123' onChange={handler} /><br />
        <button id="login-button" onClick={submitHandler}>Login</button>
        </form>
      </div>
    </div>
  );
}
