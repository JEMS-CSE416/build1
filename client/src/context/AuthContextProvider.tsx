import React, { useContext, useState } from "react";
import { createContext } from "react";
import { User } from "../utils/models/User";

interface AuthState {
  user?: User
}

export const AuthContext = createContext<AuthState>({});
export const SetAuthContext = createContext((auth: any) => (auth));
export function useAuthContext() {
  return useContext(AuthContext);
}
export function useSetAuthContext() {
  return useContext(SetAuthContext);
}



/*
 * AuthContextProvider component.
 * Children will attempt to access the state of the auth with
 *    const authState = useAuthContext()
 * Children will attempt to change state through setstaet
 *    const setAuthState = useSetAuthContext()
 *    setState({
 *      user: {}
 *    })
 */
export function AuthContextProvider(props: {children: React.ReactNode}) {
  // auth state begins null
  const [authState, setAuthState] = useState({});

  function setAuthStateWrapper(props: any){
    console.log("in wrpaper", props);
    setAuthState(props);
  }

  return (
    <AuthContext.Provider value={authState}>
      <SetAuthContext.Provider value={(json: any) => setAuthStateWrapper(json)}>
        {props.children}
      </SetAuthContext.Provider>
    </AuthContext.Provider>
  );
}
