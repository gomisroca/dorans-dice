import { useState } from 'react';
import axios from "axios";
import { useUser } from '../../contexts/UserContext';

export default function ExtrasShop() {
    const { user, getUserInfo } = useUser();
    const [rolledCharacter, setRolledCharacter] = useState();
    const [buyPrompt, setBuyPrompt] = useState(false);
    const [essence, setEssence] = useState(0);

    const getCharacterToken = async (category) => {
        try {      
            let data = {
                "object_type": category,
            }
            axios.post('/user/gacha/', data)
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
            setBuyPrompt(true);
            setTimeout(() => setBuyPrompt(false), 2000);
            getUserInfo();
        }
        catch(err) {
            console.log(err.message)
        }
    }

  return (
    <>
    <div className='flex flex-col m-auto gap-y-4'>
        <div className='flex gap-x-4 items-center'>
            <div className='flex flex-col'>
                <div 
                onClick={() => getCharacterToken('token_character_basic')}
                className='cursor-pointer'>
                    <img
                    alt="char0"
                    className='hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/characters-0.png'
                    />
                </div>
                {user.profile.token_character_basic}
            </div>
            <div className='flex flex-col'>
                <div 
                onClick={() => getCharacterToken('token_character_plus')}
                className='cursor-pointer'>
                    <img 
                    alt="char1"
                    className='hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/characters-1.png'
                    />
                </div>
                {user.profile.token_character_plus}
            </div>
            <div className='flex flex-col'>
                <div 
                onClick={() => getCharacterToken('token_character_premium')}
                className='cursor-pointer'>
                    <img 
                    alt="char2"
                    className='hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/characters-2.png'
                    />
                </div>
                {user.profile.token_character_premium}
            </div>
        </div>
        {buyPrompt ?
        <div className='flex flex-col'>
            The item was added to your account.
        </div>
        : null}
    </div>
    </>
  );
}