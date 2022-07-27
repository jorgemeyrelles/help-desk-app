import { VStack, Heading, Icon, useTheme, Modal } from 'native-base';
import React, { useEffect } from 'react';
import Logo from '../assets/logo_primary.svg';
import { Input } from '../components/Input';
import { Envelope, Key } from 'phosphor-react-native';
import { Button } from '../components/Button';
import { useState } from 'react';
import { schema } from '../validation/schema';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
// import { useNavigation } from '@react-navigation/native';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState({ loading: false, message: null });
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  // const navigation = useNavigation();

  useEffect(() => {
    const handle = async () => {
      try {
        await schema.validate({ email, password: pass });

        setLoading(false);
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          setLoading(true);
        }
      }
    };
    handle();
  }, [email, pass]);

  const handleClick = async () => {
    try {
      // await schema.validate({ email, password: pass });

      auth().signInWithEmailAndPassword(email, pass);
      setLoading(true);
      // Navigate to Home
      // navigation.navigate('home');
      
    } catch (error) {
      console.log(error.message);
      // if (error instanceof yup.ValidationError) {
      //   setErr({ loading: true, message: error.message });
      // }
      if (error.code === 'auth/user-not-found') {
        setErr({ loading: true, message: 'Usuário não cadastrado.' });
      }
      if (error.code === 'auth/wrong-password') {
        setErr({ loading: true, message: 'E-mail/senha inválido(s).' });
      }
      return setErr({ loading: true, message: 'Não foi possível acessar.' });
    }
  };

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta!
      </Heading>
      <Input
        placeholder="E-mail"
        mb={4}
        onChangeText={setEmail}
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />}  ml={4} />}
      />
      <Input
        placeholder="Senha"
        mb={8}
        onChangeText={setPass}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
      />
      <Button
        title="Olá, Jorge!!!"
        w="full"
        onPress={handleClick}
        isLoading={loading}
      />
      {err.loading && (
        <Modal
          isOpen={err.loading}
          onClose={() => {
            setEmail('');
            setPass('');
            setErr({ loading: false, message: null });
          }}
        >
          <Modal.Content maxWidth="350" maxH="212">
            <Modal.Body>
              {err.message}
            </Modal.Body>
            <Modal.Footer>
              <Button
                title='Continue'
                w="full"
                onPress={() => {
                  setEmail('');
                  setPass('');
                  setErr({ loading: false, message: null });
                }}
              />
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}
    </VStack>
  );
}

export { SignIn };
