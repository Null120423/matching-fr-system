export class GetDashboardMetricsResponse {
  totalFriends: number;
  totalSwipe: number;
  totalSwipeToday: number;
  totalNewFriendRequestsToday: number;
  totalMatchesToday: number;
  totalMatches: number;
}

export class GetDashboardMetricsRequest {
  requestUserId: string;
}
