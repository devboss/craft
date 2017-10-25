<?php namespace ResHarmonics\Aurora\Oauth\Providers;

use Dukt\OAuth\Providers\BaseProvider;

/**
 * Aurora.
 *
 * @author Tom Densham <nedmas@mavenfortytwo.co.uk>
 */
class Aurora extends BaseProvider
{
    /**
     * Get Name
     *
     * @return string
     */
    public function getName()
    {
        return 'Aurora';
    }

    /**
     * Get OAuth Version
     *
     * @return int
     */
    public function getOauthVersion()
    {
        return 2;
    }

    /**
     * Create Provider
     *
     * @return string
     */
    public function createProvider()
    {
        if ($this->providerInfos->clientId && $this->providerInfos->clientSecret) {
            $config = [
                'urlAuthorize' => 'https://api.rerumapp.com/auth/oauth/authorize',
                'urlAccessToken' => 'https://api.rerumapp.com/auth/oauth/token',
                'urlResourceOwnerDetails' => 'https://api.rerumapp.com/my-details/me',

                'clientId' => $this->providerInfos->clientId,
                'clientSecret' => $this->providerInfos->clientSecret,
                'redirectUri' => $this->getRedirectUri(),
            ];

            return new \League\OAuth2\Client\Provider\GenericProvider($config);
        }
    }
}
