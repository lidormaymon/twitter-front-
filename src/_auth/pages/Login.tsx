import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as icons from 'react-icons/ai';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';
import { loginAsync, selectLoggedStatus } from '../Slicer/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Button from '../../shared/componets/Button';



const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLogged = useAppSelector(selectLoggedStatus);
    const [ErrorFlag, setErrorFlag] = useState(false)
    const [ErrorMsg, setErrorMsg] = useState('');
    const [inputType, setInputType] = useState('password');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setLoginData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const showPwd = () => {
        if (inputType === 'password') {
            setInputType('text');
        } else {
            setInputType('password');
        }
    };

    const handleLogin = async () => {
        setErrorFlag(false)
        setIsLoading(true); // Set isLoading to true before making the request
        try {
            const res = await dispatch(loginAsync(loginData));
            console.log('ssssss', res);
            if (loginData.username.trim() !== '' && loginData.password.trim() !== '') {
                if (res.type === 'auth/login/fulfilled') {
                    if (rememberMe) {
                        sessionStorage.setItem('refresh', JSON.stringify(res.payload.refresh));
                    }
                    navigate('/');
                }
                toast.error('Wrong username or password!'), setErrorFlag(true), setErrorMsg('Wrong username or password.'), setLoginData({username:'', password:''})
            } else toast.error('Must fill all the fields!'), setErrorFlag(true), setErrorMsg('Must fill all the fields.')
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (isLogged) {
            navigate('/');
        }
    }, [isLogged, isLoading]);

    return (
        <div className="container flex  p-4 xl:border-gray-600 xl:border-2 w-72 md:w-100 h-fit  flex-col relative left-14 2xl:left-16 3xl:left-40 top-20 items-center justify-center rounded-lg">
            <ToastContainer theme='colored' />
            <h1 className="text-2xl font-bold mb-4  underline relative right-20">Login</h1>
            <div className="flex flex-col items-center">
                <p className="font-semibold relative right-14">Username</p>
                <input className="input" placeholder="Enter username" name="username" value={loginData.username} onChange={handleInputChange} /><br />
                <p className="font-semibold relative right-14">Password</p>
                <div>
                    <input className="input" placeholder="Enter password" type={inputType} name="password" value={loginData.password} onChange={handleInputChange} />
                    {inputType === 'password' ? (
                        <icons.AiFillEye className="relative bottom-5 left-40" onClick={showPwd} />
                    ) : (
                        <icons.AiFillEyeInvisible className="relative bottom-5 left-40" onClick={showPwd} />
                    )}
                </div>
                {ErrorFlag && (
                    <p className='text-xs text-red-500 relative right-2'>{ErrorMsg}</p>
                )}<br />
                <div className="flex flex-row relative right-10 bottom-4">
                    <input
                        type='checkbox'
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <p className='text-xs font-semibold relative left-2'>Remember me?</p>
                </div>
                <Link to='/register' className="text-xs text-blue-400 underline font-medium relative right-4">Doesn't have an account?</Link><br />
                <div className='relative '>
                    <Button text='Login' isLoading={isLoading} className="w-36 hover:bg-blue-400 relative bottom-3" onClick={handleLogin} />
                </div>
                <div className='h-18'>
                    <p className='text-red-700'>Admin creds</p>
                    <p className='text-red-700'>Username: admin <br/> Password: 123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
