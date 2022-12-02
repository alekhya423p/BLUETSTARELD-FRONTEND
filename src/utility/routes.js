import React from "react";
import { Route, Switch } from 'react-router-dom';
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ForgotPassword from "../components/Auth/ForgotPassword";
import VerifyEmail from "../components/Auth/VerifyEmail";
import EmailConfirmation from "../components/Auth/EmailConfirmation";
import ResetPassword from "../components/Auth/ResetPassword";
import NotFound from "../components/NotFound";
import PublicRoute from '../components/ProtectedRoute/PublicRoute'
// cliens
import Dashboard from "../components/Dashboard/Dashboard";
import PrivateRoute from "../components/ProtectedRoute/PrivateRoute";
import Profile from '../components/Profile'
import ChangePassword from "../components/Profile/ChangePassword";
import BudgetOverview from "../components/Client/BudgetOverview";
import ActivitySchedule from "../components/Projects";
import FormPartner from "../components/Partners/FormPartner";
import UpdateProject from "../components/Projects/UpdateProject";
import CompleteStage from "../components/Projects/ProjectStage/CompleteStage";
// admin and sub admins
import AdminRoute from '../components/ProtectedRoute/AdminRoute'
import AdminDashboard from "../components/Admin/Dashboard/Dashboard";
import Client from "../components/Admin/ClientManagment";
import EmailTemplates from "../components/Admin/EmailManagement";
import SubAdmin from "../components/Admin/SubAdmins";
import Subscriptions from "../components/Admin/Subscription";
import PaymentHistory from "../components/Admin/PaymentHistory/";
import AdminProfile from '../components/Admin/Profile'
import AdminChangePassword from "../components/Admin/Profile/ChangePassword";
import ProjectDetails from "../components/Projects/ProjectDetails";
import CreateProject from "../components/Projects/CreateProject";
import CreateEmailTemplate from "../components/Admin/EmailManagement/CreateEmailTemplate";
import CommingSoon from "../components/shared/CoomingSoon";
import AddNewPartner from "../components/Partners/AddNewPartner";
import PartnerDashboard from "../components/PartnerDashboard";
import Payment from "../components/Projects/Payment";
import Partners from "../components/Partners";
import ManageObjective from '../components/Admin/MasterManagement/Objective';
import ManageAudience from '../components/Admin/MasterManagement/Audience';
import Projects from '../components/Admin/Projects';
import Members from "../components/Members";
import AcceptEditRequest from "../components/Projects/Components/ReusableComponent/AcceptEditRequest";
import AcceptTimelineInvitation from "../components/Projects/Components/Timeline/AcceptTimelineInvitation";

const routes = () => {
  
  return (
    <Switch>
      {/* Public Routes */}
      <PublicRoute exact path="/" component={Login} />
      <PublicRoute exact path="/login" component={Login} />
      <PublicRoute exact path="/register" component={Register} />
      <PublicRoute exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset/password/:id/:type" component={ResetPassword} />
      <Route exact path='/verify/user/:id/:type' component={EmailConfirmation} />
      <PublicRoute exact path='/verify/email' component={VerifyEmail} />
      <Route exact path='/project/invitation' component={FormPartner} />

      {/* Private Routes */}
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/project-reports" component={PartnerDashboard} />
      <PrivateRoute exact path="/profile" component={Profile} />
      <PrivateRoute exact path='/change-password' component={ChangePassword} />
      <PrivateRoute exact path='/activity-schedule' component={ActivitySchedule} />
      <PrivateRoute exact path='/schedule-details/:id' component={ProjectDetails} />
      <PrivateRoute exact path='/project-create' component={CreateProject} />
      <PrivateRoute exact path='/project/:id' component={UpdateProject} />
      <PrivateRoute exact path='/budget-overview' component={BudgetOverview} />
      <PrivateRoute exact path='/invite-partner' component={AddNewPartner} />
      <Route exact path='/payments' component={Payment} />
      <PrivateRoute exact path='/partners' component={Partners} />
      <PrivateRoute exact path='/members' component={Members} />
      <Route exact path='/reset/project/:type/:token' component={AcceptEditRequest} />
      <Route exact path='/project-timeline/invitation' component={AcceptTimelineInvitation} />
      <Route exact path='/timeline/stage-complete/:id' component={CompleteStage} />
      
      {/* Admin Routes */}
      <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
      <AdminRoute exact path="/admin/profile" component={AdminProfile} />
      <AdminRoute exact path='/admin/subadmin-managment' component={SubAdmin} />
      <AdminRoute exact path='/admin/client-managment' component={Client} />
      <AdminRoute exact path='/admin/email-management' component={EmailTemplates} />
      <AdminRoute exact path='/admin/subscription-managment' component={Subscriptions} />
      <AdminRoute exact path='/admin/create-email-template' component={CreateEmailTemplate} />
      <AdminRoute exact path='/admin/update-email-template' component={CreateEmailTemplate} />
      <AdminRoute exact path="/admin/change-password" component={AdminChangePassword}/>
      <AdminRoute exact path="/admin/payment-history" component={PaymentHistory}/>
      <AdminRoute exact path="/admin/manage-audience" component={ManageAudience}/>
      <AdminRoute exact path="/admin/manage-projects" component={Projects}/>

      <AdminRoute exact path="/admin/manage-objective" component={ManageObjective} />
      <Route path="/comming-soon" component={CommingSoon} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default routes;
