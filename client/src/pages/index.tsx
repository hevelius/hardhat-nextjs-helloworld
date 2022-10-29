import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { VStack, Heading, Box } from "@chakra-ui/layout";
import { Button, Input } from "@chakra-ui/react";
import { ethers } from "ethers";
import Install from "../components/Install";
import HelloWorld from "backend/artifacts/contracts/HelloWorld.sol/HelloWorld.json";
import { contractAddress } from "../utils/constants";

declare let window: any;

const Home: NextPage = () => {
  // TODO: move into context
  const [provider, setProvider] =
    React.useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = React.useState<ethers.providers.JsonRpcSigner>();

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
    provider !== undefined ? setSigner(provider.getSigner()) : null;
  }, [provider]);

  if (typeof window === "undefined") {
    return <></>;
  }

  if (!window.ethereum) {
    return <Install />;
  }

  /*React.useEffect(() => {
    if(!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    //client side code
    if(!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(currentAccount).then((result)=>{
      setBalance(ethers.utils.formatEther(result))
    })
    provider.getNetwork().then((result)=>{
      setChainId(result.chainId)
      setChainName(result.name)
    })

  },[currentAccount]);
*/
  const onClickConnect = () => {
    if (provider) {
      provider
        .send("eth_requestAccounts", [])
        .then((accounts) => {
          if (accounts.length > 0) setCurrentAccount(accounts[0]);
        })
        .catch((e) => console.log(e));
    }
  };

  const onClickDisconnect = () => {
    setCurrentAccount(undefined);
  };

  const onClickHelloWorld = async () => {
    const contract = new ethers.Contract(
      contractAddress,
      HelloWorld.abi,
      signer,
    );
    setHelloText(await contract.getHelloWorld());
  };

  const onClickSetHelloWorld = async () => {
    const contract = new ethers.Contract(
      contractAddress,
      HelloWorld.abi,
      signer,
    );
    await contract.setHelloWorld(value);
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
