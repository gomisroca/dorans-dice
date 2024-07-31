import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import Menu from '@mui/material/Menu';
import CraftablesMenu from "./craftables-menu";

export default function ForgeCraftables({ items, userComponents, userItems }) {

    const [craftableItems, setCraftableItems] = useState();
    const [canCraft, setCanCraft] = useState();
    const [userCraftables, setUserCraftables] = useState();

    const [selectedCraftable, setSelectedCraftable] = useState();

    useEffect(() => {
        if(items && userItems){
            let craftables = [];
            for(const item of items){
                if(item.from_items){
                    craftables.push(item);
                }
            }
            setCraftableItems(craftables);

            let user_craftables = [];
            for (const item of userItems) {
                if (item.from_items){
                    user_craftables.push(item);
                }
            }
            setUserCraftables(user_craftables);

            let can_craft = [];
            for (const craft of craftables){
                let component_count = [];
                for(const from of craft.from_items){
                    let component = userComponents.find(el => el.riot_id === parseInt(from));
                    if (component !== undefined) {
                        component_count.push(component)
                    }
                }
                if (craft.from_items.length === component_count.length) {
                    can_craft.push(craft)
                }
            }
            setCanCraft(can_craft)
        }
    }, [items, userComponents, userItems])

    // Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    function openMenu(event, craftable){
        setSelectedCraftable(craftable)
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }
    function closeMenu(event){
        event.stopPropagation();
        setAnchorEl(null);
    }

    return (
    <>
        {craftableItems && userCraftables ?
        <div className="flex flex-col items-center m-auto">
            <div className="grid lg:grid-cols-6 md:grid-cols-4 lg:gap-4 gap-2">
            {craftableItems.map(craftable => (
                canCraft.find(el => el.name === craftable.name) ?<div
                key={craftable.id}
                onClick={e => {openMenu(e, craftable) }}
                className='flex flex-col m-auto bg-stone-600 items-center border-4 border-green-600 w-[150px] hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer'>
                    <img
                        className='w-full'
                        alt={craftable.id} 
                        src={craftable.image}
                    />
                </div>
                : userCraftables.find(el => el.name === craftable.name) ?
                <div
                key={craftable.id}
                className='flex flex-col m-auto bg-stone-600 items-center border-4 border-amber-400 w-[150px] opacity-60'>
                    <img
                        className='w-full'
                        alt={craftable.id} 
                        src={craftable.image}
                    />
                </div>
                :
                <div
                key={craftable.id}
                onClick={e => {openMenu(e, craftable) }}
                className='flex flex-col m-auto bg-stone-600 items-center border-4 border-stone-800 w-[150px] hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer opacity-60'>
                    <img
                        className='w-full'
                        alt={craftable.id} 
                        src={craftable.image}
                    />
                </div>
            ))}
            </div>
        </div>
        : null}
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
            <CraftablesMenu selectedCraftable={selectedCraftable} items={items} userComponents={userComponents} />
        </Menu>
    </>
    );
}