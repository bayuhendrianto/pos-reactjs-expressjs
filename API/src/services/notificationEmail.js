var nodemailer = require('nodemailer');
const { Booking, BookingClass } = require('../class/booking.class');
var moment = require("moment");
var numeral = require("numeral");

function generateDateTimeStringFormat(date) {
    var today = date ? new Date(date) : new Date(),
        year = today.getFullYear().toString(),
        month = ('0' + (today.getMonth() + 1)).slice(-2),
        date = ('0' + today.getDate()).slice(-2),
        hour = ('0' + today.getHours()).slice(-2),
        minutes = ('0' + today.getMinutes()).slice(-2),
        dateTime = `${date}/${month}/${year} ${hour}:${minutes}`,
        timeFormat = `${hour}:${minutes}`,
        dateFormat = `${year}-${month}-${date}`

    return {
        dateTime: dateTime,
        timeFormat: timeFormat,
        dateFormat: dateFormat,
    }
}

const paymentType = (payment_type) => {
    let result = "";
    switch (payment_type) {
        case "credit_card":
            result = "Kartu Kredit"
            break;
        case "gopay":
            result = "GoPay";
            break;
        case "qris":
            result = "QRIS";
            break;
        case "shopeepay":
            result = "Shopeepay";
            break;
        case "bank_transfer":
            result = "Transfer Bank";
            break;
        case "echannel":
            result = "E channel";
            break;
        case "bca_klikpay":
            result = "BCA Klik Pay";
            break;
        case "bca_klikbca":
            result = "BCA Klik BCA";
            break;
        case "cimb_clicks":
            result = "CIMB Clicks";
            break;
        case "danamon_online":
            result = "Danamon Online";
            break;
        case "cstore":
            result = "CStore";
            break;
        case "akulaku":
            result = "Akulaku";
            break;

        default:
            break;
    }

    return result;
}

function sendInvoice(data, attachment) {
    let booking = new BookingClass(data);

    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'bayuhendrianto95@gmail.com',
        to: booking.customerEmail,
        priority: 'high',
        subject: `Balen App Dev - Pesanan #${booking.no}`,
        attachments: [
            {   // data uri as an attachment
                filename: `${booking.invoiceNumber}.pdf`,
                path: attachment
            }
        ],
        text: 'Invoice'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function sendInvoiceSettlement(data, attachment) {
    let booking = new BookingClass(data);

    let vaNumber;
    if (booking.paymentVaNumbers) {
        vaNumber = JSON.parse(booking.paymentVaNumbers)
    }

    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'bayuhendrianto95@gmail.com',
        to: booking.customerEmail,
        priority: 'high',
        subject: `Balen App Dev - Pesanan #${booking.no}`,
        attachments: [
            {   // data uri as an attachment
                filename: `${booking.invoiceNumber}.pdf`,
                path: attachment
            }
        ],
        text: 'invoice settlement'
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function SendEmailNotificationCustomerRegistration(to, name, password) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'Balen - No Reply <noreply@app.dayanatura.com>',
        to: to,
        priority: 'normal',
        subject: `Balen Dev Apps #${moment(new Date()).format("YYYY/MM/DD/HHMMss")}`,
        text: 'customer registered'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function SendEmailNotificationMitraRegistration(to, name, password) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'Balen - No Reply <noreply@app.dayanatura.com>',
        to: to,
        priority: 'normal',
        subject: `Balen Dev Apps #${moment(new Date()).format("YYYY/MM/DD/HHMMss")}`,
        text: 'Partner registered'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function SendEmailNotificationEmployeeRegistration(to, name, password) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'Balen - No Reply <noreply@app.dayanatura.com>',
        to: to,
        priority: 'normal',
        subject: `Balen Dev Apps #${moment(new Date()).format("YYYY/MM/DD/HHMMss")}`,
        text: 'Employee registered'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function SendEmailNotificationDriverRegistration(to, name, password) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'Balen - No Reply <noreply@app.dayanatura.com>',
        to: to,
        priority: 'normal',
        subject: `Balen Dev Apps #${moment(new Date()).format("YYYY/MM/DD/HHMMss")}`,
        text: 'Driver registered'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function SendEmailNotificationChangeEmail(to, name, emailBefore, emailAfter) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'Balen - No Reply <noreply@app.dayanatura.com>',
        to: to,
        priority: 'normal',
        subject: `Balen Dev Apps #${moment(new Date()).format("YYYY/MM/DD/HHMMss")}`,
        text: 'Change email'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function SendEmailNotificationResetPassword(user, password, url) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bayuhendrianto95@gmail.com',
            pass: process.env.GOOGLE_KEY_FOR_THIRTH_PARTY
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
        from: 'Balen - No Reply <noreply@app.dayanatura.com>',
        to: user.email,
        priority: 'normal',
        subject: `Reset Password - Balen Dev Apps #${moment(new Date()).format("YYYY/MM/DD/HHMMss")}`,
        text: 'Reset password'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error send email :', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    SendEmailNotificationCustomerRegistration,
    sendInvoice,
    sendInvoiceSettlement,
    SendEmailNotificationMitraRegistration,
    SendEmailNotificationDriverRegistration,
    SendEmailNotificationChangeEmail,
    SendEmailNotificationEmployeeRegistration,
    SendEmailNotificationResetPassword
}