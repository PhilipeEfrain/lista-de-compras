import { useRouter } from 'expo-router';
import { useEffect } from 'react';

// Este é um componente de redirecionamento
export default function TabsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a rota principal
    router.replace('/');
  }, []);

  return null;
}