<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitcb0b980af99c1cd180d2c72f0a57fa8d
{
    public static $prefixesPsr0 = array (
        'O' => 
        array (
            'Omnipay\\Realex\\' => 
            array (
                0 => __DIR__ . '/..' . '/jholdroyd/omnipay-realex/src',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixesPsr0 = ComposerStaticInitcb0b980af99c1cd180d2c72f0a57fa8d::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
