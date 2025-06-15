import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('Payment') // Group trong Swagger UI
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('create-transaction')
  @ApiOperation({ summary: 'Tạo giao dịch mới' })
  @ApiQuery({ name: 'userId', type: String, example: 'user123' })
  @ApiQuery({ name: 'amount', type: Number, example: 100000 })
  @ApiResponse({
    status: 200,
    description: 'Transaction created successfully',
    schema: {
      example: {
        transactionId: 'txn_001',
        status: 'PENDING',
        createdAt: '2025-06-11T13:45:00.000Z',
      },
    },
  })
  async createTransaction(
    @Query('userId') userId: string,
    @Query('amount') amount: number,
  ) {
    return await this.paymentService.createTransaction(userId, Number(amount));
  }

  @Get('generate-qr')
  @ApiOperation({ summary: 'Tạo mã QR cho giao dịch' })
  @ApiQuery({ name: 'transactionId', type: String, example: 'txn_001' })
  @ApiResponse({
    status: 200,
    description: 'QR generated successfully',
    schema: {
      example: {
        qrUrl: 'https://example.com/qr/txn_001',
        qrCodeBase64: 'data:image/png;base64,...',
      },
    },
  })
  async generateQR(@Query('transactionId') transactionId: string) {
    return await this.paymentService.generateQR(transactionId);
  }

  @Get('handle-callback')
  @ApiOperation({ summary: 'Xử lý callback thanh toán' })
  @ApiQuery({ name: 'transactionId', type: String, example: 'txn_001' })
  @ApiQuery({ name: 'status', type: String, example: 'SUCCESS' })
  @ApiResponse({
    status: 200,
    description: 'Callback handled',
    schema: {
      example: {
        success: true,
        message: 'Payment updated successfully',
      },
    },
  })
  async handlePaymentCallback(
    @Query('transactionId') transactionId: string,
    @Query('status') status: string,
  ) {
    return await this.paymentService.handlePaymentCallback(
      transactionId,
      status,
    );
  }

  @Get('check-status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái giao dịch' })
  @ApiQuery({ name: 'transactionId', type: String, example: 'txn_001' })
  @ApiResponse({
    status: 200,
    description: 'Transaction status returned',
    schema: {
      example: {
        transactionId: 'txn_001',
        status: 'SUCCESS',
        updatedAt: '2025-06-11T13:55:00.000Z',
      },
    },
  })
  async checkTransactionStatus(@Query('transactionId') transactionId: string) {
    return await this.paymentService.checkTransactionStatus(transactionId);
  }
}
