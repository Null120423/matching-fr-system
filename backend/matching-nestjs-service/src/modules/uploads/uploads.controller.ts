// backend/matching-upload-nestjs-service/src/uploads/uploads.controller.ts
import { Controller } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express'; // Loại bỏ: Dành cho HTTP file upload
import { RpcException } from '@nestjs/microservices'; // Thêm để xử lý lỗi gRPC
import { GrpcLog, GrpcMethod } from 'src/decorators'; // Giữ lại: Decorator gRPC custom
import { UploadsService } from './uploads.service';
// Giả định các kiểu dữ liệu này được tạo ra từ file .proto của bạn
// Bạn cần đảm bảo đã chạy công cụ tạo mã từ .proto (ví dụ: `protoc` hoặc NestJS build process)
// và chúng có sẵn để import. Đường dẫn import có thể khác tùy cấu hình dự án của bạn.
interface UploadAvatarRequest {
  userId: string;
  fileData: Buffer; // bytes trong proto sẽ là Buffer trong Node.js
  contentType: string;
  originalFileName: string;
}

interface UploadAvatarResponse {
  url: string;
}

GrpcLog(); // Giữ lại decorator custom
@Controller('uploads') // Giữ lại: Controller decorator của NestJS
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @GrpcMethod('UploadService', 'UploadAvatar') // Giữ lại: Chỉ định phương thức gRPC
  async uploadAvatar(
    // Tham số đầu tiên là payload gRPC được gửi từ Gateway
    data: UploadAvatarRequest,
    // Không có tham số nào khác như @UploadedFile, @Req cho gRPC
  ): Promise<UploadAvatarResponse> {
    const fileBuffer = data.fileData; // Dữ liệu file là Buffer
    const contentType = data.contentType;
    const originalFileName = data.originalFileName;

    // Trong môi trường gRPC, bạn cần tự thực hiện validation (nếu cần)
    // Ví dụ: kiểm tra kích thước, loại file
    const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    if (fileBuffer.byteLength > MAX_FILE_SIZE) {
      throw new RpcException({
        code: 3, // INVALID_ARGUMENT (gRPC status code)
        message: 'File size exceeds limit (5MB).',
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new RpcException({
        code: 3, // INVALID_ARGUMENT
        message: 'Unsupported file type. Only JPG, JPEG, PNG, GIF are allowed.',
      });
    }

    // `UploadsService.uploadFile` hiện đang nhận Express.Multer.File.
    // Để tương thích, chúng ta sẽ tạo một object giả lập cấu trúc đó.
    // Tốt nhất là refactor UploadsService.uploadFile để nhận trực tiếp Buffer và mimetype.
    const fileLikeObject: Express.Multer.File = {
      fieldname: 'file',
      originalname: originalFileName,
      encoding: '7bit', // Giá trị mặc định
      mimetype: contentType,
      size: fileBuffer.byteLength,
      buffer: fileBuffer,
      stream: null as any, // Không cần stream cho buffer
      destination: '', // Không dùng
      filename: '', // Sẽ được service tạo
      path: '', // Không dùng
    };

    try {
      const url = await this.uploadsService.uploadFile(fileLikeObject);
      // Trả về đối tượng phản hồi gRPC
      return { url: url };
    } catch (error) {
      // Xử lý lỗi và ném RpcException cho gRPC
      console.error('Error in UploadsController:', error);
      throw new RpcException({
        code: 13, // UNKNOWN (gRPC status code)
        message: 'File upload failed: ' + error.message,
      });
    }
  }
}
