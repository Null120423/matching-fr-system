import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';

import { RequestWithUser } from 'src/dto/request.dto';
import { GetUsersDiscoverDto, UpdateUserProfileDto } from './dto';

// Swagger imports
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDTO } from '../auth/dto';

interface UserProfileServiceGrpc {
  getMyProfile(data: { userId: string }): Observable<UserDTO>;
  updateUserProfile(
    data: UpdateUserProfileDto & {
      userId: string;
    },
  ): Observable<UserDTO>;
  getUserById(data: { userId: string }): Observable<UserDTO>;
  discoverUsers(
    data: GetUsersDiscoverDto & { currentUserId: string },
  ): Observable<{ users: UserDTO[] }>;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, '../../../../proto/auth.proto'),
      url: '0.0.0.0:50052',
    },
  })
  private readonly authClient: ClientGrpc;
  private userProfileServiceGrpc: UserProfileServiceGrpc;

  onModuleInit() {
    this.userProfileServiceGrpc =
      this.authClient.getService<UserProfileServiceGrpc>('UserProfileService');
    console.log(
      '[Mapped GRPC] UserProfileService methods:',
      Object.keys(this.userProfileServiceGrpc),
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile returned',
    type: UserDTO,
  })
  async getMyProfile(@Req() req: RequestWithUser): Promise<UserDTO> {
    const userId = req.user.id;
    return lastValueFrom(this.userProfileServiceGrpc.getMyProfile({ userId }));
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiParam({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Updated user profile',
    type: UserDTO,
  })
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @Req() req: RequestWithUser,
  ): Promise<UserDTO> {
    const currentUserId = req.user.id;
    if (userId !== currentUserId) {
      throw new Error('Forbidden: You can only update your own profile.');
    }
    return lastValueFrom(
      this.userProfileServiceGrpc.updateUserProfile({
        userId,
        ...updateUserProfileDto,
      }),
    );
  }

  @Get('discover')
  @ApiOperation({ summary: 'Discover users with filters' })
  @ApiQuery({ name: 'minAge', required: false, type: Number })
  @ApiQuery({ name: 'maxAge', required: false, type: Number })
  @ApiQuery({ name: 'gender', required: false, type: String })
  @ApiQuery({ name: 'activities', required: false, type: [String] })
  @ApiResponse({
    status: 200,
    description: 'List of matched users',
    type: [UserDTO],
  })
  async discoverUsers(
    @Query() filters: GetUsersDiscoverDto,
    @Req() req: RequestWithUser,
  ): Promise<UserDTO[]> {
    const currentUserId = req?.user?.id;
    return lastValueFrom(
      this.userProfileServiceGrpc.discoverUsers({
        ...filters,
        currentUserId,
      }),
    ).then((response) => {
      return response.users;
    });
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID of the user to fetch',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile found',
    type: UserDTO,
  })
  async getUserById(
    @Param('userId') userId: string,
  ): Promise<UserDTO | undefined> {
    return lastValueFrom(this.userProfileServiceGrpc.getUserById({ userId }));
  }
}
