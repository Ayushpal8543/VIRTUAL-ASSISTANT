import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // const serverUrl = "http://localhost:3000";
  const serverUrl = import.meta.env.VITE_API_URL;

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        {
          withCredentials: true, // cookies send karne ke liye
        }
      );

      setUserData(result.data);
    } catch (error) {
      console.log("Current user error:", error?.response?.data || error.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const getGroqResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        {
          withCredentials: true,
        }
      );

      return result.data;
    } catch (error) {
      console.log("Assistant error:", error?.response?.data || error.message);
      return null;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGroqResponse,
    loading,
  };

  return (
    <userDataContext.Provider value={value}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        children
      )}
    </userDataContext.Provider>
  );
};

export default UserContext;