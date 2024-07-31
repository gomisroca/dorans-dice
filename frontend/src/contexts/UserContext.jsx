import axios from "axios";
import { createContext, useState, useEffect, useContext } from 'react';
import { Cookies, useCookies } from 'react-cookie';

const UserContext = createContext();

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const cookieManager = new Cookies();
    const [accessToken, setAccessToken] = useState(cookieManager.get('lolgacha__access_token__'))
    const [refreshToken, setRefreshToken] = useState(cookieManager.get('lolgacha__refresh_token__'))
    const [cookies, setCookie, removeCookie] = useCookies(['lolgacha__token__']);

    const getUserInfo = async() => {
        try {
            await axios.get('http://localhost:8000/user/info/')
            .then(res => {
                let userData = {
                    id: res.data.id,
                    username: res.data.username,
                    email: res.data.email,
                    avatar: res.data.profile.avatar,
                    characters: res.data.profile.characters,
                    items: res.data.profile.items,
                    teams: res.data.profile.teams,
                    blue_essence: res.data.profile.blue_essence,
                    orange_essence: res.data.profile.orange_essence,
                    token_character_basic: res.data.profile.token_character_basic,
                    token_character_plus: res.data.profile.token_character_plus,
                    token_character_premium: res.data.profile.token_character_premium,
                    token_item_basic: res.data.profile.token_item_basic,
                    token_item_plus: res.data.profile.token_item_plus,
                    token_item_premium: res.data.profile.token_item_premium,
                }
                setUser(userData);
            })
            .catch(error => {
                if(error.response && error.response.status === 401){
                    refreshUser();
                }
            })
          }
          catch(err) {
            console.log(err.message)
          }
    }

    const refreshUser = async() => {
        try{
            let data = {
                "refresh": refreshToken
            }
            await axios.post('http://localhost:8000/user/login/refresh/', data)
            .then(res => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                today.setMinutes(today.getMinutes() + 1)

                removeCookie('lolgacha__access_token__');
                setCookie('lolgacha__access_token__', res.data.access, { path: '/', expires: today });
                setAccessToken(res.data.access);

                removeCookie('lolgacha__refresh_token__');
                setCookie('lolgacha__refresh_token__', res.data.refresh, { path: '/', expires: tomorrow });
                setRefreshToken(res.data.refresh);
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
        }catch(err){
            console.log(err)
        }
    }

    const userLogin = async(credentials) => {
        try{
            await axios.post('http://localhost:8000/user/login/', credentials)
            .then(res => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                today.setMinutes(today.getMinutes() + 5);

                setCookie('lolgacha__access_token__', res.data.access, { path: '/', expires: today });
                setAccessToken(res.data.access);

                removeCookie('lolgacha__refresh_token__');
                setCookie('lolgacha__refresh_token__', res.data.refresh, { path: '/', expires: tomorrow });
                setRefreshToken(res.data.refresh);

                getUserInfo();
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
        }catch(err){
            return err
        }
    }

    const userLogout = async() => {
        if (accessToken && refreshToken){
            try {
                const config = {
                headers: { Authorization: `Bearer ${accessToken}`}
                }
                const data = {
                    "refresh": refreshToken
                }
                await axios.post('http://localhost:8000/user/logout/', data, config)
                .catch(error => {
                    if(error.response){
                        console.log(error.response)
                    } else if(error.request){
                        console.log(error.request)
                    } else{
                        console.log(error.message)
                    }
                })
                removeCookie('lolgacha__access_token__');
                removeCookie('lolgacha__refresh_token__');
                setAccessToken(null);
                setRefreshToken(null);
                setUser(null);
            }
            catch(err) {
                console.log(err.message)
            }
        }
    }

    useEffect(() => {
        if(accessToken && refreshToken){
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            getUserInfo();
        } else if (refreshToken){
            refreshUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [accessToken, refreshToken]);

    return (
        <UserContext.Provider value={({user, userLogin, userLogout, getUserInfo, refreshUser})}>
            {children}
        </UserContext.Provider>
    )
}