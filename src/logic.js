const nodemailer = require('nodemailer')

const pairEmails = (emails) => {
  var result = [];
  var recipients = emails.slice();
  for (var i = 0; i < emails.length; i++) {
    var sender = emails[i];
    var recipientIndex = Math.floor(Math.random() * recipients.length);
    while (recipients[recipientIndex] === sender) {
      // Can't send gift to myself
      recipientIndex = Math.floor(Math.random() * recipients.length);
    }
    var recipient = recipients.splice(recipientIndex, 1)[0];
    result.push({
      sender: sender,
      receiver: recipient
    });
  }
  return result;
}

const drawEmails = (emailSender, drawCreator, groupTitle, receiverName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tutortuteeconnect@gmail.com',
      pass: process.env.password
    }
  });

  const mailOptions = {
    from: 'tutortuteeconnect@gmail.com',
    to: emailSender,
    subject: 'Your secret santa',
    html: `<p>Hello,</p><p> You have been entered into a secret santa draw by ${drawCreator.toUpperCase()} as part of their group called ${groupTitle.toUpperCase()} on the secret santa generator web app. You will buying a gift for ${receiverName.toUpperCase()}.</p>Have fun exchanging gifts.<p>Thank you.</p><p>Secret santa generator</p>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {pairEmails, drawEmails};
