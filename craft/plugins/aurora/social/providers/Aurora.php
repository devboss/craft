<?php namespace ResHarmonics\Aurora\Social\Providers;

use Craft\Commerce_AddressModel;
use Craft\Commerce_CustomerAddressRecord;
use Craft\Commerce_CustomerModel;
use function Craft\craft;
use Craft\Event;
use Craft\Oauth_TokenModel;
use Dukt\Social\LoginProviders\BaseProvider;

/**
 * Aurora.
 *
 * @author Tom Densham <nedmas@mavenfortytwo.co.uk>
 */
class Aurora extends BaseProvider
{
    /**
     * Returns the name of the login provider
     *
     * @return string
     */
    public function getName()
    {
        return 'Aurora';
    }

    /**
     * Returns the handle of the OAuth provider
     *
     * @return string
     */
    public function getOauthProviderHandle()
    {
        return 'aurora';
    }

    /**
     * Returns a profile from an OAuth token
     *
     * @param Oauth_TokenModel $token
     *
     * @return mixed
     */
    public function getProfile(Oauth_TokenModel $token)
    {
        $profile = $this->getRemoteProfile($token)->toArray();

        craft()->on('users.onSaveUser', function (Event $event) use ($profile) {
            $user = $event->params['user'];
            $isNewUser = $event->params['isNewUser'];

            if ($user && $isNewUser) {
                $customerModel = new Commerce_CustomerModel();
                $customerModel->userId = $user->id;
                $customerModel->email = $user->email;

                craft()->commerce_customers->saveCustomer($customerModel);

                $addresses = $profile['contactAddresses'];

                if (count($addresses) > 0) {
                    foreach ($addresses as $address) {
                        $addressModel = new Commerce_AddressModel();
                        $addressModel->firstName = $user->firstName;
                        $addressModel->lastName = $user->lastName;
                        $addressModel->address1 = $address['addressLine1'];
                        $addressModel->address2 = $address['addressLine2'];
                        $addressModel->city = $address['city'];
                        $addressModel->zipCode = $address['postCode'];

                        $state = craft()->commerce_states->getStateByAttributes(['name' => $address['addressLine3']]);

                        if ($state) {
                            $addressModel->stateId = $state->id;
                        }

                        $country = craft()->commerce_countries->getCountryByAttributes(['iso' => $address['country']['countryCodeAlpha2']]);

                        if ($country) {
                            $addressModel->countryId = $country->id;
                        }

                        craft()->commerce_addresses->saveAddress($addressModel);

                        $customerAddress = new Commerce_CustomerAddressRecord();
                        $customerAddress->customerId = $customerModel->id;
                        $customerAddress->addressId = $addressModel->id;
                        $customerAddress->save();
                    }
                }
            }
        });

        $profile['email'] = $profile['emailAddress'];

        return $profile;
    }
}
