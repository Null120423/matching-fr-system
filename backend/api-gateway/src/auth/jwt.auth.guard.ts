/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CONSTANTS } from 'src/contanst';
import { PUBLIC_ROUTES } from 'src/public.routes';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  JWT_SECRET = CONSTANTS.JWT_SECRET;
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const { url, method } = request;

    const isPublic = PUBLIC_ROUTES.some(
      (r) => CONSTANTS.PREFIX_API + r.path === url && r.method === method,
    );

    if (isPublic) return true;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.JWT_SECRET,
      });
      request.user = payload;
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
