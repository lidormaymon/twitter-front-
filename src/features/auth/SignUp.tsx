import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, loginAsync, registerUser, selectLoggedStatus, selectUsers } from "./Slicer/authSlice";
import { useEffect, useRef, useState } from "react";
import * as icons from "react-icons/ai";
import Button from "../componets/Button";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

interface SignUpData {
  username: string;
  display_name: string;
  password: string;
  con_pwd: string;
  email: string;
  image: File | null; // Modify the type to allow File or null
}

const SignUp = () => {
  const isLogged = useSelector(selectLoggedStatus);
  const [errorMessage, setErrorMessage] = useState(false) //flag for not filling every inputs
  const [wrongPwd, setWrongPwd] = useState(false) //flag for not matching passworsd 
  const [userNameError, setuserNameError] = useState(false)
  const navigate = useNavigate();
  const users = useAppSelector(selectUsers)
  const dispatch = useAppDispatch()
  const [inputType, setInputType] = useState("password");
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: "",
    display_name: "",
    password: "",
    con_pwd: "",
    email: "",
    image: null
  });

  const handleInputChange = (event: any) => {
    const { name, value, type, files } = event.target;
    // For regular input fields
    if (type !== "file") {
      setSignUpData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else { // For file input
      setSignUpData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // Store the file object, not just its name
      }));
    }
  };

  const triggerFileInput = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setSignUpData((prevFormData) => ({
        ...prevFormData,
        image: file
      }))
    } else {
      setSelectedFile(null);
    }
  };


  const handleShowPwd = () => {
    setInputType((prevInputType) => (prevInputType === "password" ? "text" : "password"));
  };

  const signUp = async () => {
    setErrorMessage(false)
    setuserNameError(false)
    const existUser = users.find((user) => user.username === signUpData.username) // Searching through all users exist even tho backend sends error because when i try to access
    if (!existUser) {      
      console.log(selectedFile);
                                                          //response.error i recieve an error and cant access it so appraoching that way so user would
      if (signUpData.username.trim() !== '' &&                                 //still recieve an error message
        signUpData.display_name.trim() !== '' &&
        signUpData.password.trim() !== '' &&
        signUpData.con_pwd.trim() !== '' &&
        signUpData.email.trim() !== '') {
        if (signUpData.password.length > 4 && signUpData.password.length < 14) {
          if (signUpData.password === signUpData.con_pwd) {
            setIsLoading(true)
            try {
              const response = await dispatch(registerUser(signUpData))
              console.log(response);

              if (response.payload['reg'] === 'success') {
                try {
                  const data = { username: signUpData.username, password: signUpData.password }
                  dispatch(loginAsync(data))
                } catch (error) {
                  console.log(error)
                  toast.error("An error has occured.")
                } finally {
                  navigate('/email-verify')
                }
              }
            } catch (error) {
              console.log(error);
            } finally {
              setIsLoading(false)
            }
          } else setWrongPwd(true), toast.error('Password and confirm password don\'t match.')
        } else toast.error('Password must contain between 4 and 14 letters.')
      } else setErrorMessage(true), toast.error('Must fill all the fields')
    } else {
      setuserNameError(true)
      toast.error('User name already exists. Pick another one.')
    }

  };

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    } else {
      dispatch(getUsers())
    }
  }, [isLogged, isLoading]);

  return (
    <div className="container p-4 border-gray-600 border-2 w-72 md:w-100 h-fit flex flex-col relative left-14 2xl:left-16 3xl:left-40 top-10 items-center justify-center rounded-lg">
      <ToastContainer theme='colored' />
      <h1 className="text-2xl font-bold mb-4  underline relative right-20">Sign Up</h1>
      <div className="flex flex-col items-center">
        <p className="font-semibold relative right-14">Username</p>
        <input
          className="input"
          placeholder="Enter username"
          name="username"
          value={signUpData.username}
          onChange={handleInputChange}
        />
        {userNameError && (
          <p className="text-sm text-red-500 relative right-5">Username already exists</p>
        )}
        <br />
        <p className="font-semibold relative right-11">Display Name</p>
        <input
          className="input"
          placeholder="Enter display name"
          name="display_name"
          value={signUpData.display_name}
          onChange={handleInputChange}
        />
        <br />
        <p className="font-semibold relative right-14">Password</p>
        <input
          className="input"
          placeholder="Enter password"
          type={inputType}
          name="password"
          value={signUpData.password}
          onChange={handleInputChange}
        />
        {inputType === "password" ? (
          <icons.AiFillEye className="relative bottom-5 left-23" onClick={handleShowPwd} />
        ) : (
          <icons.AiFillEyeInvisible className="relative bottom-5 left-23" onClick={handleShowPwd} />
        )}
        <br />
        <p className="font-semibold relative right-7">Confirm password</p>
        <input
          className="input"
          placeholder="Enter password"
          type={inputType}
          name="con_pwd"
          value={signUpData.con_pwd}
          onChange={handleInputChange}
        />
        {inputType === "password" ? (
          <icons.AiFillEye className="relative bottom-5 left-23" onClick={handleShowPwd} />
        ) : (
          <icons.AiFillEyeInvisible className="relative bottom-5 left-23" onClick={handleShowPwd} />
        )}
        <br />
        <p className="font-semibold relative right-18">Email</p>
        <input
          type="text"
          className="input"
          placeholder="Enter your email"
          name="email"
          value={signUpData.email}
          onChange={handleInputChange}
        />
        <br />
        <p className="font-semibold relative right-5 underline">Profile Picture</p>
        <p
          className="font-semibold text-sm hover:underline cursor-pointer relative right-5"
          onClick={triggerFileInput}
        >
          Choose picture
        </p>
        <input
          ref={hiddenFileInput}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          accept="image/jpg, image/jpeg, image/png"
        />
        {selectedFile && (
          <div className="flex flex-col">
            <CloseIcon onClick={() => setSelectedFile(null)} className="cursor-pointer self-end" />
            <img src={URL.createObjectURL(selectedFile)} alt="Selected" className=" max-h-72" />
          </div>
        )}
        <br />
        <div>
          {wrongPwd ? (
            <p className="text-red-500 text-xs relative right-4">Passwords are not matching</p>
          ) : errorMessage ? (
            <p className="text-red-500 text-xs relative right-4">Must fill all the fields!</p>
          ) : null}
        </div>
        <Link to="/login" className="text-xs text-blue-400 underline font-medium relative right-4">
          Already has an account?
        </Link>
        <br />
        <Button 
          text="Sign up" 
          isLoading={isLoading} 
          className="w-36 hover:bg-blue-400" 
          onClick={signUp} 
        />
      </div>
    </div>
  );
};

export default SignUp;
