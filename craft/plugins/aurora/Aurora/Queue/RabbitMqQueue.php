<?php namespace ResHarmonics\Aurora\Queue;

use BadMethodCallException;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use PhpAmqpLib\Wire\AMQPTable;
use ResHarmonics\Aurora\Queue\Messages\RabbitMqMessage;

/**
 * Wrapper for PhpAmqpLib.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package ResHarmonics\Aurora\Queue
 */
class RabbitMqQueue
{
    /**
     * @var string Name of the queue
     */
    private $queueName = 'jobs';

    /**
     * @var string Identifier for the consumer
     */
    private $consumerTag = 'consumer';

    /**
     * @var array List of handlers for processing messages
     */
    private $messageHandlers;

    /**
     * @var string Host address of the RabbitMQ server
     */
    private $host;

    /**
     * @var int Host port of the RabbitMQ server
     */
    private $port;

    /**
     * @var string Username for authenticating with the RabbitMQ server
     */
    private $user;

    /**
     * @var string Password for authenticating with the RabbitMQ server
     */
    private $password;

    /**
     * @var \PhpAmqpLib\Connection\AMQPStreamConnection
     */
    private $connection;

    /**
     * @var \PhpAmqpLib\Channel\AMQPChannel
     */
    private $channel;

    /**
     * Create new queue manager.
     *
     * @param string $host
     * @param int    $port
     * @param string $user
     * @param string $password
     */
    public function __construct($host, $port, $user, $password)
    {
        $this->host = $host;
        $this->port = $port;
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Enable AMQP debugging.
     */
    public function enableDebugging()
    {
        define('AMQP_DEBUG', true);
    }

    /**
     * Get the name of the current queue.
     *
     * @return string
     */
    public function getQueueName()
    {
        return $this->queueName;
    }

    /**
     * Set the name of the queue to interact with.
     *
     * @param string $queueName
     *
     * @return RabbitMqQueue
     */
    public function setQueueName($queueName)
    {
        $this->queueName = $queueName;

        return $this;
    }

    /**
     * Get the identifier of the current consumer.
     *
     * @return string
     */
    public function getConsumerTag()
    {
        return $this->consumerTag;
    }

    /**
     * Set the consumer identifier.
     *
     * @param string $consumerTag
     *
     * @return RabbitMqQueue
     */
    public function setConsumerTag($consumerTag)
    {
        $this->consumerTag = $consumerTag;

        return $this;
    }

    /**
     * Register a handler to process messages from the queue.
     *
     * @param string $class
     * @param string $method
     *
     * @return RabbitMqQueue
     */
    public function addMessageHandler($class, $method = 'handle')
    {
        $this->messageHandlers[] = [$class, $method];

        return $this;
    }

    /**
     * Remove all message handlers from the queue.
     */
    public function clearMessageHandlers()
    {
        $this->messageHandlers = [];
    }

    /**
     * Connect to the RabbitMQ server and create the queue if it doesn't exist.
     */
    public function connect()
    {
        $this->connection = new AMQPStreamConnection($this->host, $this->port, $this->user, $this->password);
        $this->channel = $this->connection->channel();

        $this->channel->queue_declare($this->queueName, false, true, false, false, false, new AMQPTable(array(
            'x-dead-letter-exchange' => '',
            'x-dead-letter-routing-key' => "{$this->queueName}.dlq"
        )));
    }

    /**
     * Push a new message onto the queue.
     *
     * @param array|string $data
     * @param array        $headers
     */
    public function push($data, $headers = [])
    {
        $properties = [
            'content_type'     => 'application/json',
            'content_encoding' => 'UTF-8',
            'delivery_mode'    => 2,
        ];

        if (!empty($headers)) {
            $properties['application_headers'] = new AMQPTable($headers);
        }

        if (is_array($data)) {
            $data = json_encode($data);
        }

        $toSend = new AMQPMessage($data, $properties);

        $this->channel->exchange_declare("{$this->queueName}.exchange", 'direct', false, true, false);

        $this->channel->queue_bind($this->queueName, "{$this->queueName}.exchange");

        $this->channel->basic_publish($toSend, "{$this->queueName}.exchange");
    }

    /**
     * Listen for new messages on the queue.
     */
    public function listen()
    {
        $this->channel->basic_consume(
            $this->queueName,
            $this->consumerTag,
            false,
            false,
            false,
            false,
            [$this, 'processMessage']
        );

        // Loop as long as the channel has callbacks registered
        while (count($this->channel->callbacks)) {
            $this->channel->wait();
        }
    }

    /**
     * Close the connection to the RabbitMQ server.
     */
    public function disconnect()
    {
        $this->channel->close();
        $this->connection->close();
    }

    /**
     * Callback for processing messages.
     *
     * @param \PhpAmqpLib\Message\AMQPMessage $message
     */
    public function processMessage(AMQPMessage $message)
    {
        $message = new RabbitMqMessage($message);

        foreach ($this->messageHandlers as $messageHandler) {
            list($class, $method) = $messageHandler;

            if (!class_exists($class)) {
                throw new BadMethodCallException("Message handler class `{$class}` doesn't exist.");
            }

            $handler = new $class();

            if (!method_exists($handler, $method)) {
                throw new BadMethodCallException("Message handler method `{$class}::{$method}` doesn't exist.");
            }

            call_user_func_array([$handler, $method], compact('message'));
        }
    }
}
