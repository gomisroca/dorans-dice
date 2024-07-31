import axios from "axios";
import { useEffect, useState } from "react";

import ForgeComponents from "../components/forge/components";
import ForgeCraftables from "../components/forge/craftables";
import { useUser } from "../contexts/UserContext";

export default function Forge() {
    const { user, refreshUser } = useUser();
    const [items, setItems] = useState();

    const [userComponents, setUserComponents] = useState();
    const [userItems, setUserItems] = useState();

    useEffect(() => {
        if(user && items){
            let components = [];
            let user_items = [];

            for (const item of user.items) {
                if (item.into_items){
                    item.into = []
                    for(const into of item.into_items){
                        let into_item = items.find((el) => el.riot_id === into)
                        if (into_item) {
                            item.into.push(into_item)
                        }
                    }
                    components.push(item);
                }
                user_items.push(item);
            }
            
            setUserComponents(components);
            setUserItems(user_items);
        }
    }, [user, items]);

    useEffect(() => {
        if (user) {
            axios.get('gacha/items/')
            .then(res => {
                setItems(res.data)
            })
            .catch(error => {
                if(error.response && error.response.status === 401){
                    refreshUser();
                }
            })
        }
    }, [user])

    return (
    <>
    <div className='flex flex-row h-full m-auto'>
        <ForgeComponents items={items} userComponents={userComponents} userItems={userItems} />
        <ForgeCraftables items={items} userComponents={userComponents} userItems={userItems} />
    </div>
    </>
    );
}