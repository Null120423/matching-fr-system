import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

// Interface khai báo các RPC tương ứng với Promise trả về
export interface IPaymentService {
  CreateTransaction(data: { userId: string; amount: number }): Promise<{
    transactionId: string;
    status: string;
    createdAt: string;
  }>;

  GenerateQR(data: { transactionId: string }): Promise<{
    qrUrl: string;
    qrCodeBase64: string;
  }>;

  HandlePaymentCallback(data: {
    transactionId: string;
    status: string;
  }): Promise<{
    success: boolean;
    message: string;
  }>;

  CheckTransactionStatus(data: { transactionId: string }): Promise<{
    transactionId: string;
    status: string;
    updatedAt: string;
  }>;
}

@Injectable()
export class PaymentService implements OnModuleInit {
  private paymentService: IPaymentService;

  constructor(@Inject('PAYMENT_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.paymentService =
      this.client.getService<IPaymentService>('PaymentService');
  }

  // Trả về Promise thay vì Promise
  async createTransaction(
    userId: string,
    amount: number,
  ): Promise<{ transactionId: string; status: string; createdAt: string }> {
    return await this.paymentService.CreateTransaction({ userId, amount });
  }

  async generateQR(
    transactionId: string,
  ): Promise<{ qrUrl: string; qrCodeBase64: string }> {
    return await this.paymentService.GenerateQR({ transactionId });
  }

  async handlePaymentCallback(
    transactionId: string,
    status: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.paymentService.HandlePaymentCallback({
      transactionId,
      status,
    });
  }

  async checkTransactionStatus(
    transactionId: string,
  ): Promise<{ transactionId: string; status: string; updatedAt: string }> {
    return await this.paymentService.CheckTransactionStatus({ transactionId });
  }
}
