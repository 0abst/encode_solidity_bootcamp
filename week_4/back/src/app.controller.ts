import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokensDTO } from './dtos/RequestTokensDTO';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/contract-address")
  getContractAddress(): { address: string } {
    return { address: this.appService.getContractAddress() };
  }

  @Get("/total-supply")
  async getTotalSupply(): Promise<number> {
    return await this.appService.getTotalSupply();
  }

  @Get("/allowance/")
  async getAllowance(
    @Query('from') from: string,
    @Query('to') to: string
  ): Promise<number> {
    return await this.appService.getAllowance(from, to);
  }

  @Get("transaction-status/")
  async getTransactionStatus(
    @Query('hash') hash: string
  ): Promise<string> {
    return await this.appService.getTransactionStatus(hash);
  }

  @Post("/request-tokens")
  async requestTokens(@Body() body: RequestTokensDTO): Promise<void> {
    await this.appService.requestTokens(body.address, body.amount);
  }
}
