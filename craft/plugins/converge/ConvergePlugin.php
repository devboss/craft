<?php namespace Craft;

/**
 * ElavonPlugin.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package Craft
 */
class ConvergePlugin extends BasePlugin
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
        return Craft::t('Converge Commerce Gateway');
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
            require_once __DIR__ . '/Converge_GatewayAdapter.php';

            return ['\Commerce\Gateways\Omnipay\Converge_GatewayAdapter'];
        }

        return [];
    }
}
