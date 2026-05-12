import { Patient } from "../model/PatientData.js";

// Master
export const CheckMasterEntry = async (request, response) => {
    try {

        let patientData = await Patient.findOne({ GR_Number: request.params.GR_Number })
        if (patientData) {
            return response.status(200).json(patientData)
        } else {
            return response.status(200).json("Patient doesn't Exist")
        }
    } catch (error) {
        response.status(500).json(error);
    }

}
export const AddMasterEntry = async (request, response) => {
    try {
        try {
            let exist = await Patient.findOne({ GR_Number: request.body.GR_Number });
            if (exist) {
                response.status(200).json('Patient already exists');
                return;
            } else {

                const newPatient = new Patient(request.body);
                await newPatient.save();
                response.status(200).json(newPatient);
            }

        } catch (error) {
            response.status(500).json(error);
        }
    } catch (error) {
        console.log(error)
    }
}

export const UpdateMasterEntry = async (request, response) => {


    try {
        console.log('old')
        const editPatient = new Patient(request.body)
        await Patient.updateOne({ GR_Number: request.params.GR_Number }, editPatient)
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}


// Detail

export const CheckDetailEntry = async (request, response) => {
    try {

        let patientData = await Patient.findOne({ GR_Number: request.params.GR_Number })
        if (patientData) {
            let ReportYearData = await Patient.findOne({ GR_Number: request.params.GR_Number, [`${request.params.Report_Year}`]: true })
            if (ReportYearData) {
                return response.status(200).json(patientData)
            } else {
                return response.status(200).json(`Record of the the year ${request.params.Report_Year} of ${request.params.GR_Number} not found!`)
            }
            // return response.status(200).json(patientData)
        } else {
            return response.status(200).json("Patient doesn't Exist")
        }
    } catch (error) {
        response.status(500).json(error);
    }

}

export const AddDetailEntry = async (request, response) => {

    try {
        console.log('new')
        const editPatient = request.body
        console.log('chala')
        await Patient.updateOne({ GR_Number: request.params.GR_Number }, { $push: { Report_Years: editPatient } }, { new: true })
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        console.log(error)
        response.status(409).json({ message: error.message })
    }
}

export const UpdateMasterEntryDetails = async (request, response) => {

    try {
        console.log('new')
        const editPatient = request.body
        console.log('chala')
        await Patient.updateOne({ GR_Number: request.params.GR_Number }, { $set: editPatient }, { new: true })
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        console.log(error)
        response.status(409).json({ message: error.message })
    }
}

export const UpdateDetailEntry = async (request, response) => {
    // const { GR_Number, Report_Year } = request.params;

    try {
        const updatedData = request.body
        const result = await Patient.findOneAndUpdate(
            { GR_Number : request.params.GR_Number, 'Report_Years.Report_Year': request.params.Report_Year },
            { $set: { 'Report_Years.$': updatedData } },
            { new: true }
        );

        if (!result) {
            return response.status(404).json({message :'Document not found or report year does not match'});
        }

        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        console.log("error",error)
        response.status(500).send('Server error', error);
    }
}


// Delete

export const DeleteMasterData = async (request, response) => {
    try {
        await Patient.deleteOne({ GR_Number: request.params.GR_Number })
        return response.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const DeleteDetailData = async (request, response) => {
    // const { GR_Number, Report_Year } = request.params;

    try {
        const doc = await Patient.findOne({ GR_Number : request.params.GR_Number });

        if (!doc) {
            // return response.status(404).send('Document not found');
            console.log('Document not found')
        }
        console.log(doc)
        // Check if the document has the REPORT_YEARS array and the report year exists
        console.log(doc.Report_Years)
        const reportYearExists = doc.Report_Years.some(yearObj => yearObj.Report_Year === request.params.Report_Year);
        if (!reportYearExists) {
            console.log('Report year not found in the document')
            // return response.status(404).send('Report year not found in the document');
        }


        const result = await Patient.findOneAndUpdate(
            { GR_Number : request.params.GR_Number },
            { $pull: { Report_Years: { Report_Year: request.params.Report_Year } } },
            { new: true } 
        );

        if (!result) {
            return response.status(404).json({message :'Document not found or report year does not match'});
        }

        return response.status(201).json({ message: `Patient's Data for the year ${request.params.Report_Year} has been deleted!` })
    } catch (error) {
        console.log(error)
        // response.status(500).send('Server error');
    }
}

// Get Data

export const GetAllPatientData = async (request, response) => {
    try {
        let allPatientData = await Patient.find({})
        // let allPatientData = await Patient.find({}, { Report_Years: 0 }).skip(0).limit(1)
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientLimitData = async (request, response) => {
    try {
        let allPatientData = await Patient.find({}).skip(request.params.Search_After).limit(request.params.Limit)
        // let allPatientData = await Patient.find({}, { Report_Years: 0 }).skip(0).limit(1)
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetSpecificPatientData = async (request, response) => {
    try {
        let allPatientData = await Patient.findOne({GR_Number:request.params.GR_Number})
        // let allPatientData = await Patient.find({}, { Report_Years: 0 }).skip(0).limit(1)
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}