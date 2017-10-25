<?php namespace Craft;

/**
 * AuroraVariable.
 *
 * @author  Tom Densham <nedmas@mavenfortytwo.co.uk>
 * @package Craft
 */
class AuroraVariable
{
    /**
     * Get the Aurora site constant.
     *
     * @return string
     */
    public function getSite()
    {
        return defined('AURORA_SITE') ? AURORA_SITE : 'commercial';
    }

    /**
     * State if the current site is the default commercial site or not.
     *
     * @return bool
     */
    public function getIsCommercial()
    {
        return $this->getSite() === 'commercial';
    }

    /**
     * State if the current site is the magical kids site or not.
     *
     * @return bool
     */
    public function getIsMagical()
    {
        return $this->getSite() === 'magical';
    }

    /**
     * Get the path to a versioned Mix file.
     *
     * @param  string  $path
     * @param  string  $manifestDirectory
     * @return string
     * @throws \Exception
     */
    public function mix($path, $manifestDirectory = '')
    {
        static $manifest;

        $variables = craft()->config->get('environmentVariables');

        $baseUrl = isset($variables['baseAssetUrl']) ? $variables['baseAssetUrl'] : '';
        $manifestDirectory = isset($variables['baseAssetPath']) ? $variables['baseAssetPath'] : '';

        if (! $this->startsWith($path, '/')) {
            $path = "/{$path}";
        }

        if ($manifestDirectory && ! $this->startsWith($manifestDirectory, '/')) {
            $manifestDirectory = "/{$manifestDirectory}";
        }

        if (file_exists($this->publicPath($manifestDirectory.'/hot'))) {
            return "http://localhost:8080{$path}";
        }

        if (! $manifest) {
            if (! file_exists($manifestPath = $this->publicPath($manifestDirectory.'/mix-manifest.json'))) {
                throw new Exception('The Mix manifest does not exist.');
            }

            $manifest = json_decode(file_get_contents($manifestPath), true);
        }

        if (! array_key_exists($path, $manifest)) {
            throw new Exception(
                "Unable to locate Mix file: {$path}. Please check your ".
                'webpack.mix.js output paths and try again.'
            );
        }

        return $baseUrl.$manifest[$path];
    }

    /**
     * @param string $path
     *
     * @return string
     */
    private function publicPath($path = '')
    {
        return AURORA_BASE_PATH . $path;
    }

    /**
     * Determine if a given string starts with a given substring.
     *
     * @param  string  $haystack
     * @param  string|array  $needles
     * @return bool
     */
    private function startsWith($haystack, $needles)
    {
        foreach ((array) $needles as $needle) {
            if ($needle != '' && substr($haystack, 0, strlen($needle)) === (string) $needle) {
                return true;
            }
        }

        return false;
    }
}
