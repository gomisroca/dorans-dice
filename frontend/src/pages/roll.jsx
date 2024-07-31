import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Roll() {
  const navigate = useNavigate();
  const [showBigSelection, setShowBigSelection] = useState(true)

  return (
    <>
      {showBigSelection ?
      <div className="flex justify-center">
        <button 
        onClick={() => { navigate('characters'); setShowBigSelection(false); }} 
        className="border-r border-stone-600 bg-gradient-to-l hover:from-stone-600/40 transition duration-200">
          <img 
          className='hover:contrast-[1.1] transition duration-200'
          src='/static-data/ui-assets/char_roll.png' />
        </button>
        <button 
        onClick={() => { navigate('items'); setShowBigSelection(false); }}
        className="bg-gradient-to-r hover:from-stone-600/40 transition duration-200">
          <img
          className='hover:contrast-[1.1] transition duration-200'
          src='/static-data/ui-assets/item_roll.png' />
        </button>
      </div>
      :
      <div className='flex flex-col h-full m-auto'>
        <div className="flex justify-center">
          <button
          className='grid h-[50px] overflow-hidden content-center hover:contrast-[1.1] transition duration-200 text-stone-200 hover:text-white border border-transparent hover:border-sky-400'
          onClick={() => { navigate('characters'); setShowBigSelection(false); }}>
            <span className='absolute font-semibold text-4xl ml-10'>CHARACTERS</span>
            <img 
            className='bg-black transition duration-200'
            src='/static-data/ui-assets/char_roll.png' />
          </button>
          <button
          className='grid h-[50px] overflow-hidden content-center hover:contrast-[1.1] transition duration-200 text-stone-200 hover:text-white border border-transparent hover:border-sky-400'
          onClick={() => { navigate('items'); setShowBigSelection(false); }}>
            <span className='absolute font-semibold text-4xl ml-10'>ITEMS</span>
            <img
            className='bg-stone-600'
            src='/static-data/ui-assets/item_roll.png' />
          </button>
        </div>
        <Outlet />
      </div>
      }
    </>
  );
}