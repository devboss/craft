<?php namespace Craft;

use ResHarmonics\Aurora\Events\Order;
use ResHarmonics\Aurora\Events\StockLevel;

/**
 * CLI commands for listening to messages from the queue.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package ResHarmonics\Aurora\Queue\Commands
 */
class QueueCommand extends BaseCommand
{
    /**
     * Listen for order status update messages.
     */
    public function actionOrder()
    {
        $env = craft()->config->get('queueEnv');

        craft()->aurora_queue->setQueueName("order-status-update.{$env}.craft.response");
        craft()->aurora_queue->connect();
        craft()->aurora_queue->addMessageHandler(Order::class, 'processOrderStatusMessage');
        craft()->aurora_queue->listen();
    }

    /**
     * Listen for stock level update messages.
     */
    public function actionStock()
    {
        $env = craft()->config->get('queueEnv');

        craft()->aurora_queue->setQueueName("stock-level-update.{$env}.response");
        craft()->aurora_queue->connect();
        craft()->aurora_queue->addMessageHandler(StockLevel::class, 'processShippingNotificationMessage');
        craft()->aurora_queue->listen();
    }

    /**
     * Clean up after the command has finished running.
     *
     * @param \CConsoleCommandEvent $event
     */
    public function onAfterAction($event)
    {
        parent::onAfterAction($event);

        craft()->aurora_queue->disconnect();
    }
}
