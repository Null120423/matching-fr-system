import { UserDTO } from 'src/modules/auth/dto';

export type RequestWithUser = Request & {
  user: UserDTO;
};
