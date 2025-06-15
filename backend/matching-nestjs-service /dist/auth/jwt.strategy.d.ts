import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/repositories';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    readonly configService: ConfigService;
    private readonly userRepo;
    constructor(configService: ConfigService, userRepo: UserRepository);
    validate(payload: {
        uid: string;
    }): Promise<any>;
}
export {};
