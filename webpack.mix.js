const path = require( 'path' );
const { mix } = require( 'laravel-mix' );
const environment = require( './scripts/environment' );

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

const cartAssistSassOptions = {
    data: '$base-url: "' + environment.baseUrl + '";'
};

mix
    .options( {
        publicPath: 'public',
        babel: {
            cacheDirectory: true,
            presets: [
                [ 'env', {
                    'modules': false,
                    'targets': {
                        'browsers': [
                            '> 2%',
                            'ie >= 11',
                            'ff >= 50',
                            'Chrome >= 55',
                            'Safari >= 9.1',
                            'Opera >= 42',
                            'ie_mob >= 11',
                            'iOS >= 9.3',
                            'Android >= 5.6',
                            'bb >= 10',
                            'Samsung >= 4'
                        ],
                        uglify: true
                    }
                } ]
            ]
        }
    } )

    // Aurora Vue.js applications for booking and management portals
    .webpackConfig( {
        module: {
            noParse: [ /moment.js/ ]
        },
        resolve: {
            alias: {
                CSSPlugin: path.resolve( __dirname, 'node_modules/gsap/src/uncompressed/plugins/CSSPlugin.js' ),
                EasePack: path.resolve( __dirname, 'node_modules/gsap/src/uncompressed/easing/EasePack.js' ),
                ScrollToPlugin: path.resolve( __dirname, 'node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js' ),
                TweenLite: path.resolve( __dirname, 'node_modules/gsap/src/uncompressed/TweenLite.js' )
            }
        }
    } )
    .js( 'resources/js/aurora/account.js', 'public/js' )
    .js( 'resources/js/aurora/booking-portal.js', 'public/js' )
    .js( 'resources/js/aurora/manage-my-booking.js', 'public/js' )
    .js( 'resources/js/main.js', 'public/js' )
	.js( 'resources/js/ga-actions.js', 'public/js' )
    .extract( [
        'jquery',
        'lodash',
        'vue',
        'axios',
        'vue-multiselect',
        'vuejs-datepicker',
        'vue-analytics',
        'vuex',
        'popper.js',
        'tooltip.js',
        'v-tooltip',
        '@vimeo/player',
        'immutable',
        'lazysizes',
        'moment',
        'picturefill',
        'pixi.js',
        'redux',
        'redux-immutable',
        'redux-thunk',
        'run-series',
        'simplex-noise',
        'svg4everybody',
        'swiper',
        'throttle-debounce',
        'vue-template-compiler'
    ] )
    .copy( 'node_modules/vue-multiselect/dist/vue-multiselect.min.css', 'public/css' )
    .copy( 'resources/js/utils/detect.js', 'public/js' )

    .sass( 'resources/sass/cart-assist-embedded-widget.scss', 'public/css', cartAssistSassOptions )
    .sass( 'resources/sass/cart-assist-floating-widget.scss', 'public/css', cartAssistSassOptions )
    .sass( 'resources/sass/cart-assist-support-page.scss', 'public/css', cartAssistSassOptions )
    .sass( 'resources/sass/styles.scss', 'public/css' )
    .options( {
        processCssUrls: false,
        postCss: [
            require( 'postcss-discard-comments' )( {
                removeAll: true
            } )
        ]
    } );

if ( mix.config.inProduction ) {
    /**
     * Mix doesn't allow you to version files granularly and we don't want to version cart assist files. The easiest way
     * around this (although hacky) is to let the versioning happen then rewrite the files afterwards
     */
    mix.version();
}

if ( !mix.config.inProduction ) {
    mix
        .disableNotifications()
        .browserSync( {
            proxy: {
                target: 'lapland-website.app',
                middleware: function ( req, res, next ) {
                    res.setHeader( 'Access-Control-Allow-Origin', '*' );
                    next();
                }
            }
        } );

    if ( process.env.SOURCEMAPS !== 'false' ) {
        mix.sourceMaps();
    }
}
