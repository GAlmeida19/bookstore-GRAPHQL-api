import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Rating } from '../entities';
import { RatingService } from '../services/rating.service';
import { Context } from '../types/context';

@Resolver(() => Rating)
export class RatingResolver {
  private ratingService = new RatingService();

  /**
   * Mutation to create a new rating for a book.
   * @param {number} bookId The ID of the book being rated.
   * @param {number} value The rating value given to the book (e.g., 1-5).
   * @param {string} [review] An optional review/comment about the book.
   * @param {Context} ctx The context object containing the logged-in user's information.
   * @returns {Promise<Rating>} The created rating object.
   */
  @Mutation(() => Rating)
  async createRating(
    @Arg('bookId') bookId: number,
    @Arg('value') value: number,
    @Arg('review', { nullable: true }) review: string,
    @Ctx() ctx: Context,
  ): Promise<Rating> {
    const userId = ctx.user?.userId;
    if (!userId) {
      throw new Error('You must be logged in to rate a book.');
    }

    return this.ratingService.create(userId, bookId, value, review);
  }

  /**
   * Mutation to update an existing rating for a book.
   * @param {number} bookId The ID of the book whose rating is being updated.
   * @param {number} value The new rating value to assign to the book.
   * @param {Context} ctx The context object containing the logged-in user's information.
   * @returns {Promise<Rating>} The updated rating object.
   */
  @Mutation(() => Rating)
  async updateRating(
    @Arg('bookId') bookId: number,
    @Arg('value') value: number,
    @Ctx() ctx: Context,
  ): Promise<Rating> {
    const userId = ctx.user?.userId;
    if (!userId) {
      throw new Error('You must be logged in to update your rating.');
    }

    return await this.ratingService.update(userId, bookId, value);
  }

  /**
   * Query to get the average rating of a specific book.
   * @param {number} bookId The ID of the book whose average rating is being retrieved.
   * @returns {Promise<number>} The average rating value of the book.
   */
  @Query(() => Number)
  async averageRating(@Arg('bookId') bookId: number): Promise<number> {
    return await this.ratingService.averageRating(bookId);
  }
}
