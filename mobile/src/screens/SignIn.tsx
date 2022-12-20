import { Center, Icon, Text } from 'native-base';
import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
/**
 * Componente referente a página de login da aplicação
 * @returns Tela de login
 */
export function SignIn() {
  const { signIn, user } = useAuth();
  console.log('DADOS DO USUÁRIO => ', user);

  return (
    <Center flex={1} bgColor="gray.900">

      <Logo width={212} height={74} />

      <Button
        title='Entrar com o Google'
        type='SECONDARY'
        leftIcon={<Icon as={Fontisto} name='google' color='white' size='md' />}
        mt={10}
        onPress={signIn}
      />

      <Text color='white' textAlign='center' p={7}>
        Não utilizamos nenhuma informação além {'\n'} do seu e-mail para criação de usa conta.
      </Text>

    </Center>
  )
}