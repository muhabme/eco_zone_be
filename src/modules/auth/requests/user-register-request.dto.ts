import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseRequest } from 'src/lib/responses/base.request';
import { IsUnique } from 'src/lib/rules/is-unique.rule';
import { User } from 'src/modules/users/entities/user.entity';

export class UserRegisterRequest extends BaseRequest {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @Type(() => Date)
  @IsDate()
  birth_date: Date;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique({ entity: User })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
