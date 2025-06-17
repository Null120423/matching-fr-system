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
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { RequestWithUser } from 'src/dto/request.dto';

// Định nghĩa các interface cho gRPC messages (lấy từ proto)
enum SwipeAction {
  LIKE = 0,
  PASS = 1,
}

interface UploadAvatarResponse {
  url: string;
}

interface RecordSwipeRequest {
  swiperId: string;
  swipedId: string;
  action: SwipeAction;
}

interface RecordSwipeResponse {
  success: boolean;
  match: boolean;
}

interface SendFriendRequestRequest {
  senderId: string;
  receiverId: string;
}

interface SendFriendRequestResponse {
  success: boolean;
  message: string;
}

// Định nghĩa Interface cho service gRPC
interface MatchingServiceGrpc {
  recordSwipe(data: RecordSwipeRequest): Observable<RecordSwipeResponse>;
  sendFriendRequest(
    data: SendFriendRequestRequest,
  ): Observable<SendFriendRequestResponse>;
}

interface UploadServiceGrpc {
  uploadAvatar(data: {
    userId: string;
    fileData: Buffer;
    contentType: string;
    originalFileName: string;
  }): Observable<UploadAvatarResponse>;
}

@Controller()
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

  @Post('users/:userId/swipe')
  @HttpCode(HttpStatus.OK)
  async createSwipe(
    @Param('userId') swipedId: string,
    @Body('action') action: SwipeAction,
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; match?: boolean }> {
    const swiperId = req.user.id;
    return lastValueFrom(
      this.matchingServiceGrpc.recordSwipe({ swiperId, swipedId, action }),
    );
  }

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
}
