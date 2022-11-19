import { Center, Spinner } from 'native-base'
/**
 * Componente para sinalizar o carregamento de componentes/telas
 * @returns Loader em formato de spinner
 */
export function Loading() {
  return (
    <Center flex={1} bg="gray.900">
      <Spinner color="yellow.500"></Spinner>
    </Center>
  )
}