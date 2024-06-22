import { Expose } from 'class-transformer';
import { BaseResponse } from 'src/lib/responses/base.response';
import { JsonResponse } from 'src/lib/responses/json.response';
import { Mixin } from 'ts-mixer';

export class RegisterResponse extends Mixin(BaseResponse, JsonResponse) {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'full_name' })
  fullName: string;
}
