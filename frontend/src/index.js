import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from './pages/root';
import Error from './pages/error';
import Teams from './pages/teams';
import Roll from './pages/roll';
import ItemRolls from './components/roll/item-rolls';
import CharacterRolls from './components/roll/character-rolls';
import Collection from './pages/collection';
import Shop from './pages/shop';
import CharacterShop from './components/shop/character-shop';
import ItemShop from './components/shop/item-shop';
import ExtrasShop from './components/shop/extras-shop';
import Forge from './pages/forge';
import Battle from './pages/battle';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '/roll',
        element: <Roll />,
        children: [
          {
            path: 'characters',
            element: <CharacterRolls />,
          },
          {
            path: 'items',
            element: <ItemRolls />,
          },
        ]
      },      
      {
        path: '/shop',
        element: <Shop />,
        children: [
          {
            path: 'characters',
            element: <CharacterShop />,
          },
          {
            path: 'items',
            element: <ItemShop />,
          },
          {
            path: 'extras',
            element: <ExtrasShop />,
          },
        ]
      },
      {
        path: '/teams',
        element: <Teams />,
      },
      {
        path: '/collection',
        element: <Collection />,
      },
      {
        path: '/forge',
        element: <Forge />,
      },
      {
        path: '/battle',
        element: <Battle />,
      },
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
