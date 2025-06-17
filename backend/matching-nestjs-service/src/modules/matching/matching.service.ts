import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FriendRequestEntity,
  FriendRequestStatus,
  SwipeAction,
} from 'src/entities';
import {
  FriendRequestRepository,
  SwipeRepository,
} from 'src/repositories/index.repository';

// Để kiểm tra tồn tại của user, bạn cần giao tiếp với Auth Service
// import { ClientProxy } from '@nestjs/microservices';
// import { AUTH_SERVICE } from '../constants'; // Hoặc import từ auth.proto

@Injectable()
export class MatchingService {
  constructor(
    private readonly swipeRepository: SwipeRepository,
    private readonly friendRequestRepository: FriendRequestRepository,
    // @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy, // Nếu cần gọi auth service
  ) {}

  async recordSwipe(
    swiperId: string,
    swipedId: string,
    action: SwipeAction,
  ): Promise<{ match: boolean }> {
    if (swiperId === swipedId) {
      throw new BadRequestException('Cannot swipe on yourself.');
    }

    // Kiểm tra xem đã tồn tại swipe từ swiperId đến swipedId chưa
    const existingSwipe = await this.swipeRepository.findOne({
      where: { swiperId, swipedId },
    });

    if (existingSwipe) {
      // Nếu đã swipe, cập nhật hành động
      existingSwipe.action = action;
      await this.swipeRepository.save(existingSwipe);
    } else {
      // Tạo swipe mới
      const newSwipe = this.swipeRepository.create({
        swiperId,
        swipedId,
        action,
      });
      await this.swipeRepository.save(newSwipe);
    }

    let match = false;
    if (action === SwipeAction.LIKE) {
      // Kiểm tra xem người bị vuốt đã "like" lại người vuốt chưa
      const reverseSwipe = await this.swipeRepository.findOne({
        where: {
          swiperId: swipedId,
          swipedId: swiperId,
          action: SwipeAction.LIKE,
        },
      });

      if (reverseSwipe) {
        match = true;
        // TODO: Gửi thông báo match đến cả hai người dùng (thông qua Notification Service)
        // TODO: Tạo một cuộc trò chuyện mới (Chat Service)
        console.log(`🎉 MATCH! ${swiperId} and ${swipedId}`);
      }
    }
    return { match };
  }

  async sendFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequestEntity> {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send friend request to yourself.');
    }

    // Kiểm tra xem đã có yêu cầu kết bạn đang chờ xử lý hoặc đã là bạn bè chưa
    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { senderId, receiverId, status: FriendRequestStatus.PENDING },
        {
          senderId: receiverId,
          receiverId: senderId,
          status: FriendRequestStatus.PENDING,
        },
        { senderId, receiverId, status: FriendRequestStatus.ACCEPTED },
        {
          senderId: receiverId,
          receiverId: senderId,
          status: FriendRequestStatus.ACCEPTED,
        },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === FriendRequestStatus.PENDING) {
        throw new ConflictException('Friend request already pending.');
      } else if (existingRequest.status === FriendRequestStatus.ACCEPTED) {
        throw new ConflictException('Already friends.');
      }
    }

    const friendRequest = this.friendRequestRepository.create({
      senderId,
      receiverId,
      status: FriendRequestStatus.PENDING,
    });

    // TODO: Gửi thông báo yêu cầu kết bạn đến người nhận (thông qua Notification Service)
    return this.friendRequestRepository.save(friendRequest);
  }

  // Bạn có thể thêm các phương thức khác như acceptFriendRequest, rejectFriendRequest
  async acceptFriendRequest(
    requestId: string,
    userId: string,
  ): Promise<FriendRequestEntity> {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId },
    });
    if (!request) {
      throw new NotFoundException('Friend request not found.');
    }
    if (request.receiverId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to accept this request.',
      );
    }
    if (request.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('Friend request is not in pending status.');
    }

    request.status = FriendRequestStatus.ACCEPTED;
    // TODO: Gửi thông báo đã chấp nhận kết bạn đến người gửi
    return this.friendRequestRepository.save(request);
  }
}
