import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterRequest } from '../requests/user-register-request.dto';
import { RegisterResponse } from '../responses/register.response';
import { RegisterService } from '../services/register.service';

@Controller('/auth')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post('/register')
  async registerInvestor(@Body() request: UserRegisterRequest) {
    const user = await this.registerService.register(request);

    const res = new RegisterResponse().json({
      data: user.transform(RegisterResponse),
    });

    return res;
  }
}
