import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from 'src/dto/request.dto';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { MatchingService } from './matching.service';

@Controller('matching')
// @UseGuards(JwtAuthGuard) // Chỉ dùng nếu service này tự xác thực
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post(':userId/swipe')
  @HttpCode(HttpStatus.OK) // Trả về 200 OK cho các hành động không tạo tài nguyên
  async createSwipe(
    @Param('userId') swipedId: string, // Người được vuốt
    @Body() createSwipeDto: CreateSwipeDto,
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; match?: boolean }> {
    const swiperId = req.user['id']; // Người thực hiện vuốt
    const result = await this.matchingService.recordSwipe(
      swiperId,
      swipedId,
      createSwipeDto.action,
    );
    return { success: true, match: result.match };
  }

  @Post(':userId/friend-request')
  @HttpCode(HttpStatus.OK)
  async sendFriendRequest(
    @Param('userId') receiverId: string, // Người nhận yêu cầu
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; message: string }> {
    const senderId = req.user['id']; // Người gửi yêu cầu
    await this.matchingService.sendFriendRequest(senderId, receiverId);
    return { success: true, message: 'Friend request sent successfully.' };
  }

  // Bạn có thể thêm API để chấp nhận/từ chối lời mời kết bạn ở đây
  // @Put('friend-requests/:id/status')
  // async updateFriendRequestStatus(...)
}
