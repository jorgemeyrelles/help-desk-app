import { useNavigation } from '@react-navigation/native';
import {
  Center,
  FlatList,
  Heading,
  HStack,
  IconButton,
  Modal,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import Logo from '../assets/logo_secondary.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { dateFormat } from '../utils/firebaseDateFormat';
import Loading from '../components/Loading';

export function Home() {
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const navigation = useNavigation();
  const [err, setErr] = useState({ loading: false, message: null });

  const [orders, setOreders] = useState<OrderProps[]>([{
    id: '1saljdhoiwe109',
    patrimony: '15984565-56654',
    when: (new Date()).toISOString(),
    status: 'open',
  },
  {
    id: '1saljdhoiwe109',
    patrimony: '15984565-56654',
    when: (new Date()).toISOString(),
    status: 'closed',
  },
  {
    id: '1saljdhoiwe109',
    patrimony: '15984565-56654',
    when: (new Date()).toISOString(),
    status: 'closed',
  },
  {
    id: '1saljdhoiwe109',
    patrimony: '15984565-56654',
    when: (new Date()).toISOString(),
    status: 'open',
  },
  {
    id: '1saljdhoiwe109',
    patrimony: '15984565-56654',
    when: (new Date()).toISOString(),
    status: 'open',
  },
  {
    id: '1saljdhoiwe109',
    patrimony: '15984565-56654',
    when: (new Date()).toISOString(),
    status: 'open',
  }
  ]);

  useEffect(() => {
    setIsLoading(true);
  
    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const {
            patrimony,
            description,
            status,
            createdAt,
          } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(createdAt),
          }
        });
        setOreders(data);
        setIsLoading(false);
      })

      return subscriber;
  }, [statusSelected]);

  const handleNav =() => {
    navigation.navigate('register');
  };

  const handleDetail = (orderId: string) => {
    navigation.navigate('details', { orderId });
  };

  const handleLogOut = () => {
    auth()
      .signOut()
      .catch((error) => {
        setErr({ loading: true, message: `Não foi possível sair.\n${error}` })
      });
  };

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          onPress={handleLogOut}
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading
            color={colors.gray[100]}
          >
            Meus chamados
          </Heading>
          <Text
            color={colors.gray[200]}
          >
            {orders.length}
          </Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            title='Em andamento'
            type='open'
            isActive={statusSelected === 'open'}
            onPress={() => setStatusSelected('open')}
          />
          <Filter
            title='Finalizados'
            type='closed'
            isActive={statusSelected === 'closed'}
            onPress={() => setStatusSelected('closed')}
          />
        </HStack>
        {isLoading ? <Loading /> : (
          <FlatList
            data={orders.filter((e) => e.status === statusSelected)}
            keyExtractor={(item) => `${item.id}-${Math.random()*10}`}
            renderItem={({item}) => <Order data={item} onPress={() => handleDetail(item.id)} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text
                  color={colors.gray[300]}
                  fontSize="xl"
                  mt={6}
                  textAlign="center"
                >
                  Você ainda não possui{'\n'}
                  solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                </Text>
              </Center>
            )}
          />
        )}
        <Button
          onPress={handleNav}
          title='Nova Solicitação'
        />
      </VStack>
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
