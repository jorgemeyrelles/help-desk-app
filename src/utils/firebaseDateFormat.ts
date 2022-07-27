import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"

export const dateFormat = (timestamp: FirebaseFirestoreTypes.Timestamp) => {
  if (timestamp) {
    const date = new Date(timestamp.toDate());

    const day = date.toLocaleDateString('pt-BR');
    const hours = date.toLocaleTimeString('pt-BR');

    return `${day} às ${hours}`;
  }
}
