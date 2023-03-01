import { createContext } from 'react';


interface contextProps{
     isMenuOpen: boolean;

     //Methods
     toggleSideMenu: () => void;
}

export const UIContext = createContext({} as contextProps)