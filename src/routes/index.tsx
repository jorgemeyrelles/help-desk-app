import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { SignIn } from "../screens/SignIn";
import { AppRoutes } from './app.routes';

export function Routes() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth()
      .onAuthStateChanged((resp) => {
        setUser(resp);
        setIsLoading(false);
      });
    console.log(subscriber);

    return subscriber;
  }, []);

  if (isLoading) {
    return <Loading />
  }
  console.log(!!user);
  
  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <SignIn />}
    </NavigationContainer>
  );
}
