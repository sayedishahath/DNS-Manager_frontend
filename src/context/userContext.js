// context/userContext.js
import { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const initialState = {
  loggedIn: false,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, loggedIn: true };
    case 'LOGOUT':
      return { ...state, loggedIn: false };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
