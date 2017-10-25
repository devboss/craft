<?php namespace ResHarmonics\Aurora\Queue\Messages;

use BadMethodCallException;
use Exception;
use PhpAmqpLib\Message\AMQPMessage;
use PhpAmqpLib\Wire\AMQPTable;

/**
 * Decorator for AMQPMessage.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package ResHarmonics\Aurora\Queue\Messages
 *
 * @property array  $application_header
 * @property string $operation
 * @property string $body
 */
class RabbitMqMessage
{
    /**
     * @var array List of message header key/values
     */
    private $applicationHeader;

    /**
     * @var \PhpAmqpLib\Message\AMQPMessage
     */
    private $message;

    /**
     * Decorate AMQPMessage.
     *
     * @param \PhpAmqpLib\Message\AMQPMessage $message
     */
    public function __construct(AMQPMessage $message)
    {
        $this->message = $message;
    }

    /**
     * Determine if the message is JSON encoded.
     *
     * @return bool
     */
    public function isJson()
    {
        return $this->message->get('content_type') === 'application/json';
    }

    /**
     * Send acknowledgement which removes message from the queue.
     */
    public function acknowledge()
    {
        $this->message->delivery_info['channel']->basic_ack($this->message->delivery_info['delivery_tag']);
    }

    /**
     * Send not acknowledged which moves message to dead letter queue.
     */
    public function reject()
    {
        $this->message->delivery_info['channel']->basic_nack($this->message->delivery_info['delivery_tag']);
    }

    /**
     * Proxy property calls to decorated AMQPMessage unless overridden with a getter in this class.
     *
     * @param string $name
     *
     * @return mixed
     * @throws \Exception
     */
    public function __get($name)
    {
        $getterName = 'get' . $this->studly($name);

        if (method_exists($this, $getterName)) {
            return $this->$getterName();
        }

        if (property_exists($this->message, $name)) {
            return $this->message->$name;
        }

        $class = get_class($this);
        throw new Exception("Property `{$name}` doesn't exist on class `{$class}`.");
    }

    /**
     * Proxy method calls to decorated AMQPMessage.
     *
     * @param string $name
     * @param array $arguments
     *
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        if (!method_exists($this->message, $name)) {
            $class = get_class($this->message);
            throw new BadMethodCallException("Method `{$name}` doesn't exist on class `{$class}`.");
        }

        return call_user_func_array([$this->message, $name], $arguments);
    }

    /**
     * Get the message headers.
     *
     * @return array
     */
    protected function getApplicationHeader()
    {
        if (is_null($this->applicationHeader) && $this->message->has('application_headers')) {
            /** @var AMQPTable $header */
            $header = $this->message->get('application_headers');

            if ($header instanceof AMQPTable) {
                $this->applicationHeader = $header->getNativeData();
            }
        }

        return $this->applicationHeader;
    }

    /**
     * Get the message operation.
     *
     * @return string|null
     */
    protected function getOperation()
    {
        return isset($this->application_header['operation']) ? $this->application_header['operation'] : null;
    }

    /**
     * Get the message body.
     *
     * @return string
     */
    protected function getBody()
    {
        if ($this->isJson()) {
            return json_decode($this->message->body, true);
        }

        return $this->message->body;
    }

    /**
     * Convert a string to studly case.
     *
     * @param string $value
     *
     * @return string
     */
    private function studly($value)
    {
        $value = ucwords(str_replace(['-', '_'], ' ', $value));

        return str_replace(' ', '', $value);
    }
}
