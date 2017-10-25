<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

return [

    '*' => [
        // The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
        'server'   => getenv('CRAFT_DB_HOST') ?: 'localhost',

        // The name of the database to select.
        'database' => getenv('CRAFT_DB_NAME') ?: 'lapland',

        // The database username to connect with.
        'user'     => getenv('CRAFT_DB_USER') ?: 'homestead',

        // The database password to connect with.
        'password' => getenv('CRAFT_DB_PASS') ?: 'secret',

        // The prefix to use when naming tables. This can be no more than 5 characters.
        'tablePrefix' => 'craft',
    ],

    'cms.rerumapp.com' => [

        // The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
        'server'   => 'localhost',

        // The database username to connect with.
        'user'     => 'lapland',

        // The database password to connect with.
        'password' => '8VxPJeZury6KygrXo7xduw==',

    ],

];
