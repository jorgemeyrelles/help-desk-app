import { Input as ImputComponent } from 'native-base';

export function Input({ ...rest }) {
  return (
    <ImputComponent
      bg="gray.700"
      h={14}
      size="md"
      borderWidth={0}
      fontSize="md"
      color="white"
      placeholderTextColor="gray.300"
      { ... rest }
    />
  );
}