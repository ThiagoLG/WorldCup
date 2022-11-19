import { Center, Text } from "native-base";
/**
 * Componente referente a página de login da aplicação
 * @returns Tela de login
 */
export function SignIn() {
  return (
    <Center flex={1} bgColor="gray.900">
      <Text color="white" fontSize={24} fontFamily="heading">
        SignIn
      </Text>
    </Center>
  )
}