/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CONSTANTS } from './contanst';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    JwtModule.register({
      secret: CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: CONSTANTS.JWT_EXPIRATION_TIME },
    }),
    PaymentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
