import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    //todo
    console.log('Uploading file:', file.originalname, 'to folder:', folder);
    return new Promise((resolve) => {
      // Giả sử bạn đang sử dụng một dịch vụ lưu trữ như AWS S3
      const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
      const fileName = `${folder}${Date.now()}-${file.originalname}`;
      // Ở đây bạn sẽ gọi API của dịch vụ lưu trữ để upload file
      return resolve(`https://s3.amazonaws.com/${bucketName}/${fileName}`);
      // Nếu có lỗi xảy ra, bạn sẽ gọi reject(error);
    });
  }
  // Bạn có thể thêm các phương thức khác như deleteFile, getFileUrl, vv.
}
