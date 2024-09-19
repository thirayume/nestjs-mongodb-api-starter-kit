import { ApiProperty } from "@nestjs/swagger";
import { Category } from "./book.schema";
import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/auth/user.schema";

export class CreateBookDto {
	@ApiProperty({
		example: 'Funny Story',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@ApiProperty({
		example: 'Emily Henry is the #1 New York Times bestselling author of Book Lovers, People We Meet on Vacation, and Beach Read, as well as the forthcoming Happy Place. She lives and writes in Cincinnati and the part of Kentucky just beneath it.',
	})
	@IsString()
	readonly description: string;

	@ApiProperty({
		example: '12.99',
		required: true,
	})
	@IsNumber()
	readonly price: number;

	@ApiProperty({
		example: 'Emily Henry',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	readonly author: string;

	@ApiProperty({
		example: 'Fantasy',
	})
	@IsNotEmpty()
	@IsEnum(Category, { message: 'Category is not valid' })
	readonly category: Category;

	@IsEmpty({message: 'You cannot pass user'})
	readonly user: User;
}