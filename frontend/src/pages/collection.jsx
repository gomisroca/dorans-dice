import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';

export default function Collection() {
    const { user, getUserInfo } = useUser();
    const [characters, setCharacters] = useState();
    const [items, setItems] = useState();

    useEffect(() => {
        if(user){
            setCharacters(user.characters);
            setItems(user.items);
        }
    }, [user]);


    return (
    <>
    {user ?
        <div className='flex flex-col gap-y-4 '>
            <div className='grid gap-1 grid-cols-10 gap-y-2'>
                {characters ?
                characters.map(character => (
                <div 
                key={character.id} 
                className='border-stone-600 border-4 hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer w-fit'>
                    <img 
                        alt={character.id} 
                        src={character.image_loading}
                    />
                </div>
                ))
                : null}
            </div>
            <div className='grid gap-1 grid-cols-10'>
                {items ?
                items.map(item => (
                <div 
                key={item.id} 
                className='w-[60px] h-[60px] border-stone-600 border-4 hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer'>
                    <img
                        alt={item.id} 
                        src={item.image}
                    />
                </div>
                ))
                : null}
            </div>
        </div>
    : null }
    </>
    )
}