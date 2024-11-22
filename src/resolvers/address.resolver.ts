// Address Resolver
import { Arg, Int, Mutation, Resolver } from 'type-graphql';
import { Address } from '../entities/address.entity';
import { AddressService } from '../services/address.service';

@Resolver(() => Address)
export class AddressResolver {
  private addressService = new AddressService();

  /**
   * Mutation to create a new address and associate it with a buyer.
   * @param {string} streetLine1 The first line of the street address.
   * @param {string} [streetLine2] The second line of the street address (optional).
   * @param {string} [city] The city of the address (optional).
   * @param {string} [province] The province of the address (optional).
   * @param {string} [postalCode] The postal code of the address (optional).
   * @param {string} [phoneNumber] The phone number associated with the address (optional).
   * @param {boolean} [defaultShippingAddress=false] Whether this address is the default shipping address (optional).
   * @param {boolean} [defaultBillingAddress=false] Whether this address is the default billing address (optional).
   * @param {number} buyerId The ID of the buyer to associate with the address.
   * @returns {Promise<Address>} The newly created address with its associated buyer.
   */
  @Mutation(() => Address)
  // @UseMiddleware(hasRole([userRole.BUYER]))
  async createAddress(
    @Arg('streetLine1') streetLine1: string,
    @Arg('streetLine2') streetLine2: string = '',
    @Arg('city') city: string = '',
    @Arg('province') province: string = '',
    @Arg('postalCode') postalCode: string = '',
    @Arg('phoneNumber') phoneNumber: string = '',
    @Arg('defaultShippingAddress') defaultShippingAddress: boolean = false,
    @Arg('defaultBillingAddress') defaultBillingAddress: boolean = false,
    @Arg('buyerId') buyerId: number,
  ): Promise<Address> {
    console.log('aqui');

    return this.addressService.create(
      streetLine1,
      streetLine2,
      city,
      province,
      postalCode,
      phoneNumber,
      defaultShippingAddress,
      defaultBillingAddress,
      buyerId,
    );
  }

  /**
   * Mutation to update an existing address.
   * @param {number} id The ID of the address to update.
   * @param {string} [streetLine1] The first line of the street address (optional).
   * @param {string} [streetLine2] The second line of the street address (optional).
   * @param {string} [city] The city of the address (optional).
   * @param {string} [province] The province of the address (optional).
   * @param {string} [postalCode] The postal code of the address (optional).
   * @param {string} [phoneNumber] The phone number associated with the address (optional).
   * @param {boolean} [defaultShippingAddress] Whether this address is the default shipping address (optional).
   * @param {boolean} [defaultBillingAddress] Whether this address is the default billing address (optional).
   * @returns {Promise<Address>} The updated address.
   */
  @Mutation(() => Address)
  async updateAddress(
    @Arg('id', () => Int) id: number,
    @Arg('streetLine1', { nullable: true }) streetLine1?: string,
    @Arg('streetLine2', { nullable: true }) streetLine2?: string,
    @Arg('city', { nullable: true }) city?: string,
    @Arg('province', { nullable: true }) province?: string,
    @Arg('postalCode', { nullable: true }) postalCode?: string,
    @Arg('phoneNumber', { nullable: true }) phoneNumber?: string,
    @Arg('defaultShippingAddress', { nullable: true })
    defaultShippingAddress?: boolean,
    @Arg('defaultBillingAddress', { nullable: true })
    defaultBillingAddress?: boolean,
  ): Promise<Address> {
    return this.addressService.update(
      id,
      streetLine1,
      streetLine2,
      city,
      province,
      postalCode,
      phoneNumber,
      defaultShippingAddress,
      defaultBillingAddress,
    );
  }

  /**
   * Deletes an address by their ID.
   *
   * @param {number} id - The ID of the address to be deleted.
   * @returns {Promise<boolean>} True if the address was deleted successfully, otherwise false.
   */
  @Mutation(() => Boolean)
  async deleteAddress(@Arg('id') id: number): Promise<boolean> {
    return this.addressService.delete(id);
  }
}
