import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Buyer } from "../entities/buyer/buyer.entity";
import { BuyerService } from "../services/buyer.service";

@Resolver(() => Buyer)
export class BuyerResolver {
  private buyerService = new BuyerService();

  /**
   * Retrieves a list of all buyers.
   *
   * @returns {Promise<Buyer[]>} An array of buyers.
   */
  @Query(() => [Buyer])
  async getAllBuyers(): Promise<Buyer[]> {
    return this.buyerService.findAll();
  }

  /**
   * Retrieves an buyer by their ID.
   *
   * @param {number} id - The ID of the buyer to be retrieved.
   * @returns {Promise<Buyer | null>} The buyer object if found, or null if not.
   */
  @Query(() => Buyer, { nullable: true })
  async getBuyerById(@Arg("id") id: number): Promise<Buyer | null> {
    return this.buyerService.findById(id);
  }

  /**
   * Creates a new buyer.
   *
   * @param {string} firstName - The first name of the buyer.
   * @param {string} lastName - The last name of the buyer.
   * @param {string} emailAddress - The email address of the buyer.
   * @param {string} address - The address of the buyer.
   * @param {string} birth - The birth date of the buyer.
   * @param {number} wallet - The wallet balance of the buyer.
   * @param {string} [phoneNumber] - The phone number of the buyer (optional).
   * @returns {Promise<Buyer>} The newly created buyer object.
   */
  @Mutation(() => Buyer)
  async createBuyer(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("emailAddress") emailAddress: string,
    @Arg("address") address: string,
    @Arg("birth") birth: string,
    @Arg("wallet") wallet: number,
    @Arg("phoneNumber") phoneNumber?: string
  ): Promise<Buyer> {
    console.log("aqui");
    return this.buyerService.create(
      firstName,
      lastName,
      emailAddress,
      address,
      birth,
      wallet,
      phoneNumber
    );
  }

  /**
   * Updates an existing buyer.
   *
   * @param {number} id - The ID of the buyer to update.
   * @param {string} [firstName] - The updated first name of the buyer (optional).
   * @param {string} [lastName] - The updated last name of the buyer (optional).
   * @param {string} [emailAddress] - The updated email address of the buyer (optional).
   * @param {string} [address] - The updated address of the buyer (optional).
   * @param {string} [birth] - The updated birth date of the buyer (optional).
   * @param {number} [wallet] - The updated wallet balance of the buyer (optional).
   * @param {string} [phoneNumber] - The updated phone number of the buyer (optional).
   * @returns {Promise<Buyer | null>} The updated buyer object if found, or null if not.
   */
  @Mutation(() => Buyer, { nullable: true })
  async updateBuyer(
    @Arg("id") id: number,
    @Arg("firstName", { nullable: true }) firstName?: string,
    @Arg("lastName", { nullable: true }) lastName?: string,
    @Arg("emailAddress", { nullable: true }) emailAddress?: string,
    @Arg("address", { nullable: true }) address?: string,
    @Arg("birth", { nullable: true }) birth?: string,
    @Arg("wallet", { nullable: true }) wallet?: number,
    @Arg("phoneNumber", { nullable: true }) phoneNumber?: string
  ): Promise<Buyer | null> {
    return this.buyerService.updateBuyer(
      id,
      firstName,
      lastName,
      emailAddress,
      address,
      birth,
      wallet,
      phoneNumber
    );
  }

  /**
   * Deletes an buyer by their ID.
   *
   * @param {number} id - The ID of the buyer to be deleted.
   * @returns {Promise<boolean>} True if the buyer was deleted successfully, otherwise false.
   */
  @Mutation(() => Boolean)
  async deleteBuyer(@Arg("id") id: number): Promise<boolean> {
    return this.buyerService.delete(id);
  }

  /**
   * Mutation to handle the purchase of multiple books by a buyer.
   * @param buyerId The ID of the buyer making the purchase.
   * @param bookIds An array of book IDs to be purchased.
   * @returns The updated buyer after purch, () => [Int]asing the books.
   */
  @Mutation(() => Buyer, { nullable: true })
  async purchaseBook(
    @Arg("buyerId") buyerId: number,
    @Arg("bookId") bookId: number
  ): Promise<Buyer | null> {
    return await this.buyerService.purchase(buyerId, bookId);
  }
}
