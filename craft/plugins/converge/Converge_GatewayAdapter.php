<?php namespace Commerce\Gateways\Omnipay;

use Commerce\Gateways\OffsiteGatewayAdapter;

/**
 * Elavon_GatewayAdapter.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package Craft
 */
class Converge_GatewayAdapter extends OffsiteGatewayAdapter
{
    public function handle()
    {
        return 'Elavon_Converge';
    }
}
