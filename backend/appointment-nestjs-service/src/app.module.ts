import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ScheduleCustomModule } from './modules/schedule/schedule.module';

@Module({
  imports: [AppointmentsModule, ScheduleCustomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
