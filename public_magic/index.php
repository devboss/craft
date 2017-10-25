<?php

ini_set('session.save_handler', 'redis');

// Path to your craft/ folder
$craftPath = '../craft';

define('AURORA_BASE_PATH', realpath(__DIR__));
define('AURORA_SITE', 'magical');

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
