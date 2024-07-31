import Menu from '@mui/material/Menu';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { FaUserPlus } from "react-icons/fa6";

export default function CharacterSelectMenu({ selectedTeam, onCharacterChange }) {
    const { user } = useUser();
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        if(user){
            checkCharacterInUse(user.teams, user.characters);
        }
    }, [user]);

    const checkCharacterInUse = (teams, characters) => {
        let char_array = []
        for (let team of teams) {
            for(let i = 0; i < team.characters.length; i++){
                let filter = characters.find(el =>  el.name === team.characters[i].character.name)
                char_array.push(filter)
            }
        }
        setCharacters(characters.filter(el => !char_array.includes(el)))
        if (char_array.length >= 5) {
            setAnchorEl(null);
        }
    }

    const addCharacter = (character) => {
       try { 
            let data = {
                "character": character,
                "team": selectedTeam
            }
            axios.post('/user/team/', data)
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
            onCharacterChange();
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
            {selectedTeam.characters.length < 5  ?
                <button onClick={openMenu} className="h-[60px] w-[60px] p-2 flex flex-row items-center justify-center text-stone-200 bg-stone-600 hover:bg-sky-400 transition duration-200">
                    <FaUserPlus size={30}/>
                </button>
            : null }
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
                {characters ? 
                <div className='grid grid-cols-5 gap-1 p-2 bg-stone-600/90 border-2 border-stone-200'>
                    {characters.map(character => (
                        <img
                        key={character.id}
                        onClick={() => addCharacter(character)}
                        alt={character.id}
                        src={character.image_loading}
                        className="w-[100px] border-stone-600 border-2 hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer"
                        />
                    ))}
                </div>
                : null }
            </Menu>
        </div>
    </>
    )
}