/*- Componentes de plugins e bibliotecas -*/
import { NativeBaseProvider, StatusBar } from "native-base";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto'

/*- Componentes, configurações e utilitários internos -*/
import { Loading } from './src/components/loading'
import { SignIn } from './src/screens/SignIn'
import { THEME } from './src/styles/theme'
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { New } from "./src/screens/New";
import { Pools } from "./src/screens/Pools";

/**
 * Componente principal do projeto, referente a página inicial
 * @returns Página inicial da aplicação
 */
export default function App() {

  /*- Controla o carregamento de fontes -*/
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>

      <AuthContextProvider>

        <StatusBar
          barStyle={"light-content"}
          backgroundColor="transparent"
          translucent
        />

        {fontsLoaded ? <SignIn /> : <Loading />}

      </AuthContextProvider >
    </NativeBaseProvider>
  );
}
