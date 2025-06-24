import { Module } from '@nestjs/common';
import { AppointmentRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AppointmentRepository])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
