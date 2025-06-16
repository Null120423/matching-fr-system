import { UserDTO } from 'src/auth/dto';

export type RequestWithUser = Request & {
  user: UserDTO;
};
