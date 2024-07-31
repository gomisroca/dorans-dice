import axios from "axios";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function Battle() {
    const { getUserInfo, refreshUser } = useUser();
    const [battlePrompt, setBattlePrompt] = useState(false);
    const [essenceType, setEssenceType] = useState(null);
    const [essenceAmount, setEssenceAmount] = useState(0);

    const startBattle = async () => {
        try {      
            await axios.get('/gacha/roll/battle')
            .then(res => {
                console.log(res.data)
                setEssenceType(res.data.essence_type);
                setEssenceAmount(res.data.essence_amount);
                setBattlePrompt(true);
                getUserInfo();
            })
            .catch(error => {
                if(error.response && error.response.status === 401){
                    refreshUser();
                    startBattle();
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
        <div className='flex flex-col h-full m-auto gap-y-2'>
            <button
            className='m-auto p-2 items-center overflow-hidden content-center hover:contrast-[1.1] transition duration-200 text-stone-600 hover:text-stone-800 border-t border-b border-transparent hover:border-sky-400'
            onClick={() => startBattle()}>
                <img 
                alt="battle"
                className="w-[300px]" 
                src='/static-data/ui-assets/battle.png' />
                <span className='font-semibold text-4xl ml-4 uppercase'>Battle</span>
            </button>
            {battlePrompt ?
                <div className='flex flex-row m-auto text-center items-center'>
                    You obtained
                    <img alt={essenceType} src={'/static-data/ui-assets/' + essenceType + '.png'} className='h-8' />
                    <span className='font-semibold mr-1'>{essenceAmount}</span> from the battle.
                </div>
            : null}
        </div>
        </>
    );
}