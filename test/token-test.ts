import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Upgradeable token", function () {
  async function deploy() {
    const [deployer] = await ethers.getSigners();
    const NFTFactory = await ethers.getContractFactory("MyToken");
    const token = await upgrades.deployProxy(
      NFTFactory,
      ["MyTokenName", "MTN"],
      {
        initializer: "initialize",
      }
    );

    return { token, deployer };
  }

  it("works", async function () {
    const { token, deployer } = await loadFixture(deploy);

    const mintTx = await token.safeMint(deployer.address, "123uriabcdfg");
    await mintTx.wait();

    expect(await token.balanceOf(deployer.address)).to.eq(1);

    const NFTFactoryV2 = await ethers.getContractFactory("MyTokenV2");
    const token2 = await upgrades.upgradeProxy(token, NFTFactoryV2);

    expect(await token2.balanceOf(deployer.address)).to.eq(1);
    expect(await token2.v2Function()).to.eq("v2");
  });
});
