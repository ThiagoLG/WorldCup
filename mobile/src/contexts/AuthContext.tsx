//#region Imports
import { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSection from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
//#endregion

//#region Interfaces
/*--- Interfaces de tipagem ---*/
interface UserProps {
  name: string;
  avatarUrl: string
}

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}
/*-----------------------------*/
//#endregion

WebBrowser.maybeCompleteAuthSession();

//armazena informações de contexto
export const AuthContext = createContext({} as AuthContextDataProps);

//Exporta e permite o contexto ser utilizado por todas as demais atividades
export function AuthContextProvider({ children }: AuthProviderProps) {
  //#region States
  const [user, setUser] = useState<UserProps>({} as UserProps); //Estado para manter a informação do usuário logado
  const [isUserLoading, setIsUserLoading] = useState(false); //Estado para controlar se o login está em andamento
  //#endregion

  /*- Configurações para requisição de autentição com o google -*/
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '25263193492-quqft2dlm88s2050diatbjihggpgtbk3.apps.googleusercontent.com',
    redirectUri: AuthSection.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  /**
   * Função responsável por realizar o login na aplicação
   */
  async function signIn() {

    try {
      setIsUserLoading(true);
      await promptAsync();
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setIsUserLoading(false);
    }

  }

  async function signInWithGoogle(acess_token: string) {
    console.log('TOKEN DE AUTENTICAÇÃO ===> ', acess_token);
  }


  /*- Observa a atualização do valor da propriedade 'response' -*/
  useEffect(() => {
    if (response?.type === 'success' && response?.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isUserLoading,
        user
      }}>
      {children}
    </AuthContext.Provider>
  )
}