import React, { useNavigation } from '@react-navigation/native';
import { Modal, useTheme, VStack } from 'native-base';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr] = useState({ loading: false, message: null });
  const { colors } = useTheme();

  const navigation = useNavigation();

  const handleNewOrder = () => {
    if (!patrimony || !description) {
      return setErr({ loading: true, message: "Preencha todos os campos." });
    }

    setIsLoading(true);
    
    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Solicitação', "Resgistrado com sucesso.")
        navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        setErr({ loading: true, message: "Não foi possível registrar o pedido." });
      })

  };

  return (
    <VStack flex={1} p={6} bg={colors.gray[600]}>
      <Header title='Nova solicitação' />
      <Input
        placeholder="N° do Patrimônio"
        mt={4}
        onChangeText={setPatrimony}
      />
      <Input
        placeholder="Destrição do problema"
        mt={5}
        flex={1}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />
      <Button
        onPress={handleNewOrder}
        title='Cadastrar'
        mt={5}
        isLoading={isLoading}
      />
      {err.loading && (
        <Modal
          isOpen={err.loading}
          onClose={() => {
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
