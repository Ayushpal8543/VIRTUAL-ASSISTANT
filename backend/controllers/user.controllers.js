import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";
import searchYoutube from "../youtube.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "get current user error" })
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage = imageUrl;

        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { assistantName, assistantImage },
            { returnDocument: "after" }
        ).select("-password");

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "updateAssistant error" });
    }
};

export const askToAssistant = async (req, res) => {
    try {
        const { command, currentLang } = req.body // ✅ currentLang add kiya
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ response: "user not found" })
        }

        user.history.push(command)
        user.save()

        
        const userName = user.name
        const assistantName = user.assistantName

        const result = await geminiResponse(command, assistantName, userName, currentLang) // ✅ currentLang pass kiya

        if (!result) {
            return res.status(400).json({ response: "sorry, i can't understand" })
        }

        const type = result.type
        const lang = result.lang || currentLang || 'en-US' // ✅ lang lo
        if (result.type === 'youtube_play') {
            const videoUrl = await searchYoutube(result.query || result.userInput)
            return res.json({
             ...result,
             videoUrl: videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(result.query || result.userInput)}`
            })
        }
        switch (type) {
            case 'get_date':
                return res.json({
                    type,
                    lang,
                    userInput: result.userInput,
                    response: `current date is ${moment().format("DD-MM-YYYY")}`
                })
            case 'get_time':
                return res.json({
                    type,
                    lang,
                    userInput: result.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                })
            case 'get_day':
                return res.json({
                    type,
                    lang,
                    userInput: result.userInput,
                    response: `today is ${moment().format("dddd")}`
                })
            case 'get_month':
                return res.json({
                    type,
                    lang,
                    userInput: result.userInput,
                    response: `month is ${moment().format("MMMM")}`
                })
            default:
                return res.json(result) // ✅ lang bhi result mein hoga
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ response: "ask assistant error" })
    }
}
