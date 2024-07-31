import { useNavigate } from "react-router-dom";

export default function NavbarLinks() {
    const navigate = useNavigate();

    return (
      <div className="flex flex-row gap-4 uppercase font-semibold text-stone-400">
        <div 
        className="flex gap-x-1 items-center hover:text-stone-200 transition duration-200 cursor-pointer border-b-4 border-stone-800 hover:border-sky-400"
        onClick={() => navigate(`/battle`)}>
          <img 
          alt="battle"
          className="w-[30px]" 
          src='/static-data/ui-assets/battle.png' />
          <span>Battle</span>
        </div>
        <div 
        className="flex gap-x-1 items-center hover:text-stone-200 transition duration-200 cursor-pointer border-b-4 border-stone-800 hover:border-sky-400"
        onClick={() => navigate(`/roll`)}>
          <img 
          alt="roll"
          className="w-[30px]" 
          src='/static-data/ui-assets/roll.png' />
          <span>Roll</span>
        </div>
        <div 
        className="flex gap-x-1 items-center hover:text-stone-200 transition duration-200 cursor-pointer border-b-4 border-stone-800 hover:border-sky-400"
        onClick={() => navigate(`/teams`)}>
          <img 
          alt="teams"
          className="w-[30px]" 
          src='/static-data/ui-assets/teams.png' />
          <span>Teams</span>
        </div>
        <div 
        className="flex gap-x-1 items-center hover:text-stone-200 transition duration-200 cursor-pointer border-b-4 border-stone-800 hover:border-sky-400"
        onClick={() => navigate(`/collection`)}>
          <img 
          alt="teams"
          className="w-[30px]" 
          src='/static-data/ui-assets/collection.png' />
          <span>Collection</span>
        </div>         
        <div 
        className="flex gap-x-1 items-center hover:text-stone-200 transition duration-200 cursor-pointer border-b-4 border-stone-800 hover:border-sky-400"
        onClick={() => navigate(`/forge`)}>
          <img 
          alt="forge"
          className="w-[30px]" 
          src='/static-data/ui-assets/forge.png' />
          <span>Forge</span>
        </div>
        <div 
        className="flex gap-x-1 items-center hover:text-stone-200 transition duration-200 cursor-pointer border-b-4 border-stone-800 hover:border-sky-400"
        onClick={() => navigate(`/shop`)}>
          <img 
          alt="shop"
          className="w-[30px]" 
          src='/static-data/ui-assets/shop.png' />
          <span>Shop</span>
        </div>
      </div>
    );
}