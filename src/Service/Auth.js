// src/Service/Auth.js
// Mock Auth service for OTP verification

const Auth = {
    async verifyOtp({phone, otp}) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock logic: accept OTP '123456' as valid, others as invalid
        if (otp === '123456') {
        return {
            status: true,
            data: {message: 'OTP verified', phone},
        };
        } else {
        return {
            status: false,
            data: {message: 'Invalid OTP', phone},
        };
        }
    },
};

export default Auth;
