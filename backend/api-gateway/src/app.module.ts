import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CONSTANTS } from './contanst';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: CONSTANTS.JWT_EXPIRATION_TIME },
    }),
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [],
})
export class AppModule {}
