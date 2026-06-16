import axios from "axios"

const searchYoutube = async (query) => {
    try {
        const result = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    q: query,
                    key: process.env.YOUTUBE_API_KEY,
                    part: 'snippet',
                    type: 'video',
                    maxResults: 1
                }
            }
        )
        const videoId = result.data.items[0]?.id?.videoId
        return videoId ? `https://www.youtube.com/watch?v=${videoId}&autoplay=1` : null
    } catch (error) {
        console.log("YouTube Error:", error.response?.data || error.message)
        return null
    }
}

export default searchYoutube