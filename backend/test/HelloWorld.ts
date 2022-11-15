import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloWorld", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployHelloWorld() {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const helloWorld = await HelloWorld.deploy();

    return { helloWorld };
  }

  describe("Deployment", function () {
    it("should returns HelloWorld string", async () => {
      const { helloWorld } = await loadFixture(deployHelloWorld);
      expect(await helloWorld.getHelloWorld()).equal("HelloWorld");
    });
    it("should setHelloWorld with string Hello Universe", async () => {
      const { helloWorld } = await loadFixture(deployHelloWorld);
      const helloUniverse = "Hello Universe";
      await helloWorld.setHelloWorld(helloUniverse);
      expect(await helloWorld.getHelloWorld()).equal("Hello Universe");
    });
  });
});
