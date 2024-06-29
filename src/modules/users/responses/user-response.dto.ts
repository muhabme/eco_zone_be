import { Expose, Transform } from 'class-transformer';
import { BaseResponse } from 'src/lib/responses/base.response';

export class UserResponseDto extends BaseResponse {
  @Expose()
  @Transform(({ obj: user }) => user.uuid)
  id: string;

  @Expose()
  email: string;

  @Expose({ name: 'full_name' })
  fullName: string;

  @Expose({ name: 'birth_date' })
  birthDate: string;

  @Expose({ name: 'is_2Fa_enabled' })
  is2FaEnabled: boolean;
}
