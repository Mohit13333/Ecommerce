import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

export const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

export const sendMail = async function ({ to, subject, text, html }) {
  let info = await transporter.sendMail({
    from: '"E-commerce" <mohitkumar143680@gmail.com>',
    to,
    subject,
    text,
    html,
  });
  return info;
};

export const invoiceTemplate = function (items) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Receipt</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #D2C7BA, #f7d28a);
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid #c1a77a;
        }
        .header img {
            width: 100px; /* Adjust logo size */
            margin-bottom: 10px;
        }
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            color: #3c3c3c;
        }
        .header h2 {
            font-size: 20px;
            margin: 5px 0 0;
            color: #3c3c3c;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 10px 0;
            color: #555555;
        }
        .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .receipt-table th, .receipt-table td {
            padding: 12px;
            text-align: left;
            border: 1px solid #d4dadf;
        }
        .receipt-table th {
            background-color: #D2C7BA;
            font-weight: bold;
            color: #3c3c3c;
        }
        .receipt-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .thumbnail {
            text-align: center; /* Center the thumbnail images */
            padding: 10px 0; /* Add padding for spacing */
        }
        .thumbnail img {
            max-width: 50px; /* Adjust image size */
            height: auto;
            border-radius: 4px;
        }
        .footer {
            background-color: #D2C7BA;
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #3c3c3c;
        }
        .footer p {
            margin: 0;
        }
        a {
            color: #1a82e2;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/mohitsingh8954/image/upload/v1735449740/ecommerce_q3hkt7.png" alt="ClickShop">
            <h1>ClickShop</h1>
            <h2>Thank you for your order!</h2>
        </div>

        <div class="content">
            <p>Here is a summary of your recent order. If you have any questions or concerns about your order, please <a href="mailto:mohitkumar143680@@gmail.com">contact us</a>.</p>
            <table class="receipt-table">
                <tr>
                    <th>Order Id#</th>
                    <th>Item Name</th>
                    <th>Price</th>
                </tr>
                ${items.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.productId.title}</td>
                    <td>${item.price}</td>
                </tr>
                <tr>
                    <td colspan="3" class="thumbnail"><img src="${item.productId.thumbnail}" alt="Order Item Image"></td>
                </tr>
                `).join('')}
            </table>
        </div>

        <div class="footer">
            <p>Thank you for choosing us!</p>
        </div>
    </div>

</body>
</html>

`;
};
