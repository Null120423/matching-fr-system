import { BadRequestException, Controller } from '@nestjs/common';
import { GrpcLog, GrpcMethod } from 'src/decorators';
import { CreateSwipeDto } from './dto/create-swipe.dto';
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
    const result = await this.matchingService.recordSwipe(
      payload.swiperId,
      payload.swipedId,
      payload.action,
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

  async updateFriendRequestStatus(payload: {
    id: string; // ID của yêu cầu kết bạn
    newStatus: 'accepted' | 'rejected'; // Trạng thái mới
    userId: string; // ID của người dùng hiện tại
  }): Promise<{ success: boolean; message: string }> {
    const { id: requestId, newStatus, userId } = payload;
    if (newStatus === 'accepted') {
      await this.matchingService.acceptFriendRequest(requestId, userId);
      // TODO: Gửi thông báo đến người gửi yêu cầu rằng lời mời đã được chấp nhận.
      // Gọi Notification Service qua gRPC hoặc HTTP (nội bộ).
      return {
        success: true,
        message: 'Friend request accepted successfully.',
      };
    } else if (newStatus === 'rejected') {
      await this.matchingService.rejectFriendRequest(requestId, userId);
      // TODO: Gửi thông báo đến người gửi yêu cầu rằng lời mời đã bị từ chối.
      return {
        success: true,
        message: 'Friend request rejected successfully.',
      };
    } else {
      throw new BadRequestException('Invalid status for friend request.');
    }
  }
}
