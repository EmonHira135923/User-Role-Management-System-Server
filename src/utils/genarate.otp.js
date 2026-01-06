const generateOtp = () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000 );
    console.log("otp",otpCode);
    return otpCode;
}

export default generateOtp;