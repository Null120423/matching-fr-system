import { BadRequestException, Controller } from '@nestjs/common';
import { GrpcLog, GrpcMethod } from 'src/decorators';
import { SwipeAction } from 'src/entities';
import { CreateSwipeDto, FriendRequest } from './dto/create-swipe.dto';
import { FriendRequestResponseDto } from './dto/fr-request-response.dto';
import { MatchingService } from './matching.service';
GrpcLog();
@Controller('matching')
// @UseGuards(JwtAuthGuard) // Chỉ dùng nếu service này tự xác thực
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @GrpcMethod('MatchingService', 'RecordSwipe')
  async recordSwipe(
    payload: CreateSwipeDto,
  ): Promise<{ success: boolean; match?: boolean }> {
    const action = payload.action.toLowerCase();
    if (!Object.values(SwipeAction).includes(action as SwipeAction)) {
      throw new BadRequestException('Invalid swipe action.');
    }
    const result = await this.matchingService.recordSwipe(
      payload.swiperId,
      payload.swipedId,
      action as SwipeAction,
    );
    return { success: true, match: result.match };
  }

  @GrpcMethod('MatchingService', 'SendFriendRequest')
  async sendFriendRequest(payload: {
    senderId: string;
    receiverId: string;
  }): Promise<{ success: boolean; message: string }> {
    const { receiverId, senderId } = payload;
    await this.matchingService.sendFriendRequest(senderId, receiverId);
    return { success: true, message: 'Friend request sent successfully.' };
  }
  @GrpcMethod('MatchingService', 'UpdateFriendRequestStatus')
  async updateFriendRequestStatus(payload: {
    id: string; // ID của yêu cầu kết bạn
    newStatus: any; // Trạng thái mới
    userId: string; // ID của người dùng hiện tại
  }): Promise<FriendRequest> {
    const { id: requestId, newStatus, userId } = payload;

    if (newStatus === 'accepted') {
      const res = await this.matchingService.acceptFriendRequest(
        requestId,
        userId,
      );
      // TODO: Gửi thông báo đến người gửi yêu cầu rằng lời mời đã được chấp nhận.
      // Gọi Notification Service qua gRPC hoặc HTTP (nội bộ).
      return res;
    } else if (newStatus === 'rejected') {
      const res = await this.matchingService.rejectFriendRequest(
        requestId,
        userId,
      );
      // TODO: Gửi thông báo đến người gửi yêu cầu rằng lời mời đã bị từ chối.
      return res;
    } else {
      throw new BadRequestException('Invalid status for friend request.');
    }
  }

  @GrpcMethod('MatchingService', 'GetFriendRequests')
  async getMyFriendRequests(payload: {
    userId: string;
    status: any;
  }): Promise<FriendRequestResponseDto> {
    return await this.matchingService.getFriendRequests(payload);
  }
}
