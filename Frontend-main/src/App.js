import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './pages/navbar';
import Login from './pages/login';
import './css.css';
import Ownerhome from './home/ownerhome';
import Admins from './staff/admins';
import Adminhome from './admin/adminhome';
import Admissions from './admin/admissions';
import Internsdashboard from './admin/internsdashboard';
import College from './admin/college';
import Trainer from './trainers/trainer';
import Academystudents from './admin/academystudents';
import Paymentpage from './admin/paymentpage';
import Receipt from './admin/receipt';
import Enquires from './admin/enquires';
import Followups from './admin/followups';
import Students from './admin/students';
import Courses from './admin/courses';
import Internpaymentpage from './admin/internpaymentpage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='ownerhome' element={<Ownerhome/>}></Route>
        <Route path='admins' element={<Admins/>}></Route>
        <Route path='adminhome' element={<Adminhome/>}></Route>
        <Route path='admissions' element={<Admissions/>}></Route>
        <Route path='internsdashboard' element={<Internsdashboard/>}></Route>
        <Route path='college' element={<College/>}></Route>
        <Route path='trainer' element={<Trainer/>}></Route>
        <Route path='courses' element={<Courses/>}></Route>
        <Route path='academystudents' element={<Academystudents/>}></Route>
        <Route path='paymentpage' element={<Paymentpage/>}></Route>
        <Route path='receipt' element={<Receipt/>}></Route>
        <Route path='enquires' element={<Enquires/>}></Route>
        <Route path='followups' element={<Followups/>}></Route>
        <Route path='students' element={<Students/>}></Route>
        <Route path='internpaymentpage' element={<Internpaymentpage/>}></Route>
        </Routes></BrowserRouter>
    </div>
  );
}

export default App;
