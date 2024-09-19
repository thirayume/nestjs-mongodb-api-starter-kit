import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.schema';
import { CreateBookDto } from './create-book.dto';
import { UpdateBookDto } from './update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { Query as ExpressQuerys } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Book')
@Controller('book')
export class BookController {

	constructor(private bookService: BookService) {	}

	@Get()
	@Roles(Role.User, Role.Admin, Role.Moderator)
	@UseGuards(AuthGuard(), RolesGuard)
	async getAllBooks(
		@Query()
		query: ExpressQuerys
	): Promise<Book[]> {
		return this.bookService.findAll(query);
	}

	@Get(':id')
	@Roles(Role.User, Role.Admin, Role.Moderator)
	@UseGuards(AuthGuard(), RolesGuard)
	async getBookById(
		@Param('id')
		id: string
	): Promise<Book> {
		return this.bookService.findOne(id);
	}

	@Post()
	@UseGuards(AuthGuard())
	async createBook(
		@Body() 
		book: CreateBookDto,
		@Req() req,
	): Promise<Book> {
		return this.bookService.create(book, req.user);
	}

	@Put(':id')
	@UseGuards(AuthGuard())
	async updateBook(
		@Param('id')
		id: string,
		@Body() 
		book: UpdateBookDto,
		@Req() req,
	): Promise<Book> {
		return this.bookService.updateById(id, book, req.user);
	}

	@Delete(':id')
	@UseGuards(AuthGuard())
	async deleteBook(
		@Param('id')
		id: string,
	): Promise<Book> {	
		return this.bookService.deleteById(id);
	}
}
