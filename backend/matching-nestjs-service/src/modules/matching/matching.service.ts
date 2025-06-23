import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { UserDto } from 'src/dto';
import {
  FriendRequestEntity,
  FriendRequestStatus,
  SwipeAction,
  SwipeEntity,
} from 'src/entities';
import { UserProfileServiceGrpc } from 'src/grpc';
import { toDict } from 'src/helpers';
import {
  FriendRequestRepository,
  SwipeRepository,
} from 'src/repositories/index.repository';
import { FriendRequest } from './dto/create-swipe.dto';
import { FriendRequestResponseDto } from './dto/fr-request-response.dto';
import {
  NotificationCreate,
  NotificationServiceGrpc,
} from './dto/notification.dto';

@Injectable()
export class MatchingService {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: 'auth',
      protoPath: join(__dirname, '../../../../proto/auth.proto'),
    },
  })
  private readonly client: ClientGrpc;

  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: 'notification',
      protoPath: join(__dirname, '../../../../proto/notification.proto'),
    },
  })
  private readonly clientNotification: ClientGrpc;

  private userService: UserProfileServiceGrpc;
  private notificationService: NotificationServiceGrpc;

  onModuleInit() {
    this.userService =
      this.client.getService<UserProfileServiceGrpc>('UserProfileService');
    this.notificationService =
      this.clientNotification.getService<NotificationServiceGrpc>(
        'NotificationService',
      );

    console.log(
      '[Mapped GRPC] userService methods:',
      Object.keys(this.userService),
    );
    console.log(
      '[Mapped GRPC] notificationService methods:',
      Object.keys(this.notificationService),
    );
  }
  constructor(
    private readonly swipeRepository: SwipeRepository,
    private readonly friendRequestRepository: FriendRequestRepository,
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
      where: { swiperId: swiperId, swipedId },
    });

    // get user info
    const user = await lastValueFrom(
      this.userService.getUserById({ userId: swipedId }),
    ).then((res) => res);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (existingSwipe) {
      // Nếu đã swipe, cập nhật hành động
      existingSwipe.action = SwipeAction[action];
      await this.swipeRepository.save(existingSwipe);
    } else {
      // Tạo swipe mới
      const newSwipe = new SwipeEntity();
      newSwipe.swiperId = swiperId;
      newSwipe.swipedId = swipedId;
      newSwipe.action = action;
      await this.swipeRepository.insert(newSwipe);
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
        const notificationBody: NotificationCreate = {
          title: 'New Match!',
          content: `You have a new match with ${user.username}!`,
          type: 'MATCH',
          userId: swipedId,
          expoToken: user.expoToken,
        };
        await this.createNotification(notificationBody);
        // TODO: Tạo một cuộc trò chuyện mới (Chat Service)
        console.log(`🎉 MATCH! ${swiperId} and ${swipedId}`);
      } else {
        const notificationBody: NotificationCreate = {
          title: 'New Swipe',
          content: `${user.username} has swiped right on you!`,
          type: 'SWIPE',
          userId: swipedId,
          expoToken: user.expoToken,
        };
        await this.createNotification(notificationBody);
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

    const user = await lastValueFrom(
      this.userService.getUserById({ userId: receiverId }),
    ).then((res) => res);
    if (!user) {
      throw new NotFoundException('Receiver user not found.');
    }

    // notification
    const notificationBody: NotificationCreate = {
      title: 'Friend Request',
      content: `${user.username} has sent you a friend request.`,
      type: 'FRIEND_REQUEST',
      userId: receiverId,
      expoToken: user.expoToken,
    };
    await this.createNotification(notificationBody);

    const friendRequest = this.friendRequestRepository.create({
      senderId,
      receiverId,
      status: FriendRequestStatus.PENDING,
    });

    // TODO: Gửi thông báo yêu cầu kết bạn đến người nhận (thông qua Notification Service)
    console.log(`Friend request sent from ${senderId} to ${receiverId}`);
    const senderUser = await lastValueFrom(
      this.userService.getUserById({ userId: senderId }),
    ).then((res) => res);
    if (!senderUser) {
      throw new NotFoundException('Sender user not found.');
    }
    const notificationBodySender: NotificationCreate = {
      title: 'Friend Request Sent',
      content: `You have sent a friend request to ${senderUser.username}.`,
      type: 'FRIEND_REQUEST_SENT',
      userId: senderId,
      expoToken: senderUser.expoToken,
    };
    await this.createNotification(notificationBodySender);
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
    const senderUser = await lastValueFrom(
      this.userService.getUserById({ userId: request.senderId }),
    ).then((res) => res);
    if (!senderUser) {
      throw new NotFoundException('Sender user not found.');
    }
    // TODO: Gửi thông báo đã chấp nhận kết bạn đến người gửi
    const notificationBody: NotificationCreate = {
      title: 'Friend Request Accepted',
      content: `${senderUser.username} has accepted your friend request.`,
      type: 'FRIEND_REQUEST_ACCEPTED',
      userId: request.senderId,
      expoToken: senderUser.expoToken,
    };
    await this.createNotification(notificationBody);
    return this.friendRequestRepository.save(request);
  }

  async rejectFriendRequest(
    requestId: string,
    userId: string,
  ): Promise<FriendRequest> {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId },
    });
    if (!request) {
      throw new NotFoundException('Friend request not found.');
    }
    if (request.receiverId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to reject this request.',
      );
    }
    if (request.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('Friend request is not in pending status.');
    }

    request.status = FriendRequestStatus.REJECTED;
    const senderUser = await lastValueFrom(
      this.userService.getUserById({ userId: request.senderId }),
    ).then((res) => res);
    if (!senderUser) {
      throw new NotFoundException('Sender user not found.');
    }
    // TODO: Gửi thông báo đã từ chối kết bạn đến người gửi
    const notificationBody: NotificationCreate = {
      title: 'Friend Request Rejected',
      content: `${senderUser.username} has rejected your friend request.`,
      type: 'FRIEND_REQUEST_REJECTED',
      userId: request.senderId,
      expoToken: senderUser.expoToken,
    };
    await this.createNotification(notificationBody);
    return this.friendRequestRepository.save(request);
  }

  /** get my friends request list */
  async getFriendRequests(data: {
    userId: string;
    status: any;
  }): Promise<FriendRequestResponseDto> {
    const result: any = await this.friendRequestRepository.find({
      where: { receiverId: data.userId, status: data.status },
    });

    const userIds = result.map((request) => request.senderId);

    const users = await lastValueFrom(
      this.userService.getListUsersByIds({
        userIds: userIds,
      }),
    ).then((res) => {
      return res.users;
    });

    const dictUserById = toDict(users || [], 'id');

    for (const request of result) {
      request.sendRequestPerson = dictUserById[request.senderId];
    }

    return {
      requests: result || [],
    };
  }

  /** create notification */
  private async createNotification(body: NotificationCreate): Promise<void> {
    if (!body.userId) {
      throw new BadRequestException('User ID is required for notification.');
    }
    const notification = await lastValueFrom(
      this.notificationService.createNotification(body),
    );
    if (!notification) {
      throw new ConflictException('Failed to create notification.');
    }
  }
  /** load list current friend of user  */
  async getCurrentFriends(payload: { userId: string }): Promise<{
    friends: UserDto[];
    total: number;
  }> {
    const userId = payload.userId;
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    const friendRequests = await this.friendRequestRepository.find({
      where: [
        { senderId: userId, status: FriendRequestStatus.ACCEPTED },
        { receiverId: userId, status: FriendRequestStatus.ACCEPTED },
      ],
    });

    const friendIds = friendRequests.map((request) =>
      request.senderId === userId ? request.receiverId : request.senderId,
    );

    const friends = await lastValueFrom(
      this.userService.getListUsersByIds({ userIds: friendIds }),
    ).then((res) => res.users);

    return {
      friends: friends || [],
      total: friends.length,
    };
  }
}
