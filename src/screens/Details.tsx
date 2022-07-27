import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, Modal, ScrollView, Text, useTheme, VStack } from 'native-base';
import { Header } from '../components/Header';
import firestore from '@react-native-firebase/firestore';
import { dateFormat } from '../utils/firebaseDateFormat';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';
import Loading from '../components/Loading';
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from 'phosphor-react-native';
import { CardDetail } from '../components/CardDetail';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const { colors } = useTheme();
  const [detail, setDetail] = useState<OrderDetails>({} as OrderDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState();
  const [err, setErr] = useState({ loading: false, message: null });
  const route = useRoute();

  const navigation = useNavigation();

  const { orderId } = route.params as RouteParams;

  useEffect(() => {
    const handle = async () => {
      await firestore()
        .collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .get()
        .then((doc) => {
          const {
            patrimony,
            description,
            status,
            createdAt,
            closedAt,
            solution,
          } = doc.data();
  
          const closed = closedAt ? dateFormat(closedAt) : null;
          
          setDetail({
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(createdAt),
            closed,
            solution,
          });
        })
        setIsLoading(false);
    };

    setIsLoading(true);
    handle();
  }, []);

  const handleOrderClose = () => {
    if (!solution) {
      return setErr({ loading: true, message: 'Informa a solução para encerrar a solicitação' });
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada');
        navigation.goBack();
      })
      .catch((error) => {
        setErr({ loading: true, message: `Não foi possível encerrar\n${error}` });
      })
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack bg={colors.gray[700]} flex={1}>
      <Header title="Solicitação" />
      <HStack
        bg={colors.gray[500]}
        justifyContent="center"
        p={4}
      >
        {
          detail.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }
      </HStack>
      <Text
        fontSize="sm"
        color={detail.status === 'closed' ? colors.green[300] : colors.secondary[700]}
        ml={2}
        textTransform="uppercase"
      >
        {detail.status === 'closed' ? 'Finalizado' : 'Em andamento'}
      </Text>
      <ScrollView
        mx={5}
        showsVerticalScrollIndicator={false}
      >
        <CardDetail
          title="Equipamento"
          description={`Patrimônio ${detail.patrimony}`}
          icon={DesktopTower}
          footer={detail.when}
        />
        <CardDetail
          title="Descrição do problema"
          description={detail.description}
          icon={DesktopTower}
          footer={detail.when}
        />
        <CardDetail
          title="Solução"
          description={detail.solution}
          icon={CircleWavyCheck}
          footer={detail.closed && `Encerrado em ${detail.closed}`}
        >
          {detail.status === 'open' && (
            <Input
              placeholder="Descrição do problema"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </CardDetail>
      </ScrollView>
      {
        !detail.closed && (
          <Button
            title="Encerrar solicitação"
            onPress={handleOrderClose}
            m={5}
          />
        )
      }
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
