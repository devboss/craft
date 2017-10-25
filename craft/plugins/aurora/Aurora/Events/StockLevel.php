<?php namespace ResHarmonics\Aurora\Events;

use Craft\AuroraPlugin;
use function Craft\craft;
use Craft\LogLevel;
use ResHarmonics\Aurora\Queue\Messages\RabbitMqMessage;

/**
 * Process stock level updates.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package ResHarmonics\Aurora\Events
 */
class StockLevel
{
    const STOCK_LEVEL_UPDATE = 'STOCK_LEVEL_UPDATE';

    /**
     * Process stock level notifications from the queue.
     *
     * @param \ResHarmonics\Aurora\Queue\Messages\RabbitMqMessage $message
     */
    public function processShippingNotificationMessage(RabbitMqMessage $message)
    {
        if ($message->isJson() && $message->operation === self::STOCK_LEVEL_UPDATE) {
            $sku = $message->body['sku'];

            AuroraPlugin::log("{$message->operation}[sku:{$sku}]", LogLevel::Info, true);

            $criteria = craft()->elements->getCriteria('Commerce_Variant');
            $criteria->sku = $sku;

            $variant = $criteria->first();

            if (is_null($variant)) {
                AuroraPlugin::log("Unable to find product: {$sku}", LogLevel::Error, true);
                $message->reject();

                return;
            }

            $variant->stock = $message->body['stockLevel'];

            $success = craft()->commerce_variants->saveVariant($variant);

            if ($success) {
                $message->acknowledge();

                return;
            }
        }

        $message->reject();
    }
}
