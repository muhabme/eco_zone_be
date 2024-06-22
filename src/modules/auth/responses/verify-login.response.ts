import { IsNotEmpty, IsString } from 'class-validator';
import { BaseRequest } from 'src/lib/responses/base.request';

export class VerifyLoginRequest extends BaseRequest {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
