import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Author } from '../entities/author/author.entity';
import { categories } from '../enums/book.enum';
import { AuthorService } from '../services/author.service';

@Resolver(() => Author)
export class AuthorResolver {
  private authorService = new AuthorService();

  /**
   * Retrieves a list of all authors.
   *
   * @returns {Promise<Author[]>} An array of authors.
   */
  @Query(() => [Author])
  async getAllAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  /**
   * Retrieves an author by their ID.
   *
   * @param {number} id - The ID of the author to be retrieved.
   * @returns {Promise<Author | null>} The author object if found, or null if not.
   */
  @Query(() => Author, { nullable: true })
  async getAuthorById(@Arg('id') id: number): Promise<Author | null> {
    return this.authorService.findById(id);
  }

  /**
   * Creates a new author.
   *
   * @param {string} name - The name of the author.
   * @param {string} birth - The birth date of the author.
   * @param {categories[]} categories - A list of categories associated with the author.
   * @returns {Promise<Author>} The newly created author.
   */
  @Mutation(() => Author)
  async createAuthor(
    @Arg('name') name: string,
    @Arg('birth') birth: string,
    @Arg('categories', () => [categories]) categories: categories[],
  ): Promise<Author> {
    console.log('aqui');
    return this.authorService.create(name, birth, categories);
  }

  @Mutation(() => Author, { nullable: true })
  async updateAuthor(
    @Arg('id') id: number,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('birth', { nullable: true }) birth?: string,
    @Arg('categories', () => [categories], { nullable: true })
    categories?: categories[],
  ): Promise<Author | null> {
    return this.authorService.updateAuthor(id, name, birth, categories);
  }

  /**
   * Deletes an author by their ID.
   *
   * @param {number} id - The ID of the author to be deleted.
   * @returns {Promise<boolean>} True if the author was deleted successfully, otherwise false.
   */
  @Mutation(() => Boolean)
  async deleteAuthor(@Arg('id') id: number): Promise<boolean> {
    return this.authorService.delete(id);
  }
}
