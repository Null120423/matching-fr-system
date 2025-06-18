// backend/api-gateway/src/matching-upload/matching-upload.controller.ts
import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { RequestWithUser } from 'src/dto/request.dto';
import {
  FriendRequest,
  FriendRequestStatus,
  MatchingServiceGrpc,
  SendFriendRequestRequest,
  SwipeAction,
  UploadServiceGrpc,
} from './dto';

@ApiTags('matching-upload')
@ApiBearerAuth()
@Controller('matching-upload')
export class MatchingUploadController {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50054',
      package: 'matchingupload',
      protoPath: join(__dirname, '../../../../proto/matchingupload.proto'),
    },
  })
  private readonly matchingUploadClient: ClientGrpc;
  private matchingServiceGrpc: MatchingServiceGrpc;
  private uploadServiceGrpc: UploadServiceGrpc;

  onModuleInit() {
    this.matchingServiceGrpc =
      this.matchingUploadClient.getService<MatchingServiceGrpc>(
        'MatchingService',
      );
    this.uploadServiceGrpc =
      this.matchingUploadClient.getService<UploadServiceGrpc>('UploadService');

    console.log(
      '[Mapped GRPC] UploadService methods:',
      Object.keys(this.uploadServiceGrpc),
    );

    console.log(
      '[Mapped GRPC] MatchingService methods:',
      Object.keys(this.matchingServiceGrpc),
    );
  }
  @ApiOperation({ summary: 'Record swipe between two users' })
  @ApiResponse({ status: 200, description: 'Swipe recorded successfully' })
  @Post('users/:userId/swipe')
  @HttpCode(HttpStatus.OK)
  async createSwipe(
    @Body()
    body: {
      action: SwipeAction;
    },
    @Param('userId') swipedId: string,
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; match?: boolean }> {
    const swiperId = req.user.id;
    return lastValueFrom(
      this.matchingServiceGrpc.recordSwipe({
        swiperId,
        swipedId,
        action: body.action,
      }),
    );
  }

  @ApiOperation({ summary: 'Send friend request between users' })
  @ApiBody({ type: SendFriendRequestRequest })
  @ApiResponse({ status: 200, description: 'Friend request sent' })
  @Post('users/:userId/friend-request')
  @HttpCode(HttpStatus.OK)
  async sendFriendRequest(
    @Param('userId') receiverId: string,
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; message: string }> {
    const senderId = req.user.id;
    return lastValueFrom(
      this.matchingServiceGrpc.sendFriendRequest({ senderId, receiverId }),
    );
  }
  @ApiOperation({ summary: 'Upload avatar for user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        contentType: { type: 'string', example: 'image/jpeg' },
        originalFileName: { type: 'string', example: 'avatar.jpg' },
        fileData: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('uploads/avatar')
  @UseInterceptors(FileInterceptor('file')) // 'file' là tên trường trong form-data
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<{ url: string }> {
    const userId = req.user.id;
    const response = await lastValueFrom(
      this.uploadServiceGrpc.uploadAvatar({
        userId,
        fileData: file.buffer,
        contentType: file.mimetype,
        originalFileName: file.originalname,
      }),
    );
    return { url: response.url };
  }

  @Put('users/friend-requests/:id/status') // Endpoint mới trong API Gateway
  @HttpCode(HttpStatus.OK)
  async updateFriendRequestStatus(
    @Param('id') requestId: string,
    @Body('newStatus') newStatus: FriendRequestStatus, // Nhận trạng thái mới từ client
    @Req() req: RequestWithUser,
  ): Promise<FriendRequest> {
    const userId = req.user.id; // Người dùng hiện tại
    return await lastValueFrom(
      this.matchingServiceGrpc.updateFriendRequestStatus({
        id: requestId,
        userId,
        newStatus,
      }),
    );
  }
}
