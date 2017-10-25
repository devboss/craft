<?php namespace Craft;

use Commerce\Gateways\Omnipay\RealexRedirect_GatewayAdapter;
use Commerce\Gateways\Omnipay\RealexRemote_GatewayAdapter;

/**
 * RealexPlugin.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package Craft
 */
class RealexPlugin extends BasePlugin
{
    private $commerceInstalled = false;

    public function init()
    {
        $commerce = craft()->db->createCommand()
                               ->select('id')
                               ->from('plugins')
                               ->where("class = 'Commerce'")
                               ->queryScalar();
        if ($commerce) {
            $this->commerceInstalled = true;
        }
    }

    public function getName()
    {
        return Craft::t('Realex Commerce Gateway');
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

    public function commerce_registerGatewayAdapters()
    {
        if ($this->commerceInstalled) {
            require __DIR__ . '/vendor/autoload.php';
            require_once __DIR__ . '/RealexRedirect_GatewayAdapter.php';
            require_once __DIR__ . '/RealexRemote_GatewayAdapter.php';

            return [
                RealexRedirect_GatewayAdapter::class,
                RealexRemote_GatewayAdapter::class,
            ];
        }

        return [];
    }
}
