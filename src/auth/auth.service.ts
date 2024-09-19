import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './signup.dto';
import * as bcrypt from 'bcrypt';
import { genSalt, hash } from 'bcrypt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<User>,
		private jwtService: JwtService
	) { }

	async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
		const { name, email, password, role } = signUpDto;
		const salt = await genSalt();
		const hashedPassword = await hash(password, salt);
		const user = await this.userModel.create({
			name,
			email,
			password: hashedPassword,
			role,
		});
		const token = this.jwtService.sign({ id: user._id });
		return { token };
	}

	async login(loginDto: LoginDto): Promise<{ token: string }> {
		const { email, password } = loginDto;
		const user = await this.userModel.findOne({ email });
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException('Invalid credentials');
		}
		const token = this.jwtService.sign({ id: user._id });
		return { token };
	}
}
