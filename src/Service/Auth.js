// src/Service/Auth.js
// Mock Auth service for OTP verification

const Auth = {
    async getOtp({phone}) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock logic: generate a random OTP for testing
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        console.log('Generated OTP for phone:', phone, 'OTP:', otp);
        
        return {
            status: true,
            data: {
                otp: otp,
                message: 'OTP sent successfully'
            }
        };
    },

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

    async setAccount(data) {
        // Mock function to store account data
        console.log('Setting account data:', data);
        return true;
    },

    async setToken(token) {
        // Mock function to store token
        console.log('Setting token:', token);
        return true;
    },

    async guestLogin() {
        // Mock guest login
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            status: true,
            data: {
                token: 'guest_token_' + Date.now(),
                user: { id: 'guest', name: 'Guest User' }
            }
        };
    }
};

export default Auth;
