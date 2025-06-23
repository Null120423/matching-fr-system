import { Observable } from 'rxjs';

export interface MatchingServiceGrpc {
  isFriend(payload: { userId: string; friendId: string }): Observable<{
    isFriend: boolean;
  }>;
}
