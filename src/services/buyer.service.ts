import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { Address } from '../entities/address.entity';
import { Buyer } from '../entities/buyer.entity';
import { User } from '../entities/user.entity';
import { userRole } from '../enums/book.enum';
import { BookService } from './book.service';
import { UserService } from './user.service';

export class BuyerService {
  private buyerRepository = AppDataSource.getRepository(Buyer);
  private addressRepository = AppDataSource.getRepository(Address);
  private userRepository = AppDataSource.getRepository(User);
  bookService: BookService;
  userService: UserService;

  constructor() {
    this.bookService = new BookService();
    this.userService = new UserService();
  }

  /**
   * Retrieves a list of all buyers along with their associated books.
   * @returns {Promise<Buyer[]>} An array of buyers, each with their associated books.
   */
  async findAll(): Promise<Buyer[]> {
    return this.buyerRepository.find({
      relations: ['wishlist', 'books', 'user', 'addresses'],
    });
  }

  /**
   * Retrieves a buyer by their ID, including their associated books.
   * @param {number} id - The ID of the buyer to find.
   * @returns {Promise<Buyer | null>} The buyer if found, or null if not found.
   */
  async findById(id: number): Promise<Buyer | null> {
    return this.buyerRepository.findOne({
      where: { id },
      relations: ['wishlist', 'books', 'user', 'addresses'],
    });
  }

  /**
   * Creates a new buyer with the specified details.
   * @param {string}  firstName The first name of the buyer.
   * @param {string}  lastName The last name of the buyer.
   * @param {string}  emailAddress The email address of the buyer.
   * @param {date}    birth The birth date of the buyer.
   * @param {float}   wallet The wallet balance of the buyer.
   * @param {int}     phoneNumber (Optional) The phone number of the buyer.
   * @returns {Promise<Buyer>} The newly created buyer.
   * @throws {Error} Throws error if the email or phone number is invalid.
   */
  async create(
    firstName: string,
    lastName: string,
    emailAddress: string,
    birth: string,
    wallet: number,
    password: string,
    phoneNumber?: string,
  ): Promise<Buyer> {
    const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(emailAddress)) {
      throw new Error('Invalid email address format');
    }

    if (phoneNumber) {
      const phoneRegex = /^\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error('Phone number must be exactly 9 digits');
      }
    }

    const birthDate = new Date(birth);
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid birth date format.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.emailAddress = emailAddress;
    user.password = hashedPassword;
    user.userRole = userRole.BUYER;

    await this.userRepository.save(user);

    const newBuyer = this.buyerRepository.create({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      birth: birthDate,
      wallet,
      user,
    });

    return this.buyerRepository.save(newBuyer);
  }

  /**
   * Updates the details of an existing buyer by their ID.
   * @param id The ID of the buyer to update.
   * @param firstName (Optional) The updated first name of the buyer.
   * @param lastName (Optional) The updated last name of the buyer.
   * @param emailAddress (Optional) The updated email address of the buyer.
   * @param address (Optional) The updated address of the buyer.
   * @param birth (Optional) The updated birth date of the buyer.
   * @param wallet (Optional) The updated wallet balance of the buyer.
   * @param phoneNumber (Optional) The updated phone number of the buyer.
   * @returns {Promise<Buyer | null>} The updated buyer, or null if not found.
   * @throws {Error} Throws error if the buyer is not found.
   */
  async updateBuyer(
    id: number,
    firstName?: string,
    lastName?: string,
    emailAddress?: string,
    birth?: string,
    wallet?: number,
    phoneNumber?: string,
  ): Promise<Buyer | null> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    if (firstName) buyer.firstName = firstName;
    if (lastName) buyer.lastName = lastName;
    if (emailAddress) buyer.emailAddress = emailAddress;
    if (wallet) buyer.wallet = wallet;
    if (phoneNumber) buyer.phoneNumber = phoneNumber;
    if (birth) buyer.birth = new Date(birth);

    return this.buyerRepository.save(buyer);
  }

  /**
   * Deletes a buyer and their associated user by their ID.
   * @param {number} id - The ID of the buyer to delete.
   * @returns {Promise<boolean>} True if the buyer and user were successfully deleted.
   * @throws {Error} Throws an error if the buyer with the specified ID cannot be found.
   */
  async delete(id: number): Promise<boolean> {
    const buyer = await this.buyerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!buyer) {
      throw new Error(`Buyer with ID ${id} not found.`);
    }

    const result = await this.buyerRepository.delete(id);

    if (buyer.user) {
      await this.userRepository.delete(buyer.user.id);
    }
    return result.affected !== 0;
  }

  /**
   * Handles a purchase by a buyer, decreasing the buyer's wallet and updating book stock.
   * @param {number} buyerid The ID of the buyer making the purchase.
   * @param {number} bookid The ID of the book being purchased.
   * @returns {Promise<Buyer | null>} The updated buyer after purchase.
   * @throws {Error} Throws error if the buyer or book is not found, or if stock or funds are insufficient.
   */
  async purchase(buyerid: number, bookid: number): Promise<Buyer | null> {
    console.log('aqui1');
    const user = await this.userService.findById(buyerid);
    if (!user?.buyer?.id) {
      throw new Error('User not found');
    }

    console.log('aqui2');
    const buyer = await this.findById(user?.buyer?.id);
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    console.log(buyer);

    const book = await this.bookService.findById(bookid);
    if (!book) {
      throw new Error('Book not found');
    }

    if (book.stock <= 0) {
      throw new Error('Book is out of stock');
    }

    if (buyer.wallet < book.price) {
      throw new Error('You do not have enough funds');
    }

    buyer.wallet -= book.price;
    book.stock -= 1;

    buyer.books.push(book);

    await this.buyerRepository.save(buyer);
    await this.bookService.update(
      book.id,
      undefined,
      undefined,
      undefined,
      undefined,
      book.stock,
    );

    return buyer;
  }

  /**
   *
   * @param buyerid
   * @param bookid
   * @returns
   */
  async addToWishlist(buyerid: number, bookid: number): Promise<Buyer | null> {
    const user = await this.userService.findById(buyerid);
    if (!user?.buyer?.id) {
      throw new Error('User not found');
    }

    const buyer = await this.findById(user?.buyer?.id);
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    console.log(buyer);
    const book = await this.bookService.findById(bookid);

    if (!book) {
      throw new Error('Book not found');
    }
    buyer.wishlist.push(book);

    await this.buyerRepository.save(buyer);

    return buyer;
  }

  //TODO: find a new way to deal with errors
}
