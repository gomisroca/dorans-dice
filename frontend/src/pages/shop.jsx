import { Outlet, useNavigate } from 'react-router-dom';

export default function Shop() {
  const navigate = useNavigate();

  return (
    <>
      <div className='flex flex-row h-full m-auto'>
        <div className="flex flex-col justify-center  border-r-4 border-sky-400 h-fit">
          <button
          className='grid h-[75px] w-[300px] items-center overflow-hidden content-center hover:contrast-[1.1] transition duration-200 text-stone-200 hover:text-white border-t border-b border-transparent hover:border-sky-400'
          onClick={() => navigate('characters')}>
            <span className='absolute font-semibold text-4xl ml-4'>CHARACTERS</span>
            <img 
            className='bg-black transition duration-200 align-middle'
            src='/static-data/ui-assets/char_roll.png' />
          </button>
          <button
          className='grid h-[75px] w-[300px] items-center overflow-hidden content-center hover:contrast-[1.1] transition duration-200 text-stone-200 hover:text-white border-t border-b border-transparent hover:border-sky-400'
          onClick={() => navigate('items')}>
            <span className='absolute font-semibold text-4xl ml-4'>ITEMS</span>
            <img
            className='bg-stone-600'
            src='/static-data/ui-assets/item_roll.png' />
          </button>
        </div>
        <Outlet />
      </div>
    </>
  );
}