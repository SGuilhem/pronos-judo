require("dotenv").config({ path: "./backend/.env" });

const sendEmail = require("./utils/sendEmail");

(async () => {
  try {
    await sendEmail({
      to: "guilhemsaclier@gmail.com",
      subject: "Test Email",
      text: "Ceci est un test d'envoi d'email avec Nodemailer.",
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email :", err);
  }
})();