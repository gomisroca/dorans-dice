import { useState } from 'react';
import axios from "axios";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function CharacterRolls() {
    const { user, getUserInfo } = useUser();
    const [rolledCharacter, setRolledCharacter] = useState();
    const [dupePrompt, setDupePrompt] = useState(false);
    const [essence, setEssence] = useState(0);
    const navigate = useNavigate();

    const rollCharacter = async (category) => {
        try {           
            let data = {
                "category": category,
            }
            const res = await axios.post('/gacha/roll/characters', data)
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
            setEssence(Math.round(1 / (res.data.chance / 100 + 0.01) * 1000));
            if(user.characters.filter(char => char.name === res.data.name).length > 0){
                let data = {
                "object_type": "orange_essence",
                "object_amount": essence
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
                setDupePrompt(true);
                getUserInfo();
            } else{
                let data = {
                    "object_type": "character",
                    "object_id": res.data.id
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
                setDupePrompt(false);
                getUserInfo();
            }
            setRolledCharacter(res.data);
        }
        catch(err) {
            console.log(err.message)
        }
    }

  return (
    <>
    <div className='flex flex-col m-auto gap-y-4'>
        {user ?
        <div className='flex gap-x-4 items-center'>
            {/* We need three types of roll, 
            "basic" characters with a high chance of roll
            "elite" has a higher chance of rare champions
            "exotic" has a higher chance of a champion skin, skins are cosmetic but they unlock the character too,
            with multiple skins for the same char, you can choose which one to use 
            same with items, basic (boots, wards, dorans), medium(bf sword, big components), elite(fully crafted big boy items)
            in the forge you can mix items to make bigger boy items*/}
            
            {user.token_character_basic > 0 ?
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Basic Character Pack
                </div>
                <div 
                onClick={() => rollCharacter(0)}
                className='cursor-pointer'>
                    <img
                    alt="char0"
                    className='p-4 ml-6 hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/characters-0.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_character_basic}</span>
                    </div>
                    <button
                    onClick={() => navigate('/shop/characters')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            :
            <div className='flex flex-col m-2 w-[200px] duration-200 border border-stone-600'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Basic Character Pack
                </div>
                <div>
                    <img
                    alt="char0"
                    className='p-4 ml-6 contrast-[0.5]'
                    src='/static-data/ui-assets/characters-0.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_character_basic}</span>
                    </div>
                    <button
                    onClick={() => navigate('/shop/characters')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            }

            {user.token_character_plus > 0 ?
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Plus Character Pack
                </div>
                <div 
                onClick={() => rollCharacter(1)}
                className='cursor-pointer'>
                    <img
                    alt="char1"
                    className='p-4 ml-6 hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/characters-1.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_character_plus}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/characters')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            :
            <div className='flex flex-col m-2 w-[200px] duration-200 border border-stone-600'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Plus Character Pack
                </div>
                <div>
                    <img
                    alt="char1"
                    className='p-4 ml-6 contrast-[0.5]'
                    src='/static-data/ui-assets/characters-1.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_character_plus}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/characters')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            }

            {user.token_character_premium > 0 ?
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Premium Character Pack
                </div>
                <div 
                onClick={() => rollCharacter(2)}
                className='cursor-pointer'>
                    <img
                    alt="char2"
                    className='p-4 ml-6 hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/characters-2.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_character_premium}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/characters')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            :
            <div className='flex flex-col m-2 w-[200px] duration-200 border border-stone-600'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Premium Character Pack
                </div>
                <div>
                    <img
                    alt="char2"
                    className='p-4 ml-6 contrast-[0.5]'
                    src='/static-data/ui-assets/characters-2.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_character_premium}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/characters')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            }
        </div>
        : null}
        {rolledCharacter ? 
        <div className='flex flex-col m-auto bg-stone-600 items-center'>
            <span className='bg-stone-600 text-center text-stone-200 font-semibold m-auto p-2'>
                {rolledCharacter.name}
            </span>
            <img
                className='w-[350px] border-stone-600 border-4'
                alt={rolledCharacter.id} 
                src={rolledCharacter.image_loading}
            />
        </div>
        : null}
        {dupePrompt ?
        <div className='flex flex-row m-auto text-center items-center'>
        The character was transformed into
        <img alt='orange_essence' src='/static-data/ui-assets/orange_essence.png' className='h-8' />
        <span className='font-semibold'>{essence}</span>
        </div>
        : null}
    </div>
    </>
  );
}