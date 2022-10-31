import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { VStack, Heading, Box } from "@chakra-ui/layout";
import { Button, Input } from "@chakra-ui/react";
import { ethers } from "ethers";
import Install from "../components/Install";
import { HelloWorld__factory as HelloWorld } from "backend/typechain-types";
import { contractAddress } from "../utils/constants";

declare let window: any;

const Home: NextPage = () => {
  const [provider, setProvider] =
    React.useState<ethers.providers.Web3Provider>();

  const [helloText, setHelloText] = React.useState("");
  const [value, setValue] = React.useState("");
  const helloTextChange = (event: any) => setValue(event.target.value);

  const [currentAccount, setCurrentAccount] = React.useState<
    string | undefined
  >();

  React.useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
  }, []);

  React.useEffect(() => {
    console.log("RESULT");
  }, [helloText]);

  if (typeof window === "undefined") {
    return <></>;
  }

  if (!window.ethereum) {
    return <Install />;
  }

  const onClickConnect = () => {
    pipe(
      getProvider(),
      O.fold(console.error, (r) =>
        r
          .send("eth_requestAccounts", [])
          .then((accounts) => {
            if (accounts.length > 0) setCurrentAccount(accounts[0]);
          })
          .catch(E.toError),
      ),
    );
  };

  const getProvider = () => pipe(provider, O.fromNullable);

  const onClickDisconnect = () => {
    setCurrentAccount(undefined);
  };

  const onClickHelloWorld = async () => {
    pipe(
      getProvider(),
      O.map((_) => HelloWorld.connect(contractAddress, _)),
      O.chainNullableK((helloContract) => helloContract.getHelloWorld()),
      O.chainNullableK((_) => _.then((result) => setHelloText(result))),
    );
  };

  const onClickSetHelloWorld = async () => {
    pipe(
      getProvider(),
      O.map((_) => HelloWorld.connect(contractAddress, _.getSigner())),
      O.chainNullableK((helloContract) => helloContract.setHelloWorld(value)),
    );
  };

  return provider !== undefined ? (
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <Heading as="h4" size="md">
        Explore Web3 {currentAccount}
      </Heading>
      <VStack>
        <Box w="100%" my={4}>
          <Button type="button" w="100%" onClick={onClickConnect}>
            Connect
          </Button>
        </Box>
        {currentAccount && provider ? (
          <>
            <Box w="100%" my={4}>
              <Button type="button" w="100%" onClick={onClickHelloWorld}>
                getHelloWorld
              </Button>
            </Box>
            <Box w="100%" my={4}>
              <Input
                onChange={helloTextChange}
                placeholder="write your hello text"
                size="sm"
              />
              <Button type="button" w="100%" onClick={onClickSetHelloWorld}>
                setHelloWorld
              </Button>
            </Box>
            <Box w="100%" my={4}>
              Result: {helloText}
            </Box>
          </>
        ) : (
          <></>
        )}
      </VStack>
    </>
  ) : (
    <></>
  );
};

export default Home;
