import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import { ethers, utils } from "ethers";
import { ConfigService } from "@nestjs/config";
import * as tokenJson from "./assets/MyToken.json";
import { Hash } from "crypto";

dotenv.config();

//New ERC20 deployed
const CONTRACT_ADDRESS = "0x3f0Bb1f7A8E3dfcf41457F73f968c2B54afBfB88";

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    //this.provider = ethers.providers.getDefaultProvider("goerli");

    this.provider = new ethers.providers.AlchemyProvider(
      "goerli",
      process.env.ALCHEMY_API_KEY
    );

    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenJson.abi,
      this.provider
    );
    console.log("bootstrapped contract");
  }

  async requestTokens(address: string, amount: number): Promise<string> {
    const deployerPrivateKey = this.configService.get<string>("PRIVATE_KEY");
    const wallet = new ethers.Wallet(deployerPrivateKey).connect(this.provider);
    const tx = await this.contract
      .connect(wallet)
      .mint(address, amount);
    const receipt = await tx.wait();
    console.log(
      `${amount} tokens have been minted to ${wallet.address} at block ${receipt.blockNumber} with transactionhash ${receipt.transactionHash}`
    );
    return receipt.transactionHash;
  }

  getContractAddress(): string {
    return this.contract.address;
  }

  async getTotalSupply(): Promise<number> {
    const totalSupply = await this.contract.totalSupply();
    const tolalSupplyString = ethers.utils.formatEther(totalSupply);
    const totalSupplyNumber = parseFloat(tolalSupplyString);
    return totalSupplyNumber;
  }

  async getAllowance(from: string, to: string): Promise<number> {
    const allowance = await this.contract.allowance(from, to);
    const allowanceString = ethers.utils.formatEther(allowance);
    const allowanceNumber = parseFloat(allowanceString);
    return allowanceNumber;
  }

  async getTransactionStatus(hash: string): Promise<string> {
    const transaction = await this.provider.getTransaction(hash);
    const txReceipt = await transaction.wait();
    return txReceipt.status == 1 ? "Completed" : "Reverted";
  }
}
