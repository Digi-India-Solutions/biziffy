"use client";
import React, { useState } from 'react';
import '../../pages/login/login.css';
import logo from '../../Images/logo.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: 'https://api.biziffy.com/api/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

const Page = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Reset Password, 4: Success
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // New loading state
    const [showPassword, setShowPassword] = useState({
        newPassword: false, // Renamed 'password' to 'newPassword' for clarity
        confirmPassword: false,
    });

    const router = useRouter();

    const togglePasswordVisibility = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    // ----- 🔹 Send OTP -----
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true); // Start loading
        try {
            const res = await api.post('/send-otp', { email }); // Use api instance
            if (res.data.success) {
                setMessage('OTP sent successfully to your email!'); // Provide positive feedback
                setStep(2);
                // No router.push here if you want a single-page flow
            } else {
                setMessage(res.data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (err) {
            console.error('Send OTP error:', err);
            setMessage(err.response?.data?.message || 'Something went wrong. Please check your email and try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    // ----- 🔹 Verify OTP -----
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true); // Start loading
        try {
            const res = await api.post('/verify-otp', { email, otp }); // Use api instance
            if (res.data.success) {
                setMessage('OTP verified! You can now set your new password.');
                setStep(3);
                // No router.push here if you want a single-page flow
            } else {
                setMessage(res.data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            console.error('Verify OTP error:', err);
            setMessage(err.response?.data?.message || 'Error verifying OTP. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    // ----- 🔹 Reset Password -----
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setMessage('');
        if (newPassword !== confirmPassword) {
            return setMessage("Passwords do not match. Please ensure both fields are identical.");
        }
        if (newPassword.length < 6) { // Basic password validation
            return setMessage("Password must be at least 6 characters long.");
        }

        setLoading(true); // Start loading
        try {
            const res = await api.post('/reset-password', {
                email,
                newPassword // Backend expects 'newPassword' based on previous context
            });
            if (res.data.success) {
                setMessage('Your password has been successfully reset!');
                setStep(4);
                // Optional: Auto-redirect to login after a delay
                setTimeout(() => {
                    router.push('/pages/login'); // Ensure this path is correct for your login page
                }, 3000); // Redirect after 3 seconds
            } else {
                setMessage(res.data.message || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setMessage(err.response?.data?.message || 'Something went wrong during password reset.');
        } finally {
            setLoading(false); // End loading
        }
    };

    const { newPassword: showNewPassword, confirmPassword: showConfirmPassword } = showPassword; // Destructure for cleaner access

    return (
        <div className="container py-3">
            <div className="row align-items-center">
                <div className="col-md-6 p-0">
                    <div className='login-welcome-content'>
                        <div className='login-welcome-image'>
                            {/* Improved alt text for accessibility */}
                            <Image src={logo} alt="Biziffy company logo" />
                        </div>
                        <div className='login-welcome-text'>
                            {/* Assuming this <h1> is the main title of the page */}
                            <h1>Welcome to Bizi<span style={{ color: 'var(--blue)' }}>ff</span>y</h1>
                            <p>Biziffy is a platform that allows you to manage your tasks and projects in a simple way.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="auth-section">
                        <div className="auth-card">
                            <div className="text-center mb-3">
                                {/* Use an appropriate heading level, e.g., <h2> if <h1> is for "Welcome to Biziffy" */}
                                <h2>Reset Password</h2>
                                <p>
                                    {step === 1 && 'Enter your email to get a verification code.'}
                                    {step === 2 && 'Enter the 6-digit code sent to your email.'}
                                    {step === 3 && 'Set your new password below.'}
                                    {step === 4 && 'Success! Redirecting to login...'}
                                </p>
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleEmailSubmit}>
                                    <div className="form-group mb-3"> {/* Added form-group for better structure */}
                                        <label htmlFor="emailInput" className="form-label visually-hidden">Email address</label> {/* Accessible label */}
                                        <input
                                            type="email"
                                            id="emailInput" // Connect label to input
                                            placeholder="Email address"
                                            className="login-input w-100" // Changed mb-3 to w-100 if it's already full width
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required // Make email required
                                            aria-describedby="emailHelp" // Associate with help text if any
                                        />
                                        <small id="emailHelp" className="form-text text-muted">We'll send a verification code to this email.</small>
                                    </div>
                                    <button className="login-btn w-100" type="submit" disabled={loading}>
                                        {loading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleOtpSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="otpInput" className="form-label visually-hidden">Verification Code</label>
                                        <input
                                            type="text"
                                            id="otpInput"
                                            placeholder="Enter 6-digit OTP"
                                            className="login-input w-100"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            maxLength="6" // Limit OTP length
                                            inputMode="numeric" // Optimize for numeric input on mobile
                                            pattern="[0-9]*" // Restrict to numbers
                                        />
                                    </div>
                                    <button className="login-btn w-100" type="submit" disabled={loading}>
                                        {loading ? 'Verifying...' : 'Verify OTP'}
                                    </button>
                                    {/* Optional: Add a resend OTP button */}
                                    <p className="text-center mt-2">
                                        Didn't receive the OTP? <button type="button" onClick={handleEmailSubmit} className="btn-link" disabled={loading}>Resend OTP</button>
                                    </p>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={handlePasswordReset}>
                                    <div className="password-input mb-3 position-relative form-group">
                                        <label htmlFor="newPasswordInput" className="form-label visually-hidden">New Password</label>
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="newPasswordInput"
                                            placeholder="New Password"
                                            value={newPassword}
                                            className="login-input w-100"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength="6" // Enforce minLength on client-side
                                        />
                                        <button
                                            type="button" // Important: type="button" to prevent form submission
                                            className="show-password-btn position-absolute"
                                            style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer', background: 'none', border: 'none' }}
                                            onClick={() => togglePasswordVisibility('newPassword')}
                                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'} // Accessible label
                                        >
                                            {showNewPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                                        </button>
                                    </div>

                                    <div className="password-input mb-3 position-relative form-group">
                                        <label htmlFor="confirmPasswordInput" className="form-label visually-hidden">Confirm New Password</label>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPasswordInput"
                                            placeholder="Confirm New Password"
                                            className="login-input w-100"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength="6"
                                        />
                                        <button
                                            type="button" // Important: type="button"
                                            className="show-password-btn position-absolute"
                                            style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer', background: 'none', border: 'none' }}
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                            aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                                        >
                                            {showConfirmPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                                        </button>
                                    </div>

                                    <button className="login-btn w-100" type="submit" disabled={loading}>
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            )}

                            {/* Display message */}
                            {message && (
                                <p className={`text-center mt-3 ${step === 4 ? 'text-success' : 'text-danger'}`}>
                                    {message}
                                </p>
                            )}

                            {/* Only show login link if step 4 is reached and not auto-redirecting */}
                            {step === 4 && !loading && ( // Add !loading check to prevent showing if auto-redirecting
                                <p className="text-center mt-3">
                                    <Link href="/pages/login" className="text-primary">Login Now</Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;