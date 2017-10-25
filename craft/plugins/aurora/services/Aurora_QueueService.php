<?php namespace Craft;

use BadMethodCallException;
use ResHarmonics\Aurora\Queue\RabbitMqQueue;

/**
 * Craft services for interacting with a queue.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package Craft
 */
class Aurora_QueueService extends BaseApplicationComponent
{
    /**
     * @var \ResHarmonics\Aurora\Queue\RabbitMqQueue
     */
    private $queue;

    /**
     * Initialise the queue getting details from the config file.
     */
    public function init()
    {
        $host = craft()->config->get('host', 'queue');
        $port = craft()->config->get('port', 'queue');
        $user = craft()->config->get('user', 'queue');
        $password = craft()->config->get('password', 'queue');
        $name = craft()->config->get('queue', 'queue');

        $this->queue = new RabbitMqQueue($host, $port, $user, $password);
        $this->queue->setQueueName($name);
    }

    /**
     * Proxy calls to the queue.
     *
     * @param string $name
     * @param array  $arguments
     *
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        if (!method_exists($this->queue, $name)) {
            $class = get_class($this->queue);
            throw new BadMethodCallException("Method `{$name}` doesn't exist on class `{$class}`.");
        }

        return call_user_func_array([$this->queue, $name], $arguments);
    }
}
