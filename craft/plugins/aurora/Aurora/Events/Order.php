<?php namespace ResHarmonics\Aurora\Events;

use Craft\AuroraPlugin;
use Craft\Commerce_LineItemModel;
use Craft\Commerce_OrderModel;
use Craft\Commerce_OrderStatusModel;
use Craft\Commerce_TransactionModel;
use function Craft\craft;
use Craft\Event;
use Craft\LogLevel;
use ResHarmonics\Aurora\Queue\Messages\RabbitMqMessage;

/**
 * Process order status update messages.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package ResHarmonics\Aurora\Events
 */
class Order
{
    const ORDER_CREATION = 'ORDER_CREATION';
    const ORDER_STATUS_UPDATE = 'ORDER_STATUS_UPDATE';

    /**
     * Process Craft Commerce Order Model and send a creation message to the queue.
     *
     * @param Commerce_OrderModel $orderModel
     */
    public static function sendOrderCompleteMessage(Commerce_OrderModel $orderModel)
    {
        $billingState = $orderModel->billingAddress->state;
        $billingCountry = $orderModel->billingAddress->country;

        $shippingState = $orderModel->shippingAddress->state;
        $shippingCountry = $orderModel->shippingAddress->country;

        $socialAccount = null;

        if ($orderModel->customer) {
            $loginAccountsByUserId = craft()->social_loginAccounts->getLoginAccountsByUserId(
                $orderModel->customer->userId
            );

            /** @var \Craft\Social_LoginAccountModel $socialAccount */
            $socialAccount = count($loginAccountsByUserId) === 1 ? $loginAccountsByUserId[0] : [];
        }

        $customer = [
            'auroraCustomerId'      => $socialAccount ? $socialAccount->socialUid : null,
            'firstName'             => $orderModel->billingAddress->firstName,
            'lastName'              => $orderModel->billingAddress->lastName,
            'emailAddress'          => $orderModel->customer->email,
            'mobileTelephoneNumber' => $orderModel->billingAddress->phone,
        ];

        $orderItems = array_reduce(
            $orderModel->lineItems,
            function ($orderItems, Commerce_LineItemModel $lineItem) {
                $taxIncluded = $lineItem->taxIncluded;
                $unitPriceVat = $taxIncluded / $lineItem->qty;

                $unitPriceGrossNetVat = [
                    'net'   => self::formatMoney($lineItem->price - $unitPriceVat),
                    'vat'   => self::formatMoney($unitPriceVat),
                    'gross' => self::formatMoney($lineItem->price)
                ];

                $itemPriceGrossNetVat = [
                    'net'   => self::formatMoney($lineItem->getSubtotal() - $taxIncluded),
                    'vat'   => self::formatMoney($taxIncluded),
                    'gross' => self::formatMoney($lineItem->total)
                ];

                $orderItems[] = [
                    'sku'         => $lineItem->getSku(),
                    'description' => $lineItem->purchasable->getDescription(),
                    'quantity'    => $lineItem->qty,
                    'unitPrice'   => $unitPriceGrossNetVat,
                    'itemPrice'   => $itemPriceGrossNetVat,
                ];

                return $orderItems;
            },
            []
        );

        $transaction = array_reduce(
            $orderModel->getTransactions(),
            function ($transaction, Commerce_TransactionModel $transactionModel) {
                return ($transactionModel->status === 'success') ? $transactionModel->reference : $transaction;
            },
            null
        );

        $orderTotalGrossNetVat = [
            'net'   => self::formatMoney($orderModel->totalPrice - $orderModel->getTotalTaxIncluded()),
            'vat'   => self::formatMoney($orderModel->getTotalTaxIncluded()),
            'gross' => self::formatMoney($orderModel->totalPrice)
        ];

        $shippingCostGrossNetVat = [
            'net'   => self::formatMoney($orderModel->totalShippingCost),
            'vat'   => self::formatMoney(0.0),
            'gross' => self::formatMoney($orderModel->totalShippingCost)
        ];

        $order = [
            'billingAddress'  => [
                'auroraAddressId' => null,
                'craftAddressId'  => $orderModel->billingAddress->id,
                'addressLine1'    => $orderModel->billingAddress->address1,
                'addressLine2'    => $orderModel->billingAddress->address2,
                'addressLine3'    => $billingState ? $billingState->name : null,
                'city'            => $orderModel->billingAddress->city,
                'postCode'        => $orderModel->billingAddress->zipCode,
                'countryCode'     => $billingCountry ? $billingCountry->iso : null,
            ],
            'shippingAddress' => [
                'auroraAddressId' => null,
                'craftAddressId'  => $orderModel->shippingAddress->id,
                'addressLine1'    => $orderModel->shippingAddress->address1,
                'addressLine2'    => $orderModel->shippingAddress->address2,
                'addressLine3'    => $shippingState ? $shippingState->name : null,
                'city'            => $orderModel->shippingAddress->city,
                'postCode'        => $orderModel->shippingAddress->zipCode,
                'countryCode'     => $shippingCountry ? $shippingCountry->iso : null,
            ],

            'customer'            => $customer,
            'craftOrderReference' => $orderModel->number,

            'items' => $orderItems,

            'orderTotal' => $orderTotalGrossNetVat,

            'discountCode'     => $orderModel->couponCode,
            'discountApplied'  => self::formatMoney($orderModel->getTotalDiscount()),
            'paymentReference' => $transaction,
            'paidAmount'       => self::formatMoney($orderModel->totalPaid),
            'shippingType'     => $orderModel->getShippingMethod()->name,
            'shippingCost'     => $shippingCostGrossNetVat

        ];

        $env = craft()->config->get('queueEnv');

        craft()->aurora_queue->setQueueName("order-create.{$env}.request");
        craft()->aurora_queue->connect();
        craft()->aurora_queue->push(
            $order,
            ['__TypeId__' => 'com.resharmonics.aurora.middleware.model.request.CreateOrderRequest']
        );
        craft()->aurora_queue->disconnect();
    }

    /**
     * Handle 'commerce_orders.onOrderComplete' events from Craft Commerce.
     *
     * @param \Craft\Event $event
     */
    public function handleOrderComplete(Event $event)
    {
        $orderModel = $event->params['order'];

        if ($orderModel instanceof Commerce_OrderModel && $orderModel->isPaid()) {
            try {
                self::sendOrderCompleteMessage($orderModel);
            } catch (\Exception $exception) {
                /** @var \Craft\Commerce_OrderStatusModel $orderStatus */
                $orderStatus = craft()->commerce_orderStatuses->getOrderStatusByHandle('failed');

                if ($orderStatus) {
                    $orderModel->orderStatusId = $orderStatus->id;

                    craft()->commerce_orders->saveOrder($orderModel);
                } else {
                    throw $exception;
                }
            }
        }
    }

    /**
     * Handle 'commerce_orders.onBeforeSaveOrder' events from Craft Commerce.
     *
     * @param \Craft\Event $event
     */
    public function handleBeforeSaveOrder(Event $event)
    {
        $orderModel = $event->params['order'];

        /** @var Commerce_OrderStatusModel $createdOrderStatus */
        $createdOrderStatus = craft()->commerce_orderStatuses->getOrderStatusByHandle('created');
        /** @var Commerce_OrderStatusModel $failedOrderStatus */
        $failedOrderStatus = craft()->commerce_orderStatuses->getOrderStatusByHandle('failed');

        $orderModelExists = $orderModel instanceof Commerce_OrderModel && $orderModel->isPaid();
        $createdOrderStatusExists = $createdOrderStatus instanceof Commerce_OrderStatusModel;
        $failedOrderStatusExists = $failedOrderStatus instanceof Commerce_OrderStatusModel;

        if ($orderModelExists && $createdOrderStatusExists && $failedOrderStatusExists) {
            /** @var Commerce_OrderModel $currentOrderModel */
            $currentOrderModel = craft()->commerce_orders->getOrderById($orderModel->id);

            $orderStatusEqual = $orderModel->orderStatusId === $currentOrderModel->orderStatusId;
            $currentOrderStatusNotFailed = $currentOrderModel->orderStatusId !== $failedOrderStatus->id;
            $orderStatusNotCreated = $orderModel->orderStatusId !== $createdOrderStatus->id;

            $statusNotCorrect = $orderStatusEqual || $currentOrderStatusNotFailed || $orderStatusNotCreated;

            if (is_null($currentOrderModel) || $statusNotCorrect) {
                return;
            }

            try {
                self::sendOrderCompleteMessage($orderModel);
            } catch (\Exception $exception) {
                $event->performAction = false;
            }
        }
    }

    /**
     * Process order status notifications from the queue.
     *
     * @param \ResHarmonics\Aurora\Queue\Messages\RabbitMqMessage $message
     */
    public function processOrderStatusMessage(RabbitMqMessage $message)
    {
        if ($message->isJson() && in_array($message->operation, [self::ORDER_CREATION, self::ORDER_STATUS_UPDATE])) {
            $craftOrderId = $message->body['craftOrderReference'];
            $orderStatus = $message->body['craftOrderStatus'];

            AuroraPlugin::log(
                "{$message->operation}[craftOrderReference:{$craftOrderId},orderStatus:{$orderStatus}]",
                LogLevel::Info,
                true
            );

            /** @var \Craft\Commerce_OrderModel $order */
            $order = craft()->commerce_orders->getOrderByNumber($craftOrderId);

            if (is_null($order)) {
                AuroraPlugin::log("Unable to find order: {$craftOrderId}", LogLevel::Error, true);
                $message->reject();

                return;
            }

            /** @var \Craft\Commerce_OrderStatusModel $orderStatus */
            $orderStatus = craft()->commerce_orderStatuses->getOrderStatusByHandle(strtolower($orderStatus));

            if (is_null($orderStatus)) {
                AuroraPlugin::log("Unable to find order status: {$orderStatus}", LogLevel::Error, true);
                $message->reject();

                return;
            }

            $order->orderStatusId = $orderStatus->id;

            $success = craft()->commerce_orders->saveOrder($order);

            if ($success) {
                $message->acknowledge();

                return;
            }
        }

        $message->reject();
    }

    /**
     * Format money to 4 decimal place string.
     *
     * @param mixed $value
     *
     * @return string
     */
    public static function formatMoney($value)
    {
        return number_format($value, 4, '.', '');
    }
}
