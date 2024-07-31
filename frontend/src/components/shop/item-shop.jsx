import { useEffect, useState } from 'react';
import axios from "axios";
import { useUser } from '../../contexts/UserContext';

export default function ItemShop() {
    const { user, getUserInfo } = useUser();
    const [buyPrompt, setBuyPrompt] = useState(false);
    const [basicAmount, setBasicAmount] = useState(0);
    const [plusAmount, setPlusAmount] = useState(0);
    const [premiumAmount, setPremiumAmount] = useState(0);
    const [essence, setEssence] = useState(0);

    useEffect(() =>{
        if(user){
            setBasicAmount(user.token_item_basic)
            setPlusAmount(user.token_item_plus)
            setPremiumAmount(user.token_item_premium)
            setEssence(user.blue_essence)
        }
    }, [user])

    const getItemToken = async (category) => {
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
        {user ?
        <div className='flex gap-x-4 items-center'>
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Basic Item Pack
                </div>
                <div>
                    <img
                    alt="char0"
                    className='p-4 ml-4  hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/items-0.png'
                    />
                </div>
                <div className='pb-2 flex justify-center gap-x-2'>
                    <span className='text-sm uppercase mt-1'>Owned</span>
                    <span className='font-semibold'>{basicAmount}</span>
                </div>
                {essence >= 2500 ?
                <button
                onClick={() => getItemToken('token_item_basic')}
                className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400 flex flex-row items-center'>
                    <div className='m-auto flex flex-row items-center'>
                        <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-8' />
                        <span>2500</span>
                    </div>
                </button>
                :
                <div className='font-semibold uppercase bg-stone-600 text-stone-200/30 py-2 border-2 border-stone-600 hover:border-sky-400 flex flex-row items-center'>
                    <div className='m-auto flex flex-row items-center'>
                        <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-8 opacity-30' />
                        <span>2500</span>
                    </div>
                </div>
                }
            </div> 
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Plus Item Pack
                </div>
                <div>
                    <img
                    alt="char0"
                    className='p-4 ml-4  hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/items-1.png'
                    />
                </div>
                <div className='pb-2 flex justify-center gap-x-2'>
                    <span className='text-sm uppercase mt-1'>Owned</span>
                    <span className='font-semibold'>{plusAmount}</span>
                </div>
                {essence >= 5000 ?
                <button 
                onClick={() => getItemToken('token_item_plus')}
                className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400 flex flex-row items-center'>
                    <div className='m-auto flex flex-row items-center'>
                        <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-8' />
                        <span>5000</span>
                    </div>
                </button>
                :
                <div className='font-semibold uppercase bg-stone-600 text-stone-200/30 py-2 border-2 border-stone-600 hover:border-sky-400 flex flex-row items-center'>
                    <div className='m-auto flex flex-row items-center'>
                        <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-8 opacity-30' />
                        <span>5000</span>
                    </div>
                </div>
                }
            </div>
            <div className='flex flex-col m-2 w-[200px] hover:bg-stone-200 transition duration-200 border border-stone-600 hover:border-sky-400'>
                <div className='font-semibold text-stone-200 bg-stone-600 p-2 text-center'>
                    Premium Item Pack
                </div>
                <div>
                    <img
                    alt="char0"
                    className='p-4 ml-4  hover:contrast-[1.2] transition duration-200'
                    src='/static-data/ui-assets/items-2.png'
                    />
                </div>
                <div className='pb-2 flex justify-center gap-x-2'>
                    <span className='text-sm uppercase mt-1'>Owned</span>
                    <span className='font-semibold'>{premiumAmount}</span>
                </div>
                {essence >= 20000 ? 
                <button 
                onClick={() => getItemToken('token_item_premium')}
                className='font-semibold uppercase bg-stone-600 text-stone-200 py-2 border-2 border-stone-600 hover:border-sky-400 flex flex-row items-center'>
                    <div className='m-auto flex flex-row items-center'>
                        <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-8' />
                        <span>20000</span>
                    </div>
                </button>
                :
                <div className='font-semibold uppercase bg-stone-600 text-stone-200/30 py-2 border-2 border-stone-600 hover:border-sky-400 flex flex-row items-center'>
                    <div className='m-auto flex flex-row items-center'>
                        <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-8 opacity-30' />
                        <span>20000</span>
                    </div>
                </div>
                }
            </div> 
        </div>
        : null }
        {buyPrompt ?
        <div className='flex flex-col m-auto text-center'>
            The item was added to your account.
        </div>
        : null}
    </div>
    </>
  );
}