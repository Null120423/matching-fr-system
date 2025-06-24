import { Observable } from 'rxjs';

export interface MatchingServiceGrpc {
  isFriend(payload: { userId: string; friendId: string }): Observable<{
    isFriend: boolean;
  }>;
  getDashboardMetrics(data: { requestUserId: string }): Observable<{
    totalFriends: number;
    totalSwipe: number;
    totalSwipeToday: number;
    totalNewFriendRequestsToday: number;
    totalMatchesToday: number;
    totalMatches: number;
  }>;
}

export interface AppointmentServiceGrpc {
  getDashboardMetrics(data: {
    requestUserId: string;
  }): Observable<{ totalAppointments: number; totalAppointmentToday: number }>;
}
