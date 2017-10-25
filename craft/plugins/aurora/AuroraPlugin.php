<?php namespace Craft;

use ResHarmonics\Aurora\Events\Order;
use ResHarmonics\Aurora\Oauth\Providers\Aurora as AuroraOauthProvider;
use ResHarmonics\Aurora\Social\Providers\Aurora as AuroraSocialLoginProvider;
use ResHarmonics\Aurora\Social\Providers\Aurora;

/**
 * AuroraPlugin.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package Craft
 */
class AuroraPlugin extends BasePlugin
{
    public function init()
    {
        require_once(CRAFT_PLUGINS_PATH.'aurora/vendor/autoload.php');

        parent::init();

        craft()->on('commerce_orders.onOrderComplete', [
            Order::class,
            'handleOrderComplete',
        ]);

        craft()->on('commerce_orders.onBeforeSaveOrder', [
            Order::class,
            'handleBeforeSaveOrder'
        ]);
    }

    public function getName()
    {
        return Craft::t('Aurora');
    }

    public function getVersion()
    {
        return '1.0-alpha';
    }

    public function getDeveloper()
    {
        return 'res:harmonics';
    }

    public function getDeveloperUrl()
    {
        return 'http://www.resharmonics.com/';
    }

    /**
     * Get OAuth Providers
     */
    public function getOauthProviders()
    {
        require_once(CRAFT_PLUGINS_PATH.'aurora/oauth/providers/Aurora.php');

        return [
            AuroraOauthProvider::class,
        ];
    }

    /**
     * Get Social Login Providers
     */
    public function getSocialLoginProviders()
    {
        require_once(CRAFT_PLUGINS_PATH.'aurora/social/providers/Aurora.php');

        return [
            AuroraSocialLoginProvider::class,
        ];
    }

    public function commerce_modifyPaymentRequest(array $request){

        AuroraPlugin::log('[CancelURL]: ' . $request['cancelUrl']);

        if (strpos(craft()->config->get('siteUrl'), '//') === 0) {
            $request['cancelUrl'] = 'https:' . $request['cancelUrl'];
        }

        return $request;
    }
}
