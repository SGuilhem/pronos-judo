const sgMail = require('@sendgrid/mail')

const sendEmail = async ({ to, subject, text, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  await sgMail.send({
    from: 'pronosjudo@gmail.com',
    to,
    subject,
    text,
    html,
  })
}

module.exports = sendEmail