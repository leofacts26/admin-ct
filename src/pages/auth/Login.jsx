import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { createUserOtp, resendAdminOtp, setOtp, setOtpPage, setPhoneNumber, setToken, verifyAdminOtp } from '../../features/authSlice';

const Login = () => {
  const { phoneNumber, isLoading, otpPage, otp } = useSelector((state) => state.authSlice)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const onHandleResendOtp = async () => {
    const data = {
      phone_number: phoneNumber
    }
    await dispatch(resendAdminOtp(data))
  }

  // onHandleSubmit Function
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      phone_number: phoneNumber,
    };

    try {
      const response = await dispatch(createUserOtp(data));
      if (response.payload.status === "success") {
        dispatch(setOtpPage(true));
      }
    } catch (error) {
      console.error("Error creating OTP:", error);
    } finally {
      // dispatch(setPhoneNumber(""));
    }
  };

  // onHandleOtpSubmit Function
  const onHandleOtpSubmit = async (e) => {
    e.preventDefault();
    const data = {
      phone_number: phoneNumber,
      otp_code: otp
    };
    try {
      const response = await dispatch(verifyAdminOtp(data));
      if (response.payload.status === "success") {
        dispatch(setOtpPage(true));
        navigate('/')
      }
      const token = response.payload.data.token;
      dispatch(setToken(token));
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("Error creating OTP:", error);
    } finally {
      dispatch(setPhoneNumber(""));
      dispatch(setOtp(""));
      dispatch(setOtpPage(false));
    }
  };



  return (
    otpPage ? (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5 align-self-center">
            <h1 className="display-4 text-center mb-3">Sign in With OTP</h1>
            <p className="text-body-secondary text-center mb-5">
              Free access to our dashboard.
            </p>
            <form onSubmit={onHandleOtpSubmit}>
              <div className="form-group">
                <label className="form-label">Enter Phone Number</label>
                <input
                  required
                  value={phoneNumber}
                  onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                  type="tel"
                  maxLength="10"
                  className="form-control"
                  placeholder="Phone Number"
                  style={{
                    backgroundImage: 'url("data:image/png',
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "scroll",
                    backgroundSize: "16px 18px",
                    backgroundPosition: "98% 50%",
                    cursor: "auto"
                  }}
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Enter Otp</label>
                <input
                  required
                  value={otp}
                  onChange={(e) => dispatch(setOtp(e.target.value))}
                  type="tel"
                  maxLength="10"
                  className="form-control"
                  placeholder="Enter OTP"
                  style={{
                    backgroundImage: 'url("data:image/png',
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "scroll",
                    backgroundSize: "16px 18px",
                    backgroundPosition: "98% 50%",
                    cursor: "auto"
                  }}
                />
              </div>

              <div className="col-auto">
                <div onClick={onHandleResendOtp} className="form-text text-end small text-body-secondary" style={{ cursor: 'pointer' }}>
                  Resend Otp?
                </div>
              </div>

              <button className="btn btn-lg w-100 btn-primary mb-3"> {isLoading ? 'Loading...' : 'Sign in'}</button>
            </form>
          </div>
          <div className="col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block">
            <div
              className="bg-cover h-100 min-vh-100 mt-n1 me-n3"
              style={{
                backgroundImage: "url(https://dashkit.goodthemes.co/assets/img/covers/auth-side-cover.jpg)"
              }}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5 align-self-center">
            <h1 className="display-4 text-center mb-3">Sign in</h1>
            <p className="text-body-secondary text-center mb-5">
              Free access to our dashboard.
            </p>
            <form onSubmit={onHandleSubmit}>
              <div className="form-group">
                <label className="form-label">Enter Phone Number</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                  type="tel"
                  maxLength="10"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp" />
              </div>

              <button className="btn btn-lg w-100 btn-primary mb-3"> {isLoading ? 'Loading...' : 'Sign in'}</button>
            </form>
          </div>
          <div className="col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block">
            <div
              className="bg-cover h-100 min-vh-100 mt-n1 me-n3"
              style={{
                backgroundImage: "url(https://dashkit.goodthemes.co/assets/img/covers/auth-side-cover.jpg)"
              }}
            />
          </div>
        </div>
      </div>
    )
  )
}

export default Login

// otpPage ? <VerifyOtp /> : <PhoneNUmberLogin />