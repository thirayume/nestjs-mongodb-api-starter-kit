import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService
	) { }

	@Post('/signup')
	async signUp(
		@Body()
		signUpDto: SignUpDto
	): Promise<{ token: string }> {
		return this.authService.signUp(signUpDto);
	}

	@Post('/login')
	async login(
		@Body()
		loginDto: LoginDto
	): Promise<{ token: string }> {
		return this.authService.login(loginDto);
	}
}
