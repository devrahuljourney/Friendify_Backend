const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Friendify OTP Verification</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
            }
    
            .body {
                font-size: 18px;
                margin-bottom: 20px;
                color: #666;
            }
    
            .otp {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #009688;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #009688;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999;
                margin-top: 20px;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <img class="logo" src="https://yourfriendifyapp.com/logo.png" alt="Friendify Logo">
            <div class="message">Friendify OTP Verification</div>
            <div class="body">
                <p>Hello,</p>
                <p>Thank you for signing up with Friendify. Use the following OTP (One-Time Password) to verify your account:</p>
                <div class="otp">${otp}</div>
                <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.</p>
            </div>
            <a class="cta" href="https://yourfriendifyapp.com/verify">Verify Account</a>
            <div class="support">If you need assistance, contact us at <a href="mailto:support@friendify.com">support@friendify.com</a>.</div>
        </div>
    </body>
    
    </html>`;
};

module.exports = otpTemplate;
