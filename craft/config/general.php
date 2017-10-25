<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */

return [

    '*' => [
        // Default Week Start Day (0 = Sunday, 1 = Monday...)
        'defaultWeekStartDay'        => 0,

        // Enable CSRF Protection (recommended, will be enabled by default in Craft 3)
        'enableCsrfProtection' => (!isset($_SERVER['REQUEST_URI']) || !startsWith(ltrim(str_replace('index.php?p=', '', ltrim($_SERVER['REQUEST_URI'], '/')), '/'), 'actions/commerce/payments/completePayment')),

        // Whether "index.php" should be visible in URLs (true, false, "auto")
        'omitScriptNameInUrls'       => true,

        // Control Panel trigger word
        'cpTrigger'                  => 'admin',

        // Token modified for PayPal Express
        'tokenParam'                 => 'craftToken',

        // Dev Mode (see https://craftcms.com/support/dev-mode)
        'devMode'                    => false,

        // Set cache method
        'cacheMethod'                => 'redis',

        // Set PHP session handler
        'overridePhpSessionLocation' => false,

        'queueEnv' => 'dev',
    ],

    'lapland-website.app' => [
        'siteUrl'                    => 'https://lapland-website.app',

        // Dev Mode (see https://craftcms.com/support/dev-mode)
        'devMode'                    => true,

        // Set cache method
        'cacheMethod'                => 'file',

        // Environment-specific variables
        // (see https://craftcms.com/docs/multi-environment-configs#environment-specific-variables)
        'environmentVariables'       => [
            'baseApiUrl' => 'https://api.rerumapp.com/',
        ],
    ],

    'magic-website.app' => [
        'siteUrl'              => '//magic-website.app',

        // Dev Mode (see https://craftcms.com/support/dev-mode)
        'devMode'              => true,

        // Environment-specific variables
        // (see https://craftcms.com/docs/multi-environment-configs#environment-specific-variables)
        'environmentVariables' => [
            'baseAssetUrl'  => '//lapland-website.app',
            'baseAssetPath' => '../public',
            'baseApiUrl' => 'https://api.rerumapp.com/',
        ],
    ],

    'cms.rerumapp.com' => [
        'siteUrl'              => '//cms.rerumapp.com',

        // Environment-specific variables
        // (see https://craftcms.com/docs/multi-environment-configs#environment-specific-variables)
        'environmentVariables' => [
            'baseApiUrl' => 'https://api.rerumapp.com/',
        ],
    ],

    'staging.laplanduk.co.uk' => [
        'siteUrl'                    => '//staging.laplanduk.co.uk',

        // Dev Mode (see https://craftcms.com/support/dev-mode)
        'devMode'                    => getenv('CRAFT_DEV_MODE') ?: false,

        // Environment-specific variables
        // (see https://craftcms.com/docs/multi-environment-configs#environment-specific-variables)
        'environmentVariables'       => [
            'baseApiUrl' => 'https://api.rerumapp.com/',
        ],

        'queueEnv' => 'test',

        'validationKey' => getenv('CRAFT_VALIDATION_KEY', 'D1tQFFrGZO6XPxT54BvtV8K9yRGMpAjCtX36dawCfQE='),
    ],

    'www.laplanduk.co.uk' => [
        'siteUrl'                    => '//www.laplanduk.co.uk',

        // Dev Mode (see https://craftcms.com/support/dev-mode)
        'devMode'                    => getenv('CRAFT_DEV_MODE') ?: false,

        // Environment-specific variables
        // (see https://craftcms.com/docs/multi-environment-configs#environment-specific-variables)
        'environmentVariables'       => [
            'baseApiUrl' => 'https://api.laplanduk.co.uk/',
        ],

        'queueEnv' => 'prod',

        'validationKey' => getenv('CRAFT_VALIDATION_KEY', 'TvK01YLcYgyd+kYvZaKe/W6uyx0fEtE5Res/nfML9SU='),
    ],

    'admin.laplanduk.co.uk' => [
        'siteUrl'                    => '//admin.laplanduk.co.uk',

        // Dev Mode (see https://craftcms.com/support/dev-mode)
        'devMode'                    => getenv('CRAFT_DEV_MODE') ?: false,

        // Environment-specific variables
        // (see https://craftcms.com/docs/multi-environment-configs#environment-specific-variables)
        'environmentVariables'       => [
            'baseApiUrl' => 'https://api.laplanduk.co.uk/',
        ],
    ],

];
