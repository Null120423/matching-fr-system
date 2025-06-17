import { AppointmentEntity } from 'src/entities';
import { CustomRepository } from 'src/typeorm/typeorm-decorater';
import { Repository } from 'typeorm';

@CustomRepository(AppointmentEntity)
export class AppointmentRepository extends Repository<AppointmentEntity> {}
