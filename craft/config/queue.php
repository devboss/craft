<?php

return [
    // Connection details
    'host'     => getenv('QUEUE_HOST') ?: '10.100.101.46',
    'port'     => getenv('QUEUE_PORT') ?: 5672,
    'user'     => getenv('QUEUE_USER') ?: 'admin',
    'password' => getenv('QUEUE_PASS') ?: 'admin',
];
