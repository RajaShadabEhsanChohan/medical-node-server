import { Router } from "express";
import { checkPassword, updatePassword } from "../Controler/login-controler.js";
import { AddDetailEntry, AddMasterEntry, CheckDetailEntry, CheckMasterEntry, DeleteDetailData, DeleteMasterData, GetAllPatientCount, GetAllPatientData, GetAllPatientFiltered, GetAllPatientLimitData, GetAllPatientSummaryCount, GetSpecificDiseaseData, GetSpecificPatientData, UpdateDetailEntry, UpdateMasterEntry, UpdateMasterEntryDetails, UpdateWholeEntryDetails } from "../Controler/patient-controler.js";
import nodemailer from 'nodemailer'
import multer from 'multer'
import { configDotenv } from "dotenv";

const router = Router()
configDotenv()
router.get("/", (req, res) => {
  res.send("Hello")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/send-pdf', upload.single('pdf'), async (req, res) => {
  const { email } = req.body;
  const pdfBuffer = req.file.buffer;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Health Report - Medical Department Bahria College Karsaz',
    html: `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
      <p>السلام علیکم</p>
      
      <p>Your recent health report is now available and has been attached to this email in PDF format.</p>
  
      <p>If you have any questions or need further assistance, feel free to contact our team.</p>
  
      <p style="margin-top: 20px;">Best regards,<br/>
      <span style="font-family: arial, helvetica, sans-serif;"><strong>Medical Department</strong></span>
      <br>
      <span style="font-family: arial, helvetica, sans-serif;">
      <strong>
      <span style="font-size: 10pt;">Bahria College Karsaz<br></span>
      </strong>
      <span style="font-size: 8pt;">Contact: 02148503252<br></span>
      <span style="font-size: 8pt;">Email : bckzinfo@gmail.com</span>
      </span>
      <br>
      <span style="font-size: 8pt; font-family: arial, helvetica, sans-serif;">Website : <a href="https://www.bckz.edu.pk">www.bckz.edu.pk</a></span><br><span style="font-size: 8pt; font-family: arial, helvetica, sans-serif;">Address : Habib Rehmatullah Road, Karsaz Faisal Cantonment, Karachi, Karachi City, Sindh</span></p>
    </div>
  `,


    attachments: [
      {
        filename: 'Health_Report.pdf',
        content: pdfBuffer,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent with PDF attachment!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

//Credentials
router.put("/update-password/:Master_Password", updatePassword)
router.get("/auth-login-data/:Password", checkPassword)

//Master
router.get("/checkMasterEntry/:GR_Number", CheckMasterEntry)
router.post("/addMasterEntry", AddMasterEntry)
router.put("/updateMasterEntry/:GR_Number", UpdateMasterEntry)

//Detail

router.get("/checkDetailEntry/:GR_Number/:Report_Year", CheckDetailEntry)
router.put("/addDetailEntry/:GR_Number", AddDetailEntry)
router.put("/updateMasterEntryDetails/:GR_Number", UpdateMasterEntryDetails)
router.put("/updateDetailEntry/:GR_Number/:Report_Year", UpdateDetailEntry)
router.put("/updateWholeEntryDetails/:GR_Number", UpdateWholeEntryDetails)

//Delete
router.delete("/DeleteMaster/:GR_Number", DeleteMasterData)
router.delete("/DeleteDetail/:GR_Number/:Report_Year", DeleteDetailData)
router.delete("/DeleteDetailFromMaster/:GR_Number/:Report_Year", DeleteDetailData)


// Get Data
router.get("/getAllPatients", GetAllPatientData)
router.get("/getAllPatientCount", GetAllPatientCount)
router.get("/getAllPatientSummaryCount", GetAllPatientSummaryCount)
router.get("/getAllPatientFiltered", GetAllPatientFiltered)
router.get("/getSpecificPatient/:GR_Number/:Student_Name/:Other_Disease/:Year/:Father_Name", GetSpecificPatientData)
router.get("/getSpecificDisease/:DiseaseInAllYear/:Disease_Type", GetSpecificDiseaseData)
router.get("/getAllPatients/:Search_After/:Limit", GetAllPatientLimitData)

export default router