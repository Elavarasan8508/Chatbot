import { getUserData, removeUserData } from "./Storage"


export const isAuthenticated = () => {
    const token = localStorage.getItem("userToken");
    return token && token.length > 10; // just a basic validity check
};


export const logout = ()=>{
    removeUserData();
}