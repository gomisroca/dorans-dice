import Menu from '@mui/material/Menu';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { GiLockedChest } from "react-icons/gi";

export default function ItemSelectMenu({ selectedCharacter, selectedTeam, onItemChange }) {
    const { user } = useUser();
    const [items, setItems]= useState([]);
    const [usedByChar, setUsedByChar] = useState([]);

    useEffect(() => {
        if(user){
            let team_index = user.teams.findIndex(el => el.id === selectedTeam.id)
            if(team_index >= 0){
                checkItemsInUse(user.teams[team_index], user.items);
            }
        }
    }, [user]);

    const checkItemsInUse = (team, items) => {
        let item_array = []
        let used_by_char = []
        for (let character of team.characters) {
            for (let i = 0; i < character.items.length; i++) {
                let filter = items.find(el =>  el.id === character.items[i].id)
                item_array.push(filter)
                if (character.character.name === selectedCharacter.character.name){
                    used_by_char.push(filter)
                    console.log(used_by_char)
                }
            }
        }
        setItems(items.filter(el => !item_array.includes(el)))
        setUsedByChar(used_by_char)
    }

    const addItem = (item) => {
       try { 
            let data = {
                "item": item,
                "character": selectedCharacter
            }
            axios.post('/user/team/character/', data)
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
            onItemChange();
        } catch(err){
            console.log(err)
        }
    }

    const removeItem = (item) => {
        try { 
            let data = {
                "item": item,
                "character": selectedCharacter
            }
            axios.put('/user/team/character/', data)
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
            onItemChange();
         } catch(err){
             console.log(err)
         }
    }
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    function openMenu(event){
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }
    function closeMenu(event){
        event.stopPropagation();
        setAnchorEl(null);
    }

    return (
    <>
        <div>
            <button onClick={openMenu} className="h-[50px] w-[250px] p-2 bg-stone-600 hover:bg-sky-400 transition duration-200 border-r border-stone-200">
                <GiLockedChest size={30} className="text-stone-200" />
            </button>
            <Menu
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                elevation={0}
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
            >
                <div className='p-2 bg-stone-600/90 border-2 border-stone-200 grid gap-y-8'>
                    {items.length > 0 ?
                    <div className='flex flex-col'>
                        <span className='text-stone-200 font-semibold my-2'>Inventory</span>
                        <div className='grid grid-cols-6 gap-1'>
                            {items.map(item => (
                                <img
                                key={item.id}
                                onClick={() => addItem(item)}
                                alt={item.id}
                                src={item.image}
                                className="w-[75px] border-stone-600 border-2 hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer"
                                />
                            ))}
                        </div>
                    </div>
                    : 
                    <div> Your Inventory is empty. </div>
                    }
                    {usedByChar.length > 0 ?
                    <div className='flex flex-col'>
                        <span className='text-stone-200 font-semibold my-2'>Equipped</span>
                        <div className='grid grid-cols-6 gap-1'>
                                {usedByChar.map(item => (
                                    <img
                                    key={item.id}
                                    onClick={() => removeItem(item)}
                                    alt={item.id}
                                    src={item.image}
                                    className="w-[75px] border-stone-600 border-2 hover:border-red-400 hover:contrast-[1.1] transition duration-200 cursor-pointer"
                                    />
                                ))}
                        </div>
                    </div>
                    : null}
                </div>
            </Menu>
        </div>
    </>
    )
}