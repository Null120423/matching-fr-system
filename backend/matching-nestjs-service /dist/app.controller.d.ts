import { AppService } from './app.service';
interface HelloRequest {
    name: string;
}
interface HelloResponse {
    message: string;
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    sayHello(data: HelloRequest): HelloResponse;
}
export {};
