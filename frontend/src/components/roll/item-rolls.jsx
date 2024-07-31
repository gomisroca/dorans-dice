import { useState } from 'react';
import axios from "axios";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function ItemRolls() {
  const { user, getUserInfo } = useUser();
  const [rolledItem, setRolledItem] = useState();
  const [dupePrompt, setDupePrompt] = useState(false);
  const [essence, setEssence] = useState(0);
  const navigate = useNavigate();

  const rollItem = async (category) => {
    try {      
        let data = {
            "category": category,
        }
        await axios.post('/gacha/roll/items', data)
        .then(res => {
            setEssence(Math.round(1 / (res.data.chance / 100 + 0.01) * 1000));

            if(user.items.filter(item => item.name === res.data.name).length > 0){
                let data = {
                    "object_type": "blue_essence",
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
            } else {
                let data = {
                    "object_type": "item",
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
            setRolledItem(res.data);
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
    }
    catch(err) {
      console.log(err.message)
    }
  }

  return (
    <>
    <div className="flex flex-col m-auto gap-y-4">       
    {user ?
        <div className='flex gap-x-4 items-center'>
            {/* We need three types of roll, 
            "basic" items with a high chance of roll
            "elite" has a higher chance of rare champions
            "exotic" has a higher chance of a champion skin, skins are cosmetic but they unlock the character too,
            with multiple skins for the same char, you can choose which one to use 
            same with items, basic (boots, wards, dorans), medium(bf sword, big components), elite(fully crafted big boy items)
            in the forge you can mix items to make bigger boy items*/}
            
            {user.token_item_basic > 0 ?
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Basic Item Pack
                </div>
                <div 
                onClick={() => rollItem(0)}
                className='cursor-pointer'>
                    <img
                    alt="char0"
                    className='p-4 ml-6 hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/items-0.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_item_basic}</span>
                    </div>
                    <button
                    onClick={() => navigate('/shop/items')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            :
            <div className='flex flex-col m-2 w-[200px] duration-200 border border-stone-600'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Basic Item Pack
                </div>
                <div>
                    <img
                    alt="char0"
                    className='p-4 ml-6 contrast-[0.5]'
                    src='/static-data/ui-assets/items-0.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_item_basic}</span>
                    </div>
                    <button
                    onClick={() => navigate('/shop/items')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            }

            {user.token_item_plus > 0 ?
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                  Plus Item Pack
                </div>
                <div 
                onClick={() => rollItem(1)}
                className='cursor-pointer'>
                    <img
                    alt="char1"
                    className='p-4 ml-6 hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/items-1.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_item_plus}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/items')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            :
            <div className='flex flex-col m-2 w-[200px] duration-200 border border-stone-600'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                  Plus Item Pack
                </div>
                <div>
                    <img
                    alt="char1"
                    className='p-4 ml-6 contrast-[0.5]'
                    src='/static-data/ui-assets/items-1.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_item_plus}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/items')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            }

            {user.token_item_premium > 0 ?
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Premium Item Pack
                </div>
                <div 
                onClick={() => rollItem(2)}
                className='cursor-pointer'>
                    <img
                    alt="char2"
                    className='p-4 ml-6 hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/items-2.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_item_premium}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/items')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            :
            <div className='flex flex-col m-2 w-[200px] duration-200 border border-stone-600'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Premium Item Pack
                </div>
                <div>
                    <img
                    alt="char2"
                    className='p-4 ml-6 contrast-[0.5]'
                    src='/static-data/ui-assets/items-2.png'
                    />
                </div>
                <div className='justify-center flex flex-col'>
                    <div className='py-1 flex gap-x-2 justify-center text-sm'>
                        <span className='uppercase'>Owned</span>
                        <span className='font-semibold'>{user.token_item_premium}</span>
                    </div>
                    <button 
                    onClick={() => navigate('/shop/items')}
                    className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400'>
                        Get More
                    </button>
                </div>
            </div>
            }
        </div>
        : null}
        {rolledItem ? 
        <div className='flex flex-col m-auto bg-stone-600 items-center'>
          <span className='bg-stone-600 text-center text-stone-200 font-semibold m-auto p-2'>
            {rolledItem.name}
          </span>
          <img
            className='w-[150px] border-stone-600 border-4'
            alt={rolledItem.id} 
            src={rolledItem.image}
          />
        </div>
        : null}
        {dupePrompt ?
        <div className='flex flex-row m-auto text-center items-center'>
            The item was transformed into
            <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-8' />
            <span className='font-semibold'>{essence}</span>
        </div>
        : null}
    </div>
    </>
  );
}