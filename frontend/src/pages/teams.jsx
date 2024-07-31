import { useEffect, useState } from 'react';
import axios from "axios";
import { useUser } from '../contexts/UserContext';
import CharacterSelectMenu from '../components/team-selections/character-select-menu';
import ItemSelectMenu from '../components/team-selections/item-select-menu';
import { RxCross2 } from "react-icons/rx";

export default function Teams() {
    const { user, getUserInfo } = useUser();
    const [teams, setTeams] = useState();

    const removeCharacter = (character, team) => {
        try { 
            let data = {
                "character": character,
                "team": team
            }
            axios.put('/user/team/', data)
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        if(user){
            setTeams(user.teams);
        }
    }, [user]);

    const handleCallback = () => {
       getUserInfo();
    };

    return (
    <>
    {user ?
        <div>
            {teams ?
            teams.map(team => (
                <div className='flex flex-col items-center' 
                key={team.name}>
                    <span className='p-4 font-semibold text-stone-800'>{team.name}</span>
                    <div className='flex flex-row items-center'>
                    {team.characters ?
                    team.characters.map(character => (
                        <div key={character.id} className='flex flex-col px-2 items-center'>
                            <span className='bg-stone-600 w-full text-center text-stone-200 font-semibold py-2'>{character.character.name}</span>
                            <img
                            alt={character.character.id}
                            src={character.character.image_loading}
                            className="w-[300px] border-stone-600 border-4 hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer" />
                            <div className='flex flex-row'>
                                <ItemSelectMenu items={user.items} selectedTeam={team} selectedCharacter={character} onItemChange={handleCallback} /> 
                                <RxCross2
                                    size={40}
                                    className="h-[50px] w-[50px] text-stone-200 bg-stone-600 border-stone-200 hover:bg-red-400 transition duration-200 cursor-pointer"
                                    onClick={() => {
                                        removeCharacter(character, team); 
                                        getUserInfo();
                                    }}
                                />
                            </div>
                        </div>
                    ))
                    : 
                    <span>No characters in this team yet.</span>}
                    
                    <CharacterSelectMenu selectedTeam={team} onCharacterChange={handleCallback}  />
                    </div>
                </div>
            ))
            : null}
        </div>
    : null }
    </>
    )
}