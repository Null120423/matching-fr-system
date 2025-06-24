import { Module } from '@nestjs/common';
import { AppointmentRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ScheduleService } from './schedule.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmExModule.forCustomRepository([AppointmentRepository]),
    AppointmentsModule,
  ],
  providers: [ScheduleService],
  controllers: [],
  exports: [ScheduleService],
})
export class ScheduleCustomModule {}
