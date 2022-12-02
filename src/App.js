import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import PublicRoute from './hook/PublicRoute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Login from "./components/Login/Login";
import ForgotPassword from "./components/Login/ForgotPassword";
import Register from './components/Register/Register';
import RegisterSuccess from "./components/Register/RegisterSuccess"
import Dashboard from './components/dashboard/Dashboard'
import Drivers from "./components/Drivers/Drivers";
import DriverForm from "./components/Drivers/DriverForm";
import Vehicles from "./components/Vehicles/Vehicles";
import Alerts from "./components/Alerts/Alerts";
import VehicleForm from "./components/Vehicles/VehicleForm";
import CompanyView from "./components/Company/CompanyView"
import CompanyEdit from "./components/Company/CompanyEdit"
import PortalUser from "./components/portalUsers/PortalUser";
import ELD from "./components/eld/ELD";
import ELDForm from "./components/eld/ELDForm";
import UserForm from "./components/portalUsers/UserForm";
import ResetPassword from "./components/Login/ResetPassword";
import Logs from "./components/Logs";
import DriverDailyLog from "./components/Logs/DriverDailyLog";
import VerifyEmail from "./components/Login/VerifyEmail";
import EmailConfirmation from "./components/Login/EmailConfirmation";
import DriverLogs from "./components/Logs/DriverLogs";
import EldEvents from "./components/eld-events/EldEvents";
import VehicleLogs from "./components/eld-events/VehicleLogs";
import DriverHos from "./components/DriverHos/DriverHos";
import Assets from "./components/Assets/Assets";
import Profile from "./components/Profile";
import AssetDetail from "./components/Assets/AssetDetail";
import IftaReport from "./components/Reports/IftaReport";
import ViewIftaReport from "./components/Reports/ViewIftaReport";
import ViewByIfta from "./components/Reports/ViewByIfta";
import FmcsaRecords from "./components/Reports/FmcsaRecords";
import TermNPrivacy from "./components/Register/TermNPrivacy";
import Chat from "./components/Chat";
import Billing from "./components/Billing/Billing";
import Resources from "./components/Resources/Resources";
import Companies from "./components/Companies";
import LiveLocationShare from "./components/LiveLocationShare/LiveLocationShare"
import AddUser from "./components/Companies/SystemUsers/UserForm";
function App() {

  return (
   
    <div className={''}>
      <ToastContainer position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
        <Route path="/dashboard/vehicle/:vehicleNo/:vehicleId" element={<PrivateRoute><AssetDetail /></PrivateRoute>}></Route>
        <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute> }></Route>
        <Route path="/reports/ifta" element={<PrivateRoute><IftaReport /></PrivateRoute>}></Route>
        <Route path="/reports/ifta/:id" element={<PrivateRoute><ViewIftaReport /></PrivateRoute> }></Route>
        <Route path="/reports/ifta/:iftaId/vehicle/:vehicleId" element={<PrivateRoute><ViewByIfta /></PrivateRoute>}></Route>
        <Route path="/fmcsa-records" element={<PrivateRoute><FmcsaRecords /></PrivateRoute>}></Route>
        <Route path="/eld-events" element={<PrivateRoute><EldEvents /></PrivateRoute> }></Route>
        <Route path="/driver-hos" element={<PrivateRoute><DriverHos /></PrivateRoute>}></Route>
        <Route path="/assets" element={<PrivateRoute><Assets /></PrivateRoute>}></Route>
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>}></Route>
        <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
        <Route path="/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
        <Route path="/liveshare" element={<PrivateRoute><LiveLocationShare /></PrivateRoute>} />
        <Route path="/add-user" element={<PrivateRoute><AddUser/></PrivateRoute>} />
        <Route path="/companies/update-user/:id" element={<PrivateRoute><AddUser/></PrivateRoute>} />
        
        <Route path="/" element={<PublicRoute><Login/></PublicRoute>}/>
        <Route path="login" element={<PublicRoute><Login/></PublicRoute>}/>
        <Route path="/:type/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register/></PublicRoute>}/>
        <Route path="/terms-n-privacy" element={<PublicRoute><TermNPrivacy/></PublicRoute>}/>
        <Route path="register-success" element={<PublicRoute><RegisterSuccess/></PublicRoute>}/>
        <Route path="forgot-password" element={<PublicRoute><ForgotPassword/></PublicRoute>}/>
        <Route path="/verify/email" element={<PublicRoute><VerifyEmail/></PublicRoute>}/>
        <Route path="/verify/:id/:token" element={<PublicRoute><EmailConfirmation/></PublicRoute>}/>

        <Route path="/settings/drivers" element={<PrivateRoute><Drivers/></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path="/billing" element={ <PrivateRoute><Billing/></PrivateRoute>} />
        <Route path="/driver/graph-detail/:id/:logDate" element= {  <PrivateRoute><DriverLogs /></PrivateRoute>} />
        <Route path="/driver/:id" element={  <PrivateRoute><DriverDailyLog /></PrivateRoute>} /> 
        <Route path="/eld-events/:vehicleId/:vehicleNo/:vin" element={  <PrivateRoute><VehicleLogs /></PrivateRoute>} />
        <Route path="/settings/drivers/create" element={  <PrivateRoute><DriverForm/></PrivateRoute>}/>
        <Route path="/settings/drivers/:id" element={  <PrivateRoute><DriverForm/></PrivateRoute>}/>
        <Route path="/settings/vehicles" element={  <PrivateRoute><Vehicles/></PrivateRoute>}/>
        <Route path="/settings/alerts" element= { <PrivateRoute><Alerts/></PrivateRoute>} />
        <Route path="settings">
          {/* <Route path="drivers" element={<PrivateRoute><Drivers/></PrivateRoute>}/> */}
          <Route path="vehicles/create" element={  <PrivateRoute><VehicleForm/></PrivateRoute>}/>
          <Route path="vehicles/:id" element={  <PrivateRoute><VehicleForm/></PrivateRoute>}/>
          <Route path="elds" element={  <PrivateRoute><ELD/></PrivateRoute>}/>
          <Route path="elds/create" element={<PrivateRoute><ELDForm/></PrivateRoute>}/>
          <Route path="elds/:id" element={  <PrivateRoute><ELDForm/></PrivateRoute>}/>
          <Route path="portal-users" element={  <PrivateRoute><PortalUser/></PrivateRoute>}/>
          <Route path="user/create" element={  <PrivateRoute><UserForm/></PrivateRoute>}/>
          <Route path="user/update/:id" element={  <PrivateRoute><UserForm/></PrivateRoute>}/>
          <Route path="company" element={<PrivateRoute><CompanyView/></PrivateRoute>}/>
          <Route path="company/update/:id" element={<PrivateRoute><CompanyEdit/></PrivateRoute>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
