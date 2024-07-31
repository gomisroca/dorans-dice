import axios from 'axios';
import { useState, useEffect } from 'react';

export default function ComponentsMenu({ selectedComponent, items, userComponents, userItems }) {
    const [finalItems, setFinalItems] = useState([]);
    const [craftable, setCraftable] = useState([]);

    useEffect(() => {
        if (selectedComponent && items) {
            let crafts = [];
            for(const into of selectedComponent.into_items){
                let into_item = items.find(el => el.riot_id === parseInt(into));
                if(into_item !== undefined){
                    crafts.push(into_item)
                }
            }
            setFinalItems(crafts);
            
            let can_craft = [];
            for (const craft of crafts){
                if(craft.from_items){
                    let component_count = [];
                    for(const from of craft.from_items){
                        let component = userComponents.find(el => el.riot_id === parseInt(from));
                        if (component !== undefined) {
                            component_count.push(component)
                        }
                    }
                    console.log('craft ' + craft.from_items.length)
                    console.log('comp ' + component_count.length )
                    if (craft.from_items.length === component_count.length) {
                        can_craft.push(craft)
                    }
                }
            }
            setCraftable(can_craft)
        }   
    }, [selectedComponent, items, userComponents])

    return (
    <>
        <div className='p-2 bg-stone-600/90 border-2 border-stone-200 grid gap-y-8'>
            {craftable && finalItems && finalItems.length > 0 ?
            <div className='flex flex-col'>
                <div className='grid grid-cols-5 gap-2 m-auto'>
                    {finalItems.map(item => (
                        item !== undefined ?
                            userItems.find(el => el.name === item.name) ?
                            <img
                            key={item.id}
                            alt={item.id}
                            src={item.image}
                            className="w-[100px] border-amber-400 border-4 opacity-60"
                            />
                            : craftable.find(el => el.name === item.name) ?
                            <img
                            key={item.id}
                            alt={item.id}
                            src={item.image}
                            className="w-[100px] border-green-600 border-4"
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
            </div>
            : null }
        </div>
    </>
    )
}