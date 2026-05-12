
import LoginData from "../model/LoginData.js";

export const updatePassword = async (request, response) => {
    let LoginInfo = await LoginData.findOne({ Master_Password: request.body.Master_Password })
    if (LoginInfo) {
        try {
            await LoginData.updateOne({ Password: request.body.Password })
            // await LoginData.updateOne({Master_Password:request.body.Master_Password},{Password:request.body.Password})
            return response.status(201).json("Password has been updated!")
        } catch (error) {
            return response.status(409).json("Error while updating Password in Backend")
        }
    } else {
        return response.status(409).json("You have entered incorrect master password!")
    }
}

export const checkPassword = async (request, response) => {
    try {
        let LoginPassword = await LoginData.findOne({ Password: request.params.Password })
        if (LoginPassword) {
            return response.status(201).json(true)
            // return response.status(201).json("You have sucessfully Loged In")
        } else {
            return response.status(500).json(false)
            // return response.status(500).json("You have entered incorrect password!")
        }
    } catch (error) {
        return response.status(500).json("Error while Checking Password")
    }
}
