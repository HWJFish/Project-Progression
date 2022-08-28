import { createContext, useEffect, useState } from "react";

export const UserContext=createContext();

const KEY='user';

export const UserContextProvider=({children})=>{
    const [user,setUser]=useState(()=>{
        const storage=window.localStorage.getItem(KEY);
        return storage?JSON.parse(storage):null;
    })

    useEffect(()=>{
        window.localStorage.setItem(KEY,JSON.stringify(user));
    },[user])

    return <UserContext.Provider value={{user,setUser}}>
        {children}
    </UserContext.Provider>

}