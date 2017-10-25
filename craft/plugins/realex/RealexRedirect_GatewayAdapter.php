<?php namespace Commerce\Gateways\Omnipay;

use Commerce\Gateways\OffsiteGatewayAdapter;

/**
 * Realex_GatewayAdapter.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package Commerce\Gateways\Omnipay
 */
class RealexRedirect_GatewayAdapter extends OffsiteGatewayAdapter
{
    public function handle()
    {
        return 'Realex_Redirect';
    }
}
