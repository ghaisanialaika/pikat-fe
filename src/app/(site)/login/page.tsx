    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import './Login.css';

    const Login = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/formlogin");
    };

    return (
        <div className="login-page-container">
        <h1 className="login-page-title">LOGIN</h1>

        <div className="login-card">
            <p className="login-welcome-text">Selamat datang, di</p>

            <div className="login-logo-container">
            <span className="login-logo-p">P</span>
            <div className="login-logo-right">
                <div className="login-iket">
                <span>iket</span>
                </div>
                <div className="login-nekat">
                <span className="login-n">N</span>
                <span className="login-ekat">ekat</span>
                </div>
            </div>
            </div>

            <button onClick={handleClick} className="login-button">
            Masuk dengan login
            </button>
        </div>
        </div>
    );
    };

    export default Login;


        .login-page-container {
    position: relative;
    height: 100vh;
    width: 100%;
    background: url('/public/smk.jpg') center/cover no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    }

    .login-page-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 0;
    }

    .login-page-title {
    position: absolute;
    top: 15px;
    left: 25px;
    font-size: 14px;
    color: #bfbfbf;
    font-weight: 600;
    letter-spacing: 1px;
    z-index: 1;
    }

    .login-card {
    position: relative;
    z-index: 1;
    background: #f4f4f4;
    padding:2rem;
    max-width: 400px;
    width:100%;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    text-align: center;
    }

    .login-welcome-text {
    color: #333;
    margin-bottom: 25px;
    font-size: 18px;
    font-weight: 500;
    }

    .login-logo-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 40px;
    }

    .login-logo-p {
    font-size: 100px;
    font-weight: 900;
    color: #009688;
    line-height: 0.8;
    margin-right: 10px;
    }

    .login-logo-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1;
    }

    .login-iket span {
    font-size: 36px;
    font-weight: 700;
    color: #000;
    }

    .login-nekat {
    font-size: 36px;
    font-weight: 700;
    display: flex;
    align-items: center;
    }

    .login-n {
    color: #000;
    }

    .login-ekat {
    color: #009688;
    }

    .login-button {
    background: #333;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 12px 35px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background 0.3s ease, transform 0.2s;
    }

    .login-button:hover {
    background: #000;
    transform: scale(1.05);
    }
