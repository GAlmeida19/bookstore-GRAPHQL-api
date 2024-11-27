import { AppDataSource } from '../config/data-source';
import { Rating } from '../entities';
import { BookService } from './book.service';
import { UserService } from './user.service';

export class RatingService {
  private ratingRepository = AppDataSource.getRepository(Rating);
  bookService: BookService;
  userService: UserService;

  constructor() {
    this.bookService = new BookService();
    this.userService = new UserService();
  }

  /**
   * Creates a new rating for a book by a user.
   * @param {number} userId The ID of the user creating the rating.
   * @param {number} bookId The ID of the book being rated.
   * @param {number} value The rating value given to the book (e.g., 1-5).
   * @param {string} review An optional review/comment about the book.
   * @returns {Promise<Rating>} The created rating object.
   * @throws {Error} If the book or user is not found, or if the user has already rated the book.
   */
  async create(
    userId: number,
    bookId: number,
    value: number,
    review: string,
  ): Promise<Rating> {
    console.log('aqui');
    const book = await this.bookService.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('Buyer not found');
    }

    const existingRating = await this.ratingRepository.findOne({
      where: { user: { id: userId }, book },
    });

    if (existingRating) {
      throw new Error('You have already rated this book.');
    }

    const rating = this.ratingRepository.create({
      user,
      book,
      value,
      review,
    });

    return this.ratingRepository.save(rating);
  }

  /**
   * Updates an existing rating for a book by a user.
   * @param {number} userId The ID of the user updating the rating.
   * @param {number} bookId The ID of the book whose rating is being updated.
   * @param {number} value The new rating value to assign to the book.
   * @param {string} [review] An optional updated review/comment about the book. If not provided, the existing review remains unchanged.
   * @returns {Promise<Rating>} The updated rating object.
   * @throws {Error} If the book is not found or the rating does not exist for the user.
   */
  async update(
    userId: number,
    bookId: number,
    value: number,
    review?: string,
  ): Promise<Rating> {
    const book = await this.bookService.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const rating = await this.ratingRepository.findOne({
      where: { user: { id: userId }, book },
    });

    if (!rating) {
      throw new Error('Rating not found.');
    }

    rating.value = value;
    rating.review = review || rating.review;
    return await this.ratingRepository.save(rating);
  }

  /**
   * Retrieves the average rating for a specific book.
   * @param {number} bookId The ID of the book whose average rating is being retrieved.
   * @returns {Promise<number>} The average rating of the book, rounded to two decimal places. Returns 0 if no ratings exist for the book.
   * @throws {Error} If the book is not found.
   */
  async averageRating(bookId: number): Promise<number> {
    const book = await this.bookService.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const ratings = book.ratings;
    if (ratings.length === 0) {
      return 0;
    }

    const average =
      ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length;
    return parseFloat(average.toFixed(2));
  }
}
