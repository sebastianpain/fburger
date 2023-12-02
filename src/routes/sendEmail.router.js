import express from "express";
import { sendEmail } from "../utils/main.js";
export const sendEmailRouter = express.Router();

sendEmailRouter.get("/", async (req, res) => {
  try {
    const to = "sebastianramirezpain@gmail.com";
    const subject = "Cuenta eliminada por inactividad";
    const htmlContent = `
      <div>
        <h1>Hola mundo</h1>
        <p>Este es el contenido del correo electrónico.</p>
      </div>
    `;

    await sendEmail(to, subject, htmlContent);
    res.send("Correo electrónico enviado con éxito.");
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    res.status(500).send("Error al enviar el correo electrónico.");
  }
});