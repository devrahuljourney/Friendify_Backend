exports.passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
        <style>
            body {
                background-color: #f8f9fa;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 150px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #007bff;
            }
    
            .body {
                font-size: 18px;
                margin-bottom: 20px;
                color: #555555;
            }
    
            .highlight {
                font-weight: bold;
                color: #007bff;
            }
    
            .support {
                font-size: 14px;
                color: #777777;
                margin-top: 20px;
            }
    
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777777;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <img class="logo" src="https://yourfriendifyapp.com/assets/logo.png" alt="Friendify Logo">
            <div class="message">Password Update Confirmation</div>
            <div class="body">
                <p>Hello [User's Name],</p>
                <p>Your password for Friendify has been successfully updated.</p>
                <p>If you did not request this password change, please contact us immediately.</p>
            </div>
            <div class="support">If you have any questions or need assistance, feel free to contact our support team at
                <a href="mailto:support@friendifyapp.com">support@friendifyapp.com</a>. We're here to help!</div>
            <div class="footer">
                <p>Friendify Social Media App | Connect with Friends</p>
                <p>&copy; 2024 Friendify. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>
    `
}