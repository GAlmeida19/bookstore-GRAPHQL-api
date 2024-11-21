import { AppDataSource } from '../config/data-source';
import { Author } from '../entities/author/author.entity';
import { categories } from '../enums/book.enum';

export class AuthorService {
  private authorRepository = AppDataSource.getRepository(Author);

  /**
   * Retrieves a list of all authors from the repository, including their associated books.
   *
   * @returns {Promise<Author[]>} An array of authors.
   */
  async findAll(): Promise<Author[]> {
    return this.authorRepository.find({ relations: ['books'] });
  }

  /**
   * Retrieves an author by their ID, including associated books.
   *
   * @param {number} id - The ID of the author to be retrieved.
   * @returns {Promise<Author | null>} The author object if found, or null if not.
   */
  async findById(id: number): Promise<Author | null> {
    return this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
  }

  /**
   * Creates a new author in the repository.
   *
   * @param {string} name - The name of the author.
   * @param {string} birth - The birth date of the author.
   * @param {categories[]} categories - A list of categories associated with the author.
   * @returns {Promise<Author>} The newly created author.
   */
  async create(
    name: string,
    birth: string,
    categories: categories[],
  ): Promise<Author> {
    const newAuthor = this.authorRepository.create({
      name,
      birth,
      categories,
    });

    return this.authorRepository.save(newAuthor);
  }

  /**
   * Updates a author in the repository.
   *
   * @param {string} name - The name of the author.
   * @param {string} birth - The birth date of the author.
   * @param {categories[]} categories - A list of categories associated with the author.
   * @returns {Promise<Author>} The newly created author.
   */
  async updateAuthor(
    id: number,
    name?: string,
    birth?: string,
    categories?: categories[],
  ): Promise<Author | null> {
    const Author = await this.authorRepository.findOne({ where: { id } });
    if (!Author) {
      throw new Error('Author not found');
    }

    if (name) Author.name = name;
    if (birth) Author.birth = new Date(birth);
    if (categories) Author.categories = categories;

    return this.authorRepository.save(Author);
  }

  /**
   * Deletes an author by their ID.
   *
   * @param {number} id - The ID of the author to be deleted.
   * @returns {Promise<boolean>} True if the author was deleted successfully, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.authorRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Author not found or already deleted');
    }
    return result.affected !== 0;
  }
}
