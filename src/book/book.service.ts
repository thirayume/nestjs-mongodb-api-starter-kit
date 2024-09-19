import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { response } from 'express';
import { User } from 'src/auth/user.schema';

@Injectable()
export class BookService {
	constructor(
		@InjectModel(Book.name)
		private bookModel: mongoose.Model<Book>
	) { }

	async findAll(query: Query): Promise<Book[]> {
		const resPerPage = 20;
		const currentPage = Number(query.page) || 1;
		const skip = resPerPage * (currentPage - 1);

		const keyword = query.keyword ? {
			title: {
				$regex: query.keyword,
				$options: 'i'
			},
			// author: { 
			// 	$regex: query.keyword, 
			// 	$options: 'i' 
			// },
		} : {};
		const res = await this.bookModel
			.find({ ...keyword })
			.limit(resPerPage)
			.skip(skip)
			.exec();
		return res;
	}

	async create(book: Book, user: User): Promise<Book> {
		const data = Object.assign(book, { user: user._id });
		const res = await new this.bookModel(book).save();
		return res;
	}

	async findOne(id: string): Promise<Book> {
		const isValidId = mongoose.isValidObjectId(id);
		if (!isValidId) {
			throw new NotFoundException('Please enter correct id');
		}

		const res = await this.bookModel.findById(id);
		if (!res) {
			throw new NotFoundException('Book not found');
		}
		return res;
	}

	async updateById(id: string, book: Book, user: User): Promise<Book> {
		const data = Object.assign(book, { user: user._id });
		return await this.bookModel.findByIdAndUpdate(id, book, { new: true, runValidators: true }).exec();
	}

	async deleteById(id: string): Promise<Book> {
		return await this.bookModel.findByIdAndDelete(id).exec();
	}
}
