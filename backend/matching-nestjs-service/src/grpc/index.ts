import { Observable } from 'rxjs';
import { UserDto } from 'src/dto';

export interface UserProfileServiceGrpc {
  getListUsersByIds(payload: { userIds: string[] }): Observable<{
    users: UserDto[];
  }>;
  getUserById(data: { userId: string }): Observable<UserDto>;
}
