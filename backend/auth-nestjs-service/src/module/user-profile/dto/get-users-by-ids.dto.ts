import { UserDTO } from 'src/module/auth/dto';

export class GetUsersByIdsDto {
  userIds: string[];
}

export class GetUsersByIdsResponseDto {
  users: UserDTO[];
}
