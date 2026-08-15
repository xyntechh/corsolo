import { createContext, useContext, useEffect, useState } from "react";

const SignupContext = createContext();

export const SignupProvider = ({ children }) => {

    const [signupData, setSignupData] = useState(() => {

        const saved = localStorage.getItem("signup");

        return saved
            ? JSON.parse(saved)
            : {
                name: "",
                email: "",
                phone: "",
                password: "",

                dob: "",
                gender: "",

                bio: "",
                profilePicture: "",

                country: "",
                state: "",
                city: "",

                lookingFor: "",

                interestsIn: [],
                yourInterests: [],

                refferdBy: ""
            };

    });


    useEffect(() => {

        localStorage.setItem("signup", JSON.stringify(signupData));

    }, [signupData]);


    const updateSignup = (data) => {

        setSignupData(prev => ({
            ...prev,
            ...data
        }));

    }


    const clearSignup = () => {

        localStorage.removeItem("signup");

        setSignupData({
            name: "",
            email: "",
            phone: "",
            password: "",

            dob: "",
            gender: "",

            bio: "",
            profilePicture: "",

            country: "",
            state: "",
            city: "",

            lookingFor: "",

            interestsIn: [],
            yourInterests: [],

            refferdBy: ""
        });

    }


    return (

        <SignupContext.Provider value={{
            signupData,
            updateSignup,
            clearSignup
        }}>

            {children}

        </SignupContext.Provider>

    )

}

export const useSignup = () => useContext(SignupContext);