import { UserEntity } from 'src/entities';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity;
  }
}
