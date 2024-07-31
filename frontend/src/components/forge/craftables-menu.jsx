import axios from 'axios';
import { useState, useEffect } from 'react';

export default function CraftablesMenu({ selectedCraftable, items, userComponents }) {
    const [components, setComponents] = useState();
    const [craftable, setCraftable] = useState(false);

    useEffect(() => {
        if (selectedCraftable && items) {
            let comps = [];
            for(const from of selectedCraftable.from_items){
                let from_item = items.find(el => el.riot_id === parseInt(from));
                if(from_item !== undefined){
                    comps.push(from_item)
                }
            }

            let component_count = [];
            for (const comp of comps){
                let userComponent = userComponents.find(el => el.riot_id === comp.riot_id);
                if (userComponent !== undefined) {
                    component_count.push(userComponent)
                }
            }

            if (component_count.length === comps.length) {
                setCraftable(true)
            }
            setComponents(comps)
        }
    }, [selectedCraftable, items, userComponents])

    const craftItem = () => {
        try {
            let data = {
                "action_type": "item_craft",
                "object_id": selectedCraftable.id
            }
            axios.put('/user/gacha/', data)
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
        <div className='px-2 py-4 bg-stone-600/90 border-2 border-stone-200 flex flex-col gap-y-4 items-center'>
            {components && components.length > 0 ?
            <div className='flex flex-row gap-x-2'>
                {components.map(item => (
                    item !== undefined ?
                        userComponents.find(el => el.name === item.name) ?
                        <img
                        key={item.id}
                        alt={item.id}
                        src={item.image}
                        className="w-[100px] border-amber-400 border-4"
                        />
                        :
                        <img
                        key={item.id}
                        alt={item.id}
                        src={item.image}
                        className="w-[100px] border-stone-800 border-4 opacity-60"
                        />
                    : null
                ))}
            </div>
            : null }
            {craftable ?
            <div 
            onClick={craftItem}
            className='flex flex-row items-center gap-2 bg-stone-600 text-stone-200 border-2 border-stone-400 hover:border-sky-400 p-4 transition duration-200 cursor-pointer'>
                <span className='font-semibold uppercase'>Craft</span>
                <div className='flex items-center'>
                    <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-6' />
                    <span>{selectedCraftable.purchase_value} </span>
                </div>
            </div>
            : 
            <div className=' flex flex-row items-center gap-2 bg-stone-600 text-stone-200 border-2 border-stone-600 p-4 transition duration-200 opacity-60'>
                <span className='font-semibold uppercase'>Craft</span>
                <div className='flex items-center'>
                    <img alt='blue_essence' src='/static-data/ui-assets/blue_essence.png' className='h-6' />
                    <span>{selectedCraftable.purchase_value} </span>
                </div>
            </div>
            }
        </div>
    </>
    )
}