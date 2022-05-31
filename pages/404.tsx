import React from "react";
import type { NextPage } from "next";
import { VStack, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import Head from "next/head";

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404</title>
        <meta name="description" content="" />
      </Head>
      <VStack w="100vw" h="100vh" justifyContent="center" spacing="8">
        <Text>You are lost in space!</Text>
        <Link href="/">
          <Button size="lg" fontSize="sm" borderRadius={10}>
            Go back to home
          </Button>
        </Link>
      </VStack>
    </>
  );
};

export default NotFoundPage;
