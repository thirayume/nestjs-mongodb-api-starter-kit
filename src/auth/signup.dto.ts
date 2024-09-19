import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {
	@ApiProperty({
		example: 'your_name',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@ApiProperty({
		example: 'email@example.com',
		required: true,
	})
	@IsNotEmpty()
	@IsEmail({}, {message: 'Please provide a valid email address'})
	readonly email: string;

	@ApiProperty({
		example: 'your_password',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	readonly password: string;

	@IsOptional()
	readonly role: string[];
}