
import LoginButton from "@/components/auth/LoginButton";
import {Box, Button, Spinner, Text, VStack} from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Box m={8}>
      <VStack>
        <Text>You are not authenticated.</Text>
        <LoginButton/>
      </VStack>
    </Box>
  );
}1