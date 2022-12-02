import { Link } from "react-router-dom"
import { useSelector } from "react-redux";
const RegisterSuccess = () => {
    const { user } = useSelector((state) => state.register);
  return (
    <>
    <div className="wrapper-page">
        <div className="container-fluid p-0">
            <div className="card">
                <div className="card-body">
                    <div className="text-center mt-4">
                            <div className="mb-3">
                            <a href="index.html" className="auth-logo">
                                <img src="assets/images/BLE-Logo.png"  className="logo-dark mx-auto" alt="logo"/>
                                
                            </a>
                        </div>
                    </div>
    
                    <h4 className=" text-center font-size-22"><b>Email has been Sent</b></h4>
    
                    <div className="p-3">
                          <p className='text-center'> Confirmation email has been sent to {user.email}. Please check for an email from ELD and click on the included link to activate your account.</p>
                    </div>
                    <div className='text-center'>
                        <Link to="/login" className="btn btn-primary text-center">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default RegisterSuccess