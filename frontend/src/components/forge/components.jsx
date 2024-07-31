import { useEffect, useState } from "react";
import Menu from '@mui/material/Menu';
import ComponentsMenu from "./components-menu";

export default function ForgeComponents({ items, userComponents, userItems }) {
    const [selectedComponent, setSelectedComponent] = useState();

    // Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    function openMenu(event, component){
        setSelectedComponent(component)
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }
    function closeMenu(event){
        event.stopPropagation();
        setAnchorEl(null);
    }

    return (
    <>
        {userComponents ?
        <div className="flex flex-col border-r-4 border-sky-400 h-fit">
            <div className="flex flex-col gap-1">
            {userComponents.map(component => (
                    <div
                    key={component.id} 
                    onClick={e => {openMenu(e, component) }}
                    className='flex flex-col m-auto bg-stone-600 border-stone-600 border-4 items-center w-[100px] hover:border-sky-400 hover:contrast-[1.1] transition duration-200 cursor-pointer'>
                        <img
                            className='w-full'
                            alt={component.id} 
                            src={component.image}
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
        <ComponentsMenu selectedComponent={selectedComponent} items={items} userComponents={userComponents} userItems={userItems} />
    </Menu>
    </>
    );
}