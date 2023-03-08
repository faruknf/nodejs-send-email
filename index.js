const nodemailer = require("nodemailer");

const HOSTS = {
  gmail: "smtp.gmail.com",
  yahoo: "smtp.mail.yahoo.com",
  outlook: "smtp.office365.com",
};

function createTransporter({ host, user, pass }) {
  return nodemailer.createTransport({
    host: HOSTS[host] || HOSTS.gmail,
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
}

function createMailOptions({ from, to, subject, type, content, attachments }) {
  let mailOptions = {
    from,
    to,
    subject,
  };

  switch (type) {
    case "text":
      mailOptions.text = content;
      break;

    case "html":
      mailOptions.html = content;
      break;
    default:
      mailOptions.text = content;
  }

  if (attachments && attachments.length > 0) {
    mailOptions.attachments = attachments.map((attachment, index) => ({
      filename: `${attachment.filename}.${attachment.file}`,
      path: attachment.path,
      cid: `file_${index}`,
    }));
  }

  return mailOptions;
}

async function sendMail(options) {
  const { host, user, pass, from, to, subject, type, content, attachments } =
    options;

  if (!host || !user || !pass || !from || !to || !subject) {
    throw new Error("Missing required parameters");
  }

  const transporter = createTransporter({ host, user, pass });
  const mailOptions = createMailOptions({
    from,
    to,
    subject,
    type,
    content,
    attachments,
  });

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}

// Example usage:
sendMail({
  host: "gmail",
  user: "your-emaill",
  pass: "your-pass",
  from: "sender",
  to: "receiver",
  subject: "Test email",
  content: "Hello",
  attachments: [
    {
      file: "png",
      filename: "myimage",
      path: "path/to/image",
    },
  ],
});
