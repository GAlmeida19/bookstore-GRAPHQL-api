import { AppDataSource } from "../config/data-source";
import { Buyer } from "../entities/buyer/buyer.entity";
import { BookService } from "./book.service";

export class BuyerService {
  private buyerRepository = AppDataSource.getRepository(Buyer);
  bookServie: BookService;

  constructor() {
    this.bookServie = new BookService();
  }

  /**
   * Retrieves a list of all buyers along with their associated books.
   * @returns {Promise<Buyer[]>} An array of buyers, each with their associated books.
   */
  async findAll(): Promise<Buyer[]> {
    return this.buyerRepository.find({ relations: ["books"] });
  }

  /**
   * Retrieves a buyer by their ID, including their associated books.
   * @param {number} id - The ID of the buyer to find.
   * @returns {Promise<Buyer | null>} The buyer if found, or null if not found.
   */
  async findById(id: number): Promise<Buyer | null> {
    return this.buyerRepository.findOne({
      where: { id },
      relations: ["books"],
    });
  }

  /**
   * Creates a new buyer with the specified details.
   * @param firstName The first name of the buyer.
   * @param lastName The last name of the buyer.
   * @param emailAddress The email address of the buyer.
   * @param address The address of the buyer.
   * @param birth The birth date of the buyer.
   * @param wallet The wallet balance of the buyer.
   * @param phoneNumber (Optional) The phone number of the buyer.
   * @returns {Promise<Buyer>} The newly created buyer.
   * @throws {Error} Throws error if the email or phone number is invalid.
   */
  async create(
    firstName: string,
    lastName: string,
    emailAddress: string,
    address: string,
    birth: string,
    wallet: number,
    phoneNumber?: string
  ): Promise<Buyer> {
    const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(emailAddress)) {
      throw new Error("Invalid email address format");
    }

    if (phoneNumber) {
      const phoneRegex = /^\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error("Phone number must be exactly 9 digits");
      }
    }

    const newBuyer = this.buyerRepository.create({
      firstName,
      lastName,
      emailAddress,
      address,
      phoneNumber,
      birth,
      wallet,
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
    address?: string,
    birth?: string,
    wallet?: number,
    phoneNumber?: string
  ): Promise<Buyer | null> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) {
      throw new Error("Buyer not found");
    }

    if (firstName) buyer.firstName = firstName;
    if (lastName) buyer.lastName = lastName;
    if (emailAddress) buyer.emailAddress = emailAddress;
    if (address) buyer.address = address;
    if (wallet) buyer.wallet = wallet;
    if (phoneNumber) buyer.phoneNumber = phoneNumber;
    if (birth) buyer.birth = new Date(birth);

    return this.buyerRepository.save(buyer);
  }

  /**
   * Deletes a buyer by their ID.
   * @param {number} id - The ID of the buyer to delete.
   * @returns {Promise<boolean>} True if the buyer was successfully deleted, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.buyerRepository.delete(id);
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
    const buyer = await this.findById(buyerid);
    if (!buyer) {
      throw new Error("Buyer not found");
    }
    const book = await this.bookServie.findById(bookid);
    if (!book) {
      throw new Error("Book not found");
    }

    if (book.stock <= 0) {
      throw new Error("Book is out of stock");
    }

    if (buyer.wallet < book.price) {
      throw new Error("Buyer does not have enough funds");
    }

    buyer.wallet -= book.price;
    book.stock -= 1;

    buyer.books.push(book);

    await this.buyerRepository.save(buyer);
    await this.bookServie.update(
      book.id,
      undefined,
      undefined,
      undefined,
      undefined,
      book.stock
    );

    return buyer;
  }
}

//TODO: be able to reserve a book
