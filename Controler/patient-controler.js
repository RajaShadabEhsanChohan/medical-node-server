import { Patient } from "../model/PatientData.js";

// Master
export const CheckMasterEntry = async (request, response) => {
    try {

        let patientData = await Patient.findOne({ GR_Number: request.params.GR_Number })
        if (patientData) {
            console.log('patient data',patientData)
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
            // let ReportYearData = await Patient.findOne({ GR_Number: request.params.GR_Number, "Report_Years.Report_Year": request.params.Report_Year })
            let ReportYearData = await Patient.findOne({ GR_Number: request.params.GR_Number, [`${request.params.Report_Year}`]: true })
            if (ReportYearData) {
                return response.status(200).json(patientData)
            } else {
                return response.status(200).json(`Record of the the year ${request.params.Report_Year} of ${request.params.GR_Number} not found!`)
            }
        } else {
            return response.status(200).json("Patient doesn't Exist")
        }
    } catch (error) {
        response.status(500).json(error);
    }

}

export const AddDetailEntry = async (request, response) => {

    try {
        const editPatient = request.body
        await Patient.updateOne({ GR_Number: request.params.GR_Number }, { $push: { Report_Years: editPatient } }, { new: true })
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        console.log(error)
        response.status(409).json({ message: error.message })
    }
}

export const UpdateMasterEntryDetails = async (request, response) => {

    try {
        const editPatient = request.body
        console.log(editPatient)
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
            { GR_Number: request.params.GR_Number, 'Report_Years.Report_Year': request.params.Report_Year },
            { $set: { 'Report_Years.$': updatedData } },
            { new: true }
        );

        if (!result) {
            return response.status(404).json({ message: 'Document not found or report year does not match' });
        }

        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        response.status(500).send('Server error', error);
    }
}

export const UpdateWholeEntryDetails = async (request, response) => {


    try {
        const editPatient = new Patient(request.body)
        await Patient.findOneAndReplace({GR_Number: request.params.GR_Number }, editPatient, {
            new: true,
            upsert: true, // Create the document if it doesn't exist
          });
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        response.status(409).json({ message: error.message })
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
        const doc = await Patient.findOne({ GR_Number: request.params.GR_Number });

        if (!doc) {
            return response.status(404).send('Document not found');
        }
        // Check if the document has the REPORT_YEARS array and the report year exists

        const reportYearExists = doc.Report_Years.some(yearObj => yearObj.Report_Year === request.params.Report_Year);
        if (!reportYearExists) {
            return response.status(404).send('Report year not found in the document');
        }


        const result = await Patient.findOneAndUpdate(
            { GR_Number: request.params.GR_Number },
            { $pull: { Report_Years: { Report_Year: request.params.Report_Year } } },
            { new: true }
        );

        if (!result) {
            return response.status(404).json({ message: 'Document not found or report year does not match' });
        }

        return response.status(201).json({ message: `Patient's Data for the year ${request.params.Report_Year} has been deleted!` })
    } catch (error) {
        response.status(500).send('Server error');
    }
}
export const DeleteDetailFromMaster = async (request, response) => {
    const { GR_Number, Report_Year } = request.params;

    try {
        Patient.findOneAndUpdate(
            { GR_Number },
            {
                $unset: {
                    Height_2014: 1
                }
            },
            { new: true }
        )
    } catch (error) {
        response.status(500).send('Server error');
    }
}

// Get Data

export const GetAllPatientData = async (request, response) => {
    try {
        let allPatientData = await Patient.find({})
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientCount = async (request, response) => {
    try {
        const { Gender, Entered_Year, Month, Day } = request.query
        let query = {}
        let allParameter = [{ Gender }, { Entered_Year }, { Month }, { Day }].filter(val => Object.values(val)[0] !== undefined)
        
        allParameter.forEach((value) => {
            query = { ...query}
            query[Object.keys(value)] = isNaN(Object.values(value)[0]) ? Object.values(value)[0] : Number(Object.values(value)[0])
            
        })
        console.log(query)

        const count = await Patient.countDocuments(query);
        return response.status(200).json(count)

    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientSummaryCount = async (request, response) => {
    try {
        const { Year, Gender, BMI_Remark, Height_Remark , BMI_Assessed} = request.query

        let YEAR_OBJ = {}
            // YEAR_OBJ[`${Year}`] = true
            YEAR_OBJ[`Report_Years.Report_Year`] = Year

            let BMI_OBJ = {}
            // BMI_OBJ[`Remarks_Year_${Year}`] = BMI_Remark ? BMI_Remark : undefined
            BMI_OBJ[`Remarks_Year_${Year}`] = BMI_Remark

            let BMI_Assessed_OBJ  = {}
            BMI_Assessed_OBJ[`BMI_Assessed_${Year}`] = BMI_Assessed
            
            let HEIGHT_OBJ = {}
            HEIGHT_OBJ[`Remarks_Year_${Year}`] = Height_Remark ? Height_Remark : undefined
            // let BMI_OBJ = {}
            // BMI_OBJ[`BMI_Remark_${Year}`] = BMI_Remark ? BMI_Remark : undefined
            
            // let HEIGHT_OBJ = {}
            // HEIGHT_OBJ[`Height_Remark_${Year}`] = Height_Remark ? Height_Remark : undefined

        let query = {}
        // if(Stunted && false){
        //     // {2024:true,Gender:"male",Height_Remark_2024:{$in :["Stunted", "B/L Stunted"]},BMI_Remark_2024:{$in :["Underweight", "B/L Underweight"]}}
        //     console.log('Stunted is true')
        //     query[`Report_Years.Report_Year`] = Year
        //     query={...query, Gender: Gender}
        //     if (BMI_Remark == "Healthy Child") {
        //         query[`Height_Remark_${Year}`] = {$in :["Stunted", "B/L Stunted"]}
        //         query[`BMI_Remark_${Year}`] = "Healthy Child"
        //     } else if (BMI_Remark == "Obese") {
        //     // } else if (BMI_Remark == "Weight needs to be controlled." || BMI_Remark == "Overweight" || BMI_Remark == "Obese") {
        //         query[`Height_Remark_${Year}`] = {$in :["Stunted", "B/L Stunted"]}
        //         query[`BMI_Remark_${Year}`] = {$in :["Weight needs to be controlled.", "Overweight", "Obese"]}
        //     } else {
                
        //         query[`Height_Remark_${Year}`] = {$in :["Stunted", "B/L Stunted"]}
        //         query[`BMI_Remark_${Year}`] = {$in :["Underweight", "B/L Underweight"]}
        //     }
        //     // let allParameter = [YEAR_OBJ, { Gender }, BMI_OBJ, HEIGHT_OBJ, BMI_Assessed_OBJ].filter(val => Object.values(val)[0] !== undefined)
            
        //     // allParameter.forEach((value) => {
        //     //     query = { ...query}
        //     //     query[Object.keys(value)] = Object.values(value)[0] == 'true' ? true : Object.values(value)[0] == 'false' ? false : Object.values(value)[0]
                
        //     // })
        // } else {

            let allParameter = [YEAR_OBJ, { Gender }, BMI_OBJ, HEIGHT_OBJ, BMI_Assessed_OBJ].filter(val => Object.values(val)[0] !== undefined)
            
            allParameter.forEach((value) => {
                query = { ...query}
                query[Object.keys(value)] = Object.values(value)[0] == 'true' ? true : Object.values(value)[0] == 'false' ? false : Object.values(value)[0]
                
            })
        // }
        
        console.log(query)
        const count = await Patient.countDocuments(query);
        // console.log(count)
        return response.status(200).json(count)

    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientFiltered = async (request, response) => {
    try {
        const { LimitData, SearchAfter, Limit, Count, Year, Gender, Occupation_of_Parent_Guardian, Blood_Group, Class, Section, Heart_Disease, Anomaly, Blood_Disorder, Asthma, Diabetes, Epistaxes, Epilepsy, Healthy_Child, Stunted_Child, Underweight_Child, Obese_Child, Remarks } = request.query

        let filters = {
            Gender: Gender,
            Occupation_of_Parent_Guardian: Occupation_of_Parent_Guardian,
            Blood_Group: Blood_Group,
          };
          if(Year){
            filters[`Report_Years.Report_Year`] = Year
            //   filters[Year] = true
          }
          if (Remarks == "Height is not age appropriate") {
            filters[`Report_Years.Height_Remark`]="B/L Stunted"
            filters[`Report_Years.BMI_Remark`]="Healthy Child"

          } else if (Remarks == "Height is not age appropriate - Weight needs to be controlled!") {

            filters={...filters, $or:[{"Report_Years.Height_Remark":"B/L Stunted"},{"Report_Years.Height_Remark":"Stunted"}],"Report_Years.BMI_Remark":"Weight needs to be controlled."}
           
        // } else if (Remarks == "Stunted") {

            // filters={...filters, $or:[{"Report_Years.Height_Remark":"B/L Stunted"},{"Report_Years.Height_Remark":"Stunted"}],$or:[{"Report_Years.BMI_Remark":"B/L Underweight"},{"Report_Years.BMI_Remark":"Underweight"}]}
           
        } else {
              filters[
                Year ? `Remarks_Year_${Year}` : `Remarks`
              ] = Remarks;
          }

          filters[
            Year ? `Class_${Year}` : `Current_Class`
          ] = Class;
          filters[
            Year ? `Section_${Year}` : `Current_Section`
          ] = Section;
          filters[
            Year
              ? `Heart_Disease_${Year}`
              : `Current_Heart_Disease`
          ] = Heart_Disease;
          filters[
            Year
              ? `Anomaly_Disease_${Year}`
              : `Current_Anomaly_Disease`
          ] = Anomaly;
          filters[
            Year
              ? `Blood_Disorder_${Year}`
              : `Current_Blood_Disorder_Disease`
          ] = Blood_Disorder;
          filters[
            Year
              ? `Asthma_Disease_${Year}`
              : `Current_Asthma_Disease`
          ] = Asthma;
          filters[
            Year
              ? `Diabetes_Disease_${Year}`
              : `Current_Diabetes_Disease`
          ] = Diabetes;
          filters[
            Year
              ? `Epistaxis_Disease_${Year}`
              : `Current_Epistaxis_Disease`
          ] = Epistaxes;
          filters[
            Year
              ? `Epilepsy_Disease_${Year}`
              : `Current_Epilepsy_Disease`
          ] = Epilepsy;
      
          filters[
            Year
              ? `Healthy_Child_${Year}`
              : `Current_Healthy_Child`
          ] = Healthy_Child;
          filters[
            Year
              ? `Stunted_Child_${Year}`
              : `Current_Stunted_Child`
          ] = Stunted_Child;
          filters[
            Year
              ? `Underweight_Child_${Year}`
              : `Current_Underweight_Child`
          ] = Underweight_Child;
          filters[
            Year
              ? `Obese_Child_${Year}`
              : `Current_Obese_Child`
          ] = Obese_Child;

        let query = {}
        console.log(filters)
        console.log(Object.entries(filters).filter(val => (val[1] != 'null')).filter(val => (val[1] != 'undefined')).filter(val => (val[1] != null)).filter(val => (val[1] != undefined)))

        Object.entries(filters).filter(val => (val[1] != 'null')).filter(val => (val[1] != 'undefined')).filter(val => (val[1] != null)).filter(val => (val[1] != undefined)).forEach((value) => {
        // Object.entries(filters).filter(val => val[1] != undefined).forEach((value) => {
                query = { ...query}
                query[value[0]] = value[1] == 'true' ? true : value[1]
            })


        if (Count) {
            console.log('count', query)
            const count = await Patient.countDocuments(query);
            
            return response.status(200).json(count)
            
        } else {
            if(LimitData) {
                console.log('query',query)
                let Specific_Patient_Data = await Patient.find(query).skip(SearchAfter).limit(Limit)
                console.log(Specific_Patient_Data)
                return response.status(200).json(Specific_Patient_Data)
            }
            else {
                console.log(query)
                const Patients = await Patient.find(query);
                return response.status(200).json(Patients)
            }
        }

    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientLimitData = async (request, response) => {
    try {
        let allPatientData = await Patient.find({}).skip(request.params.Search_After).limit(request.params.Limit)
        
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetSpecificPatientData = async (request, response) => {
    try {
        console.log('request for specific')
        let findforName = request.params.Student_Name
        let Father_Name = request.params.Father_Name
        let Other_Diseases = request.params.Other_Disease
        let Report_Year = request.params.Year
        let gr = request.params.GR_Number
        console.log(gr)
        // console.log(findforName, Other_Diseases, Report_Year, gr)
        // console.log('log',findforName != 'false' ? findforName : 'no name' , Other_Diseases )
        // console.log('log',findforName ? findforName : 'not name', Other_Diseases ? Other_Diseases : 'no other')
        if((gr != 'false') && (gr != 'undefined')){
            let allPatientData = await Patient.findOne({ GR_Number: gr })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)
        } else if ((findforName != 'false') && (findforName != 'undefined')) {
            console.log('findforName', findforName)
            let allPatientData = await Patient.find({Student_Name : { $regex : `${request.params.Student_Name}`, $options : 'i'}})
            // let allPatientData = await Patient.findOne({ Student_Name: request.params.Student_Name })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)
        } else if ((Father_Name != 'false') && (Father_Name != 'undefined')) {
            console.log('Father_Name', Father_Name)
            let allPatientData = await Patient.find({Name_of_Parent_Guardian : { $regex : `${request.params.Father_Name}`, $options : 'i'}})
            // let allPatientData = await Patient.findOne({ Student_Name: request.params.Student_Name })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)
        } else if ((Other_Diseases != 'false') && (Other_Diseases != 'undefined')) {
            console.log('Other_Disease', Other_Diseases)
            let allPatientData = await Patient.findOne({ 'Report_Years.Report_Year': Report_Year, 'Report_Years.Other_Disease': request.params.Other_Disease })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)
        } else {
            console.log('else', gr)
            let allPatientData = await Patient.findOne({ GR_Number: gr })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)
        }
        
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetSpecificDiseaseData = async (request, response) => {
    try {
        let Disease = request.params.DiseaseInAllYear
        let Disease_Type = request.params.Disease_Type
        console.log(Disease, Disease_Type)
        if (Disease == "Any Congential Heart Disease") {

            if (Disease_Type != "" && Disease_Type != 'undefined') {
                console.log("Disease type chala")
                let allPatientData = await Patient.find({"Report_Years.Heart_Disease": `${Disease_Type}` })
               return response.status(200).json(allPatientData)
                
            } else {
                console.log("Disease nhi type chala")
                let allPatientData = await Patient.find({"Report_Years" : {$elemMatch : {"Heart_Disease" : { $exists: true, $ne: "" }}}})
               return response.status(200).json(allPatientData)

            }

            
        } else if (Disease == "Any Congential Anomaly"){
            if (Disease_Type != "" && Disease_Type != 'undefined') {
                console.log("Disease type chala")
                let allPatientData = await Patient.find({"Report_Years.Anomaly": `${Disease_Type}` })
               return response.status(200).json(allPatientData)
                
            } else {
                console.log("Disease nhi type chala")
                let allPatientData = await Patient.find({"Report_Years" : {$elemMatch : {"Anomaly" : { $exists: true, $ne: "" }}}})
               return response.status(200).json(allPatientData)

            }
            //  let allPatientData = await Patient.find({"Report_Years.Anomaly": {$exists : true, $ne :""} })
            // console.log(allPatientData)
            // return response.status(200).json(allPatientData)


        } else if (Disease == "Any Blood Disorder"){
            if (Disease_Type != "" && Disease_Type != 'undefined') {
                console.log("Disease type chala")
                let allPatientData = await Patient.find({"Report_Years.Blood_Disorder": `${Disease_Type}` })
               return response.status(200).json(allPatientData)
                
            } else {
                console.log("Disease nhi type chala")
                let allPatientData = await Patient.find({"Report_Years" : {$elemMatch : {"Blood_Disorder" : { $exists: true, $ne: "" }}}})
               return response.status(200).json(allPatientData)

            }
            //  let allPatientData = await Patient.find({"Report_Years.Blood_Disorder": {$exists : true, $ne :""} })
            // console.log(allPatientData)
            // return response.status(200).json(allPatientData)


        } else if (Disease == "Asthma"){
            let allPatientData = await Patient.find({"Report_Years.Asthma": `${request.params.DiseaseInAllYear}` })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)

        } else if (Disease == "Diabetes"){
             let allPatientData = await Patient.find({"Report_Years.Diabetes": `${request.params.DiseaseInAllYear}` })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)


        } else if (Disease == "Epistaxis"){
            console.log('epistaxis chala')
             let allPatientData = await Patient.find({"Report_Years.Epistaxis": Disease })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)


        } else if (Disease == "Epilepsy"){
             let allPatientData = await Patient.find({"Report_Years.Epilepsy": `${request.params.DiseaseInAllYear}` })
            console.log(allPatientData)
            return response.status(200).json(allPatientData)


        } else {
            console.log('disease not specified')
        }      

            
        
        
    } catch (error) {
        console.log("Error",error)
        response.status(409).json({ message: error.message })
    }
}