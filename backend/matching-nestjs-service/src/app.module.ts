import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchingModule } from './modules/matching/matching.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [UploadsModule, MatchingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
