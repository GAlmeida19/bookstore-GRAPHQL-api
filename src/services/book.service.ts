import * as stringSimilarity from 'string-similarity';
import { AppDataSource } from '../config/data-source';
import { Author } from '../entities/author.entity';
import { Book } from '../entities/book.entity';
import { categories } from '../enums/book.enum';

export class BookService {
  private bookRepository = AppDataSource.getRepository(Book);
  private authorRepository = AppDataSource.getRepository(Author);

  /**
   * Retrieves all books with their associated authors.
   * @returns A list of all books, each with its associated author.
   */
  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: ['favorites', 'author', 'buyers', 'ratings'],
    });
  }

  /**
   * Retrieves a book by its ID along with its associated author.
   * @param id The ID of the book to find.
   * @returns The book with the specified ID, or null if not found.
   */
  async findById(id: number): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['favorites', 'author', 'buyers', 'ratings'],
    });
  }

  /**
   * Retrieves a book by its title along with its associated author.
   * @param title The title of the book to find.
   * @returns The book with the specified title, or null if not found.
   */
  async findByTitle(title: string): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { title },
      relations: ['author', 'buyers', 'ratings', 'favorites'],
    });
  }

  /**
   * Creates a new book with the specified details and associates it with an author.
   * @param title The title of the new book.
   * @param publishedDate The publication date of the new book.
   * @param authorId The ID of the author of the new book.
   * @param category The category of the new book.
   * @param stock The stock count of the new book.
   * @param price The price of the new book.
   * @param introduction A brief introduction to the new book.
   * @returns The newly created book.
   */
  async create(
    title: string,
    publishedDate: string,
    authorId: number,
    category: categories,
    stock: number,
    price: number,
    introduction: string,
    tags: string[],
  ): Promise<Book> {
    const author = await this.authorRepository.findOne({
      where: { id: authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    const newBook = this.bookRepository.create({
      title,
      publishedDate,
      author,
      category,
      stock,
      price,
      introduction,
      tags,
    });

    return this.bookRepository.save(newBook);
  }

  /**
   * Updates the details of an existing book by its ID.
   * @param id The ID of the book to update.
   * @param title The updated title of the book (optional).
   * @param publishedDate The updated publication date of the book (optional).
   * @param authorId The updated author ID (optional).
   * @param category The updated category of the book (optional).
   * @param stock The updated stock count (optional).
   * @param introduction The updated introduction of the book (optional).
   * @returns The updated book, or null if the book is not found.
   */
  async update(
    id: number,
    title?: string,
    publishedDate?: string,
    authorId?: number,
    category?: categories,
    stock?: number,
    introduction?: string,
  ): Promise<Book | null> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new Error('Book not found');
    }

    if (title) book.title = title;
    if (publishedDate) book.publishedDate = publishedDate;
    if (authorId) {
      const author = await this.authorRepository.findOne({
        where: { id: authorId },
      });
      if (!author) {
        throw new Error('Author not found');
      }
      book.author = author;
    }

    if (category) book.category = category;
    if (stock) book.stock = stock;
    if (introduction) book.introduction = introduction;

    return this.bookRepository.save(book);
  }

  /**
   * Deletes a book by its ID.
   * @param id The ID of the book to delete.
   * @returns True if the book was successfully deleted, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.bookRepository.delete(id);
    return result.affected !== 0;
  }

  /**
   * Find the 3 most similar books to a given book based on category and introduction.
   * @param bookId - The id of the book to compare against.
   * @returns An array of the 3 most similar books.
   */
  async findSimilarBooks(id: number): Promise<Book[]> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!book) {
      throw new Error('Book not found');
    }

    const similarBooks = await this.bookRepository.find({
      where: { category: book.category },
      relations: ['author'],
    });

    const filteredBooks = similarBooks.filter((b) => b.id !== book.id);

    const bookIntroductions = filteredBooks.map((b) => ({
      book: b,
      similarity: stringSimilarity.compareTwoStrings(
        book.introduction,
        b.introduction,
      ),
    }));

    const sortedBooks = bookIntroductions.sort(
      (a, b) => b.similarity - a.similarity,
    );
    const top3SimilarBooks = sortedBooks.slice(0, 3).map((b) => b.book);

    return top3SimilarBooks;
  }
}

//TODO: update similar books with tags
