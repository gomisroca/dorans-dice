import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Menu from '@mui/material/Menu';

import { useUser } from "../../contexts/UserContext";

import { BiCog } from 'react-icons/bi';
import { RiUserLine } from 'react-icons/ri';
import { RxExit } from 'react-icons/rx';

export default function UserMenu(props) {
    const navigate = useNavigate(); 
    const {user, userLogin, userLogout} = useUser();
    const [failPrompt, setFailPrompt] = useState(false);
    const [successPrompt, setSuccessPrompt] = useState(false);
    
    const toRegister = () => {
        navigate(`/register`);
        setAnchorLoginEl(null);
    };
    const toProfile = () => {
        navigate(`/user/${user.id}`);
        setAnchorLoginEl(null);
    };
    const toSettings = () => {
        navigate(`/settings`);
        setAnchorLoginEl(null);
    };

    // Menu Handle
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    function openMenu(event){
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    function closeMenu(event){
        event.stopPropagation();
        setAnchorEl(null);
    };

    // Login Menu Handle
    const [anchorLoginEl, setAnchorLoginEl] = useState(null);
    const openLogin = Boolean(anchorLoginEl);
    function openLoginMenu(event){
        event.stopPropagation();
        setAnchorLoginEl(event.currentTarget);
    };
    function closeLoginMenu(event){
        event.stopPropagation();
        setAnchorLoginEl(null);
    };

    //Email Login Form
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;

        let formData = new URLSearchParams();
        
        formData.append('username', form.username.value);
        formData.append('password', form.password.value);
        let loggedIn = userLogin(formData)
        if(loggedIn === true){
            setSuccessPrompt(true);
            setFailPrompt(false);
        }else if (loggedIn === false){
            setSuccessPrompt(false);
            setFailPrompt(true);
        }
    };

    return (
    <>
    {user ?
        <div className="h-full right-0 relative z-20 transition duration-500 flex flex-row items-center mr-10">
            <div className="p-2 md:p-4 h-full flex items-center w-fit cursor-pointer transition duration-200 md:hover:bg-sky-400 uppercase font-bold"
            onClick={openMenu}>
                {user.avatar ? 
                <img alt='User Avatar' src={user.avatar} className='rounded-full aspect-square h-8 w-8 md:h-10 md:w-10' /> 
                :
                <img alt='User Avatar' src='/static-data/user_content/avatars/default.png' className='rounded-full aspect-square h-8 w-8 md:h-10 md:w-10' />
                }
            </div>
            <Menu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                elevation={0}
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
            >   
                <div className='w-[180px] items-center rounded-md'>
                    {/* <div 
                    className="flex w-full justify-around py-2 cursor-pointer bg-stone-600 border-b-2 border-t-2 border-stone-200 hover:bg-sky-400 hover:border-sky-400 duration-200 transition" 
                    onClick={() => toProfile()}>
                        <RiUserLine size={25} />
                        <span className='uppercase font-semibold'>
                            Profile
                        </span>
                    </div>
                    <div 
                    className="flex w-full justify-around py-2 cursor-pointer bg-stone-600 border-b-2 border-t-2 border-stone-200 hover:bg-green-400 hover:border-green-400 duration-200 transition" 
                    onClick={() => toSettings()}>
                        <BiCog className="ml-1" size={25} />
                        <span className='uppercase font-semibold'>
                            Settings
                        </span>
                    </div> */}
                    <div 
                    className="flex w-full justify-around py-2 cursor-pointer bg-stone-600 border-b-2 border-t-2 border-stone-200 hover:bg-red-400 hover:border-red-400 duration-200 transition" 
                    onClick={() => userLogout()}>
                        <RxExit size={25} />
                        <span className='uppercase font-semibold'>
                            Logout
                        </span>
                    </div>
                </div>
            </Menu>
            <div className="font-semibold text-stone-200 flex flex-row gap-4">
                <div className="flex flex-row items-center">
                    <img alt='orange_essence' src='/static-data/ui-assets/orange_essence.png' className='h-6' />
                    <span className="ml-1">{user.orange_essence}</span>
                </div>
                <div className="flex flex-row items-center">
                    <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-6' />
                    <span className="ml-1">{user.blue_essence}</span>
                </div>
            </div>
        </div>
    :
        <div className="h-full right-0 relative z-20 transition duration-500 flex flex-row items-center mr-10"
        onClick={openLoginMenu}>
            <div className="p-2 md:p-4 h-full flex items-center w-fit cursor-pointer transition duration-200 md:hover:bg-sky-400 uppercase font-bold">
                <img alt='User Avatar' src='/static-data/user_content/avatars/default.png' className='rounded-full aspect-square h-8 w-8 md:h-10 md:w-10' />
            </div>
            <Menu
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            elevation={0}
            anchorEl={anchorLoginEl}
            open={openLogin}
            onClose={closeLoginMenu}>
                <div className='grid gap-y-4 items-center bg-stone-800 py-4 rounded-md justify-items-center'>
                    <div className="flex flex-col items-center p-2 rounded-md transition duration-200">
                        <form method="post" onSubmit={handleSubmit} className="flex-col grid gap-y-2 px-4">
                            <div className="flex flex-col">
                                <label className="uppercase font-bold mb-2">
                                    Username
                                </label>
                                <input 
                                    required
                                    type="username"
                                    name="username" 
                                    className="p-2 transition duration-200 bg-stone-700 hover:bg-stone-600 rounded-md text-stone-200"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="uppercase font-bold mb-2">
                                    Password
                                </label>
                                <input 
                                    required
                                    type="password"
                                    name="password" 
                                    className="p-2 transition duration-200 bg-stone-700 hover:bg-stone-600 rounded-md text-stone-200"
                                />
                            </div>
                            {failPrompt ?
                                <div className="p-2 text-red-400 font-semibold">Your email or password are incorrect.</div>
                            : null} 
                            {successPrompt ?
                                <div className="p-2 text-green-400 font-semibold">Success. You will be redirected shortly.</div>
                            : null}
                            <button 
                            type="submit" 
                            className="uppercase font-bold py-4 bg-stone-800 hover:bg-stone-600 transition duration-200 rounded-md w-2/3 m-auto">
                                Log In
                            </button>
                        </form>
                    </div>
                    <hr className="border border-stone-600 w-full"/>
                    <div
                    className="cursor-pointer flex flex-row items-center p-2 rounded-md hover:bg-stone-600 transition duration-200"
                    onClick={e => {e.stopPropagation(); toRegister();}}>
                        <span className="font-semibold">Not a member? Register</span>
                    </div>
                </div>
            </Menu>
        </div>
        }
    </>
    );
}