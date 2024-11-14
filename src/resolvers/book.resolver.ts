import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Book } from "../entities/book/book.entity";
import { categories } from "../enums/book.enum";
import { BookService } from "../services/book.service";

@Resolver(() => Book)
export class BookResolver {
  private bookService = new BookService();

  /**
   * Retrieves a list of all books.
   * @returns A list of all books.
   */
  @Query(() => [Book])
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  /**
   * Retrieves a book by its ID.
   * @param id The ID of the book to retrieve.
   * @returns The book with the specified ID, or null if not found.
   */
  @Query(() => Book, { nullable: true })
  async getBookById(@Arg("id") id: number): Promise<Book | null> {
    return this.bookService.findById(id);
  }

  /**
   * Retrieves a book by its title.
   * @param title The title of the book to retrieve.
   * @returns The book with the specified title, or null if not found.
   */
  @Query(() => Book, { nullable: true })
  async getBookByTitle(@Arg("title") title: string): Promise<Book | null> {
    return this.bookService.findByTitle(title);
  }

  /**
   * Creates a new book.
   * @param title The title of the new book.
   * @param publishedDate The publication date of the book.
   * @param authorId The ID of the author of the book.
   * @param category The category of the book.
   * @param stock The stock quantity of the book.
   * @param price The price of the book.
   * @param introduction A short introduction of the book.
   * @returns The newly created book.
   */
  @Mutation(() => Book)
  async createBook(
    @Arg("title") title: string,
    @Arg("publishedDate") publishedDate: string,
    @Arg("authorId") authorId: number,
    @Arg("category") category: categories,
    @Arg("stock") stock: number,
    @Arg("price") price: number,
    @Arg("introduction") introduction: string
  ): Promise<Book> {
    return this.bookService.create(
      title,
      publishedDate,
      authorId,
      category,
      stock,
      price,
      introduction
    );
  }

  /**
   * Updates an existing book.
   * @param id The ID of the book to update.
   * @param title The updated title (optional).
   * @param publishedDate The updated publication date (optional).
   * @param authorId The updated author ID (optional).
   * @param category The updated category (optional).
   * @param stock The updated stock quantity (optional).
   * @param introduction The updated introduction (optional).
   * @returns The updated book, or null if not found.
   */
  @Mutation(() => Book, { nullable: true })
  async updateBook(
    @Arg("id") id: number,
    @Arg("title", { nullable: true }) title?: string,
    @Arg("publishedDate", { nullable: true }) publishedDate?: string,
    @Arg("authorId", { nullable: true }) authorId?: number,
    @Arg("category", { nullable: true }) category?: categories,
    @Arg("stock", { nullable: true }) stock?: number,
    @Arg("introduction", { nullable: true }) introduction?: string
  ): Promise<Book | null> {
    return this.bookService.update(
      id,
      title,
      publishedDate,
      authorId,
      category,
      stock,
      introduction
    );
  }

  /**
   * Deletes a book by its ID.
   * @param id The ID of the book to delete.
   * @returns True if the book was deleted, false otherwise.
   */
  @Mutation(() => Boolean)
  async deleteBook(@Arg("id") id: number): Promise<boolean> {
    return this.bookService.delete(id);
  }

  /**
   * Finds the 3 most similar books to the given book based on category and introduction.
   * @param id The ID of the book to compare.
   * @returns A list of the 3 most similar books.
   */
  @Query(() => [Book], { nullable: true })
  async similarBooks(@Arg("id") id: number): Promise<Book[]> {
    return await this.bookService.findSimilarBooks(id);
  }
}
