import { useNavigation } from "@react-navigation/native";
import { Heading, HStack, IconButton, StyledProps, useTheme } from "native-base";
import { CaretLeft } from "phosphor-react-native";

type Props = StyledProps & {
  title: string;
}

export function Header({ title, ...rest }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg={colors.gray[600]}
      pb={6}
      pt={12}
      {...rest}
    >
      <IconButton
        onPress={handleGoBack}
        icon={<CaretLeft color={colors.gray[200]} size={24} />}
      />
      <Heading
        color={colors.gray[100]}
        textAlign="center"
        fontSize="lg"
        flex={1}
        ml={-6}
      >
        {title}
      </Heading>
    </HStack>
  );
}
