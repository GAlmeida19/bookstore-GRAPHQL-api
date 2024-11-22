import { AppDataSource } from '../config/data-source';
import { Buyer } from '../entities';
import { Address } from '../entities/address.entity';

export class AddressService {
  private addressRepository = AppDataSource.getRepository(Address);
  private buyerRepository = AppDataSource.getRepository(Buyer);

  /**
   * Retrieves all addresss with their associated authors.
   * @returns A list of all addresss, each with its associated author.
   */
  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['buyers'] });
  }

  /**
   * Retrieves a address by its ID along with its associated author.
   * @param id The ID of the address to find.
   * @returns The address with the specified ID, or null if not found.
   */
  async findById(id: number): Promise<Address | null> {
    return this.addressRepository.findOne({
      where: { id },
      relations: ['buyers'],
    });
  }

  /**
   * Creates a new address with the specified details and associates it with a buyer.
   * @param streetLine1 The first line of the street address.
   * @param streetLine2 (Optional) The second line of the street address.
   * @param city The city of the address.
   * @param province The province of the address.
   * @param postalCode The postal code of the address.
   * @param phoneNumber The phone number associated with the address.
   * @param defaultShippingAddress Whether this address is the default shipping address.
   * @param defaultBillingAddress Whether this address is the default billing address.
   * @param buyerId The ID of the buyer to associate with the address.
   * @returns The newly created address.
   * @throws {Error} Throws an error if the buyer is not found.
   */
  async create(
    streetLine1: string,
    streetLine2: string = '',
    city: string = '',
    province: string = '',
    postalCode: string = '',
    phoneNumber: string = '',
    defaultShippingAddress: boolean = false,
    defaultBillingAddress: boolean = false,
    buyerId: number,
  ): Promise<Address> {
    const buyer = await this.buyerRepository.findOne({
      where: { id: buyerId },
      relations: ['addresses'],
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    if (defaultShippingAddress) {
      await this.addressRepository.update(
        { buyer: buyer, defaultShippingAddress: true },
        { defaultShippingAddress: false },
      );
    }

    if (defaultBillingAddress) {
      await this.addressRepository.update(
        { buyer: buyer, defaultBillingAddress: true },
        { defaultBillingAddress: false },
      );
    }

    const newAddress = this.addressRepository.create({
      streetLine1,
      streetLine2,
      city,
      province,
      postalCode,
      phoneNumber,
      defaultShippingAddress,
      defaultBillingAddress,
      buyer,
    });

    return this.addressRepository.save(newAddress);
  }

  /**
   * Updates an existing address by its ID.
   * @param {number} id The ID of the address to update.
   * @param {string} streetLine1 The first line of the street address (optional).
   * @param {string} streetLine2 The second line of the street address (optional).
   * @param {string} city The city of the address (optional).
   * @param {string} province The province of the address (optional).
   * @param {string} postalCode The postal code of the address (optional).
   * @param {string} phoneNumber The phone number associated with the address (optional).
   * @param {boolean} defaultShippingAddress Whether this address is the default shipping address (optional).
   * @param {boolean} defaultBillingAddress Whether this address is the default billing address (optional).
   * @returns {Promise<Address>} The updated address.
   */
  async update(
    id: number,
    streetLine1?: string,
    streetLine2?: string,
    city?: string,
    province?: string,
    postalCode?: string,
    phoneNumber?: string,
    defaultShippingAddress?: boolean,
    defaultBillingAddress?: boolean,
  ): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['buyer'],
    });

    if (!address) {
      throw new Error('Address not found');
    }

    const buyer = address.buyer;

    if (defaultShippingAddress) {
      await this.addressRepository.update(
        { buyer: buyer, defaultShippingAddress: true },
        { defaultShippingAddress: false },
      );
    }

    if (defaultBillingAddress) {
      await this.addressRepository.update(
        { buyer: buyer, defaultBillingAddress: true },
        { defaultBillingAddress: false },
      );
    }

    if (streetLine1) address.streetLine1 = streetLine1;
    if (streetLine2) address.streetLine2 = streetLine2;
    if (city) address.city = city;
    if (province) address.province = province;
    if (postalCode) address.postalCode = postalCode;
    if (phoneNumber) address.phoneNumber = phoneNumber;
    if (defaultShippingAddress !== undefined)
      address.defaultShippingAddress = defaultShippingAddress;
    if (defaultBillingAddress !== undefined)
      address.defaultBillingAddress = defaultBillingAddress;

    return this.addressRepository.save(address);
  }

  /**
   * Deletes a address by its ID.
   * @param id The ID of the address to delete.
   * @returns True if the address was successfully deleted, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Author not found or already deleted');
    }
    return result.affected !== 0;
  }
}
