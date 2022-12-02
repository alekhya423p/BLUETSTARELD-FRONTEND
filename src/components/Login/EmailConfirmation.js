import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../layout/Loading'
import { useNavigate, useParams } from 'react-router-dom'
import { verifyEmail } from '../../actions/authAction'
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/BLE-Logo.png'

const EmailConfirmation = (props) => {

  let params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.verifyEmail)
  useEffect(() => {
    const { id, token } = params;
    const vergicationCode = {
      id,
      token
    }
    dispatch(verifyEmail(vergicationCode, navigate))
  }, [dispatch, navigate, params])

  return (
    <div className="wrapper-page">
      <div className="container-fluid p-0">
        <div className="card">
          <div className="card-body">
            <div className="text-center mt-4">
              <div className="mb-3">
                <Link to="/" className="auth-logo">
                  <img src={logo} className="logo-dark mx-auto" alt="logo" />

                </Link>
              </div>
            </div>
            <h4 className=" text-center font-size-18"><b>Email Confirmation</b></h4>

            <div className="p-3">
              <div className="form-group pb-2 text-center row mt-3">
                <div className="col-12">
                  {loading
                    ? <Loading />
                    : <Link to='/'>
                      <Loading />
                    </Link>
                  }
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
export default EmailConfirmation;
