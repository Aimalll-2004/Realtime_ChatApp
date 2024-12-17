//import React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";


export default function SetAvatar() {

    const api = 'https://api.multiavatar.com/45678945'; //generate random avatars
    // Using DiceBear's "bottts" style for random cute avatars
    // const api = "https://avatars.dicebear.com/api/bottts"; 

    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]); //fetch avatars
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined); //initially undefined
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };

    //   const setProfilePicture = async () => { 
    //     if(selectedAvatar === undefined) {
    //         toast.error("Please select an Avatar!",toastOptions);
    //     }
    //     else {
    //         const user = await JSON.parse(localStorage.getItem("chat-app-user"));
    //         const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {image : avatars[selectedAvatar]});

    //         if (data.isSet) {
    //             user.isAvatarImageSet = true;
    //             user.avatarImage = data.image;
    //             localStorage.setItem("chat-app-user", JSON.stringify(user));
    //             navigate('/');
    //         }
    //         else {
    //             toast.error("Error setting the avatar. Please try again", toastOptions);
    //         }
    //     }
    //   };

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            //Get user from local storage
            const user = JSON.parse(localStorage.getItem("chat-app-user"));
            
            if (!user || !user._id) {
                toast.error("User not found or invalid user ID.");
                return;
            }
    
            try {
                const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {image: avatars[selectedAvatar],});
    
                //Ensure the loader stops after avatars load
                if (data.isSet) {
                    user.isAvatarImageSet = true;
                    user.avatarImage = data.image;
                    localStorage.setItem("chat-app-user", JSON.stringify(user));
                    navigate("/");
                }
                else {
                    toast.error("Error setting avatar. Please try again.", toastOptions);
                }
            } 
            catch (error) {
                toast.error("An error occurred while setting the profile picture.", toastOptions);
            }
        }
    };  //inside try-catch block


//for multiavatar api
useEffect(() => {
    const fetchAvatars = async () => {
        const data = [];
        setIsLoading(true); //start loading
        for (let i = 0; i < 4; i++) {
            try {
                const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = Buffer.from(response.data);
                data.push(buffer.toString("base64"));
            } catch (error) {
                toast.error("Error fetching avatars. Please try again!", toastOptions);
                setIsLoading(false); //stop loading if error and exit
                return;
            }
        }
        setAvatars(data); //set avatars when fetched
        setIsLoading(false); //stop loading
    };

    fetchAvatars();
}, [api]);

    return (
    <>
    {
        isLoading ? <Container>
            <img src={loader} alt="loader" className="loader" />
        </Container> : (

            <Container>
        
        <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
        </div>
        <div className="avatars">
            {
               avatars.map((avatar,index)=> {
                return (
                    <div 
                    key={index}
                    className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
                        onClick={() => setSelectedAvatar(index)}
                        />
                    </div>
                );
               })}
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
        </Container>
    )}
    <ToastContainer />
    </>
    )
} //install buffer for dependencies for images by yarn add buffer

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  //background-color: #131324;
  background-image: url("/background-page/background-aymyl_dark.gif"); /* Update the path if necessary */
  background-size: cover; /* Ensures the image covers the entire container */
  background-position: center; /* Centers the image within the container */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #021e44;
    }
  }
`;