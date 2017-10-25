# LaplandUK Website

## Prerequisites

* Node + NPM, preferably installed via [NVM](https://github.com/creationix/nvm)
* [Composer](https://getcomposer.org/download/)
* [Vagrant](https://www.vagrantup.com/downloads.html)
* [Virtualbox](https://www.virtualbox.org/wiki/Downloads)

## To set up local environment

* Navigate to project folder
* `nvm use` - makes sure correct version is used from `.nvmrc` file
* `npm install`
* `composer install`
* add `lapland-website.app` to your hosts file, pointing to `192.168.10.106`
* `vagrant up` - If this hangs make sure you have the latest versions of vagrant and virtualbox installed
* Once vagrant box is running
* `vagrant ssh`
* `sudo apt update`
* `sudo apt install php7.1-mcrypt php-redis` - If asked to overwrite php.ini during this process choose keep local version
* `sudo service php7.1-fpm restart`
* `sudo nano /etc/mysql/my.cnf`
* Add the following to the end:
```
[mysqld]
sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"
```
* `sudo service mysql restart`
* Browse to 'http://lapland-website.app/admin' to install Craft CMS
* `cd craft/plugins/aurora`
* `composer install`
* Navigate to http://lapland-website.app/admin/settings/plugins and install Aurora plugin

Don't destroy the vagrant box, only `vagrant suspend` or `vagrant halt` it!

## Front End Setup

### NPM Scripts

The project uses [Laravel Mix](https://laravel.com/docs/5.4/mix) as an interface to webpack. On top of the existing npm scripts provided by that are the following:

* `npm run watch` - Default laravel mix task has been set up to compile SASS and JS and open a tab in chrome to `http://localhost:3000` with browsersync running. SASS changes will be auto injected and JS changes will auto reload page. Vagrant box must be running.
* `npm run images` - reads all images from within `resources/images-uncompressed`, compresses them via pngquant and jpeg-recompress and copies into `public/images` retaining folder structure. It also outputs a map of image dimensions to `resources/sass/settings/_image-data.scss` for use with the image mixins (detailed below). **All images must be saved in this way as contents of `public/images` will be deleted by script**
* `npm run svg` - reads all svgs from within `resources/svg-src`, optimizes them via svgo into `resources/svg-optimized` and then compiles into a single sprite at `public/images/svg/sprite.svg`. Individual icons should then be inserted into the page with the svg `<use>` tag. SVG dimensions are also output to `resources/sass/settings/_svg-data.scss` for use with the SVG mixins.

### Deploy to staging

`ssh -i /PATH/TO/PEM/FILE/craft-cms.pem ubuntu@54.154.176.66`
`cd /home/ubuntu/cms.rerumapp.com`
`git pull`

### BEM and ITCSS

The project uses [BEM syntax](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) as CSS naming convention, with the modifier / variation method [detailed here](https://webuild.envato.com/blog/chainable-bem-modifiers/). [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/) is used for the folder structure.

### Image mixins

Image mixins are in `resources/sass/tools/_image-mixins.scss`. Notable ones are:

* `background-image( $relativePath, $backgroundSize: 100% )` - This accepts a path to an image relative to the `public/images/backgrounds` folder, and optionally a property to use for the `background-size` rule. It outputs a `background-image` rule as well as a retina breakpoint with the appropriate retina `background-image` rule.
* `background-image-dimensions( $relativePath, $width: auto, $height: auto, $scale: 1 )` - Is intended to work alongside `background-image` and will output `width` and `height` css properties. It accepts a path to an image relative to the `public/images/backgrounds` folder and optional parameters for width, height and scale. By default it will output the width and height values of the image itself, read from `resources/sass/settings/_image-data.scss`. If height or width are supplied it will calculate the other dimension based on the image aspect ratio. If scale is supplied it will scale the dimensions down accordingly.
* `image-title( $name, $margins, $breakpoint-scales )` - Accepts the name of an image from `public/images/backgrounds/titles`, a list of margins in the order top, right, bottom, left, and a map of breakpoint names to scales. See further explanation below and usage in `resources/sass/components/_image-title.scss`

### Image titles

As all H1 tags use background images rather than text, in order to lay them out and scale them easily at different breakpoints the `image-title` mixin, described above, can be used (In practice, use the setup in `_image-title.scss` component, which calls the `image-title` mixin). The scales at different breakpoints have been preset and should work nicely across all titles. The margins, however, need to be measured for **every** image. Given that all of the titles are transparent with sketch marks surrounding the actual text, the margins are measured from the edge of the image to the edge of the typography itself. These are then used as negative margins on the layout box, so that any surrounding elements are laid out correctly. These numbers should be provided in CSS pixels (so half of retina PSDs). Here is an example from the Directions image:

![directions](docs/images/image-title-example.jpg "Directions title example")

These margins should be added to the `$image-titles` map in `resources/sass/components/_image-title.scss`, in the order: top, right, bottom, left.

### Media Queries

These are pulled from the latest version of [Foundation](http://foundation.zurb.com/sites/docs/media-queries.html), the syntax has changed slightly from previous versions. src is here: `resources/sass/tools/_media-queries.scss`

### Visibility Classes

These are pulled from the latest version of [Foundation](http://foundation.zurb.com/sites/docs/visibility.html). src is here: `resources/sass/utilities/_visibility.scss`

### Flex Grid

The grid is custom build using flex box and mixes some of the concepts used in [Foundation](http://foundation.zurb.com/sites/docs/grid.html) and [Bootstrap](https://v4-alpha.getbootstrap.com/layout/grid/) frameworks. In general the Foundation syntax is used, with some extra flexbox relevant classes from Bootstrap ( `.-justify-content-*`, `.-align-items-*`, `.-flex-first`, `.offset-*` ). Take a look at `resources/sass/objects/_flex-grid.scss` for the setup.
More detailed docs are [here](./docs/flex-grid.md)

## JS Components

The Javascript is set up as a component based system. These are stored within `resources/js/components`, any CSS styles required by a component should be stored within `resources/scss/components`. All JS Components are ES6 classes which should extend `resources/js/components/AbstractComponent.js`. To make a component available for instantiation you must import it into `resources/js/main.js` and register it by name in the `classRegistry`. You should be able to see how this is easily done with existing components. Once the component is registered you can attach it to a dom element by adding the attribute `data-class="NAME"` where `NAME` is the string used when registering it in the classRegistry. Components are instantiated in a tree structure matching the DOM. Take a look at the documented source from `AbstractComponent.js` for the life cycle methods. Redux + Immutable are used for state storage. More docs to follow!

### Component methods and life cycle

* `constructor` - do constructor type stuff. If you need to access child components you can do this after calling `super()`, with the `findDescendantByClass` and `findDescendantsByClass` methods. You can also dispatch actions to the redux store, to set up any initial state, without triggering any view updates.
* `init` - this will be called after all components have been subscribed to the redux store and also after `onResize` has been fired for the first time.
* `onStateChanged` - this is called whenever a state change happens to the redux store, the first argument is the new state, the second is the last state (these are the whole state tree). Helper methods exist in `resources/js/utils/stateHelpers.js` for comparing granular state changes. If you return `false` from this method it will stop changes from propagating down the component tree hierarchy.
* `onResize` - this is called whenever a window resize event is fired.
* `dispatch` - convenience method for dispatching actions on the redux store.
* `stateGet` - convenience method for retrieving state from the store. In general, you normally only need to access state from the parameters in `onStateChanged` but occasionally you may need to access current state directly.
* `instantiateDescendant` - This will instantiate a single descendant component and its children, by passing the jQuery element attached to that component.
* `instantiateDescendants` - This is called in the constructor of `AbstractComponent.js` and walks the DOM to look for JS components to instantiate. You shouldn't need to manually call it yourself unless you need to create dynamic DOM elements which themselves are JS components. If so, first insert new elements into the DOM, then call it by passing a DOM element that contains the newly inserted DOM. Be careful as currently there is no check to prevent double instantiation of components.
* `destroy` - Destroys this component and all child components, propagating down the component hierarchy. It does not remove anything from the DOM.
* `destroyDescendant` - This will destroy a single component and its children by passing a component instance. It does not remove anything from the DOM.
* `destroyDescendantComponents` - This will destroy all child components and will propagate down the component hierarchy. It does not remove anything from the DOM.

## CraftCMS

### Config

Configuration for CraftCMS is located in `craft/config`.
All config files are PHP arrays which can be nested per domain e.g.

```php
return [
    '*' => [
        // Config here applies to all domains
    ],
    'www.laplanduk.co.uk' => [
        // Config here applies only to www.laplanduk.co.uk
    ], 
]
```

* `db.php` contains database connection info
* `general.php` contains most settings
* `rediscache.php` contains redis connection info
* `routes.php` contains static route info e.g. for booking portal and MMB

### Templates

Templates are located in `craft/templates` and use the Twig templating language.

There are some special properties provided by the Aurora plugin to allow for conditional statements based on
the main website (`isComercial`) vs. the little people's website (`isMagical`).

lapland-website.app
```html
{% if craft.aurora.isCommercial %}
    <p>Welcome to the LaplandUK.</p>
{% endif %}
```

magic-website.app
```html
{% if craft.aurora.isMagical %}
    <p>Welcome to the magical land of Father Christmas!</p>
{% endif %}
```

### CMS managed pages

- [x] Our famous friends
- [x] Gallery
- [x] History
- [x] Reviews
- [x] What is LaplandUK?
- [x] Directions
- [x] Superstar Days
- [ ] Local Hotels
- [x] Frequently Asked Questions
- [ ] Work for LaplandUK

### CMS managed assets

Assets uploaded to CraftCMS need to reside in Amazon S3 so they can be shared across instances.
This is easy to configure go to `Settings > Assets > Asset Sources`.
Modify the existing source labeled `Assets` to use Amazon S3.


### SEO and page titles

The site uses an SEO plugin to manage social sharing options and page titles.
This will need to be configured before launch.

## Deployment

### Production assets

Before building the docker image it is vital to ensure that the latest production assets have been checked in.
Do this by first running `yarn run production` and checking in the resulting changes to GIT.

### Docker image

The configuration for the server built by docker is in `build/config`

* `sites-enabled/www.laplanduk.co.uk` contains the Nginx config for the main domain
* `fpm-pool.conf` is the configuration for PHP-FPM which manages the PHP processes
* `nginx.conf` contains the main Nginx config e.g. GZIP settings
* `php.ini` main config file for PHP
* `supervisord.conf` config for the task runner responsible for starting Nginx & PHP-FPM

The Docker file is in the root directory. It is based on Alpine Linux 3.6 with Nginx 1.10 & PHP 7.1.

### Environment variables

For the staging and live deployment configs environment variables have been set to simplify deployment and configuration.

* `CRAFT_DB_HOST`
* `CRAFT_DB_NAME`
* `CRAFT_DB_USER`
* `CRAFT_DB_PASS`
* `CRAFT_CACHE_HOST`
* `CRAFT_CACHE_PORT`
* `CRAFT_CACHE_PASS`
* `CRAFT_CACHE_DB`
* `CRAFT_CACHE_TIMEOUT`
* `CRAFT_DEV_MODE`

### CraftCMS License Key

The CraftCMS license key is checked into the GIT repo.
This key can only be active on 1 domain at a time.
Once the live site has been launched you will need to log into the admin section `www.laplanduk.co.uk/admin`.
Then click on the prompt to transfer the license key to the new domain.
This transfer is automatic and can happen as many times as needed.

### Cart assist

For ease of deployment as many assets as possible are kept on the Lapland servers, but the CSS for the floating widget
and embedded widget must be pasted into the cart assist admin interface. The support center templates themselves are
inside the `cart-assist` folder for version control only and these must also be pasted into the admin interface.

A support center has been set up for both Staging (elfhelpstaging.laplanduk.co.uk) and Production 
(elfhelp.laplanduk.co.uk) environments and each has corresponding versions of the embedded and floating widgets.

For convenience during development it's possible to paste in import URLs pointing to a local CSS file into the embedded
and widget's admin interfaces: `@import url("http://localhost:3000/css/cart-assist-embedded-widget.css");`. This doesn't
work for the floating widget as the CSS is further processed by cart assist and can't be used for production as there is 
a FOUC at initial load.

To handle loading image and font assets from the lapland servers full absolute URLs are used. These are prepended
automatically provided the correct environment script is run: `npm run production` or `npm run staging`. A couple of
gotchas:

* The floating widget fails to use retina images when the CSS is minified, currently there isn't a straightforward way
to turn this off with laravel mix, so use [CSS Beautifier](https://www.cleancss.com/css-beautify/) as an intermediate 
step
* The embedded widget CSS outputs a font import on the first line without quotes, these need manually readding otherwise 
cart assist will mangle the CSS 
* The master template file contains hardcoded references to the different lapland servers, make sure these remain 
consistent with the relevant environment when editing
