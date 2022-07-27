import React, { ReactNode } from 'react';
import { Box, HStack, Text, useTheme, VStack } from 'native-base';
import { IconProps } from 'phosphor-react-native';

type Props = {
  title: string;
  description: string;
  footer: string;
  icon: React.ElementType<IconProps>;
  children: ReactNode;
};

export function CardDetail({
  title,
  description,
  footer = null,
  icon: Icon,
  children = null,
}) {
  const { colors } = useTheme();

  return (
    <VStack
      bg={colors.gray[600]}
      p={5}
      mt={5}
      rounded="sm"
    >
      <HStack alignItems="center" mb={4}>
        <Icon color={colors.primary[700]} />
        <Text
          ml={2}
          color={colors.gray[300]}
          fontSize="sm"
          textTransform="uppercase"
        >
          {title}
        </Text>
      </HStack>
      {
        !!description && (
          <Text
            color={colors.gray[100]}
            fontSize="md"
          >
            {description}
          </Text>
        )
      }
      {children}
      {
        !!footer && (
          <Box
            borderBottomWidth={1}
            borderTopColor={colors.gray[400]}
            mt={3}
          >
            <Text mt={3} color={colors.gray[300]} fontSize="sm">
              {footer}
            </Text>
          </Box>
        )
      }
    </VStack>
  );
}
