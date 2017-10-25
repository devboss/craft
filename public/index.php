<?php

function startsWith($haystack, $needles)
{
    foreach ((array) $needles as $needle) {
        if ($needle !== '' && mb_substr($haystack, 0, mb_strlen($needle)) === (string) $needle) {
            return true;
        }
    }

    return false;
}

//ini_set('session.save_handler', 'redis');

// Path to PHP error log
$logPath = getenv('CRAFT_LOG_PATH') ?: false;

if (is_string($logPath) && strlen($logPath) > 0 && file_exists($logPath)) {
    ini_set('error_log', $logPath);
}

// PHP Session handling
if (getenv('CRAFT_CACHE_HOST') !== false && getenv('CRAFT_CACHE_PORT') !== false) {
    $savePath = sprintf('%s:%s?database=%s', getenv('CRAFT_CACHE_HOST'), getenv('CRAFT_CACHE_PORT'), getenv('CRAFT_CACHE_DB'));

    ini_set('session.save_handler', 'redis');
    ini_set('session.save_path', $savePath);
}

// Path to your craft/ folder
$craftPath = '../craft';

define('AURORA_BASE_PATH', realpath(__DIR__));
define('AURORA_SITE', 'commercial');

// Do not edit below this line
$path = rtrim($craftPath, '/').'/app/index.php';

if (!is_file($path))
{
	if (function_exists('http_response_code'))
	{
		http_response_code(503);
	}

	exit('Could not find your craft/ folder. Please ensure that <strong><code>$craftPath</code></strong> is set correctly in '.__FILE__);
}

require_once $path;
