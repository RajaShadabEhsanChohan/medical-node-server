import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    GR_Number: {
        type: String
    },
    Report_Years : [
        {
            Report_Year: String,
            // other fields can be dynamic/flexible
        }
    ]
    // Student_Name: {
    //     type: String
    // },
    // Gender: {
    //     type: String
    // },
    // Name_of_Parent_Guardian: {
    //     type: String
    // },
    // Occupation_of_Parent_Guardian: {
    //     type: String
    // },
    // Year: {
    //     type: String
    // },
    // Date_of_Admission: {
    //     type: String
    // },
    // Date_of_Birth: {
    //     type: String
    // },
    // Date_of_Leaving_College: {
    //     type: String
    // },
    // Blood_Group: {
    //     type: String
    // },
    // Residential_Address: {
    //     type: String
    // },
    // Residential_Contact_Number: {
    //     type: String
    // },
    // Office_Contact_Number: {
    //     type: String
    // },
    // Email_Address: {
    //     type: String
    // },
    // Remarks: {
    //     type: String
    // },
    // Class_Standard: {
    //     type: String
    // },
    // Section: {
    //     type: String
    // },
    // Detailed_Date: {
    //     type: String
    // },
    // Detailed_Year: {
    //     type: String
    // },
    // Cleanliness: {
    //     type: String
    // },
    // Weight: {
    //     type: String
    // },
    // Height: {
    //     type: String
    // }
}, {strict:false})

export const Patient = mongoose.model('patient', patientSchema);

export default Patient;