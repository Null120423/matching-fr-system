import { Module } from '@nestjs/common';
import {
  FriendRequestRepository,
  SwipeRepository,
} from 'src/repositories/index.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      SwipeRepository,
      FriendRequestRepository,
    ]),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
