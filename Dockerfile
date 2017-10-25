FROM alpine:3.6
LABEL Maintainer="Thom Reilly <treilly@resharmonics.com>" \
      Description="Lightweight container with Nginx 1.10 & PHP-FPM 7.1 based on Alpine Linux."

RUN mkdir -p /mnt/efs/prod/logs/craft

## Install packages
#RUN apk --no-cache add build-base curl nginx php7 php7-bcmath php7-ctype php7-curl php7-dev php7-dom \
#    php7-fpm php7-gd php7-imap php7-intl php7-json php7-mbstring php7-mcrypt php7-mysqli php7-opcache \
#    php7-calendar php7-exif php7-fileinfo php7-ftp php7-gettext php7-iconv php7-memcached php7-pcntl \
#    php7-pdo_pgsql php7-pdo_sqlite php7-pgsql php7-posix php7-shmop php7-soap php7-sockets php7-sqlite3 php7-sysvmsg \
#    php7-sysvsem php7-sysvshm php7-tokenizer php7-wddx php7-xmlwriter php7-xsl php7-zip \
#    php7-openssl php7-pear php7-pdo php7-pdo_mysql php7-phar php7-session php7-xml php7-xmlreader php7-zlib supervisor
RUN apk --no-cache add build-base curl nginx php7 php7-bcmath php7-ctype php7-curl php7-dev php7-dom \
    php7-fpm php7-gd php7-imap php7-intl php7-json php7-mbstring php7-mcrypt php7-mysqli php7-opcache \
    php7-openssl php7-pear php7-pdo php7-pdo_mysql php7-phar php7-session php7-xml php7-xmlreader php7-zlib php7-simplexml supervisor

# Install redis
RUN pecl install -o -f redis
RUN echo 'extension=redis.so' > /etc/php7/conf.d/redis.ini

# Create web user
RUN set -x ; \
    addgroup -g 82 -S www-data ; \
    adduser -u 82 -D -S -G www-data www-data && exit 0 ; exit 1
# 82 is the standard uid/gid for "www-data" in Alpine

# Configure nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY build/config/nginx.conf /etc/nginx/nginx.conf

# Configure nginx sites
COPY build/config/sites-enabled/* /etc/nginx/sites-enabled/

# Configure PHP-FPM
RUN mkdir -p /var/run/php
RUN touch /var/run/php/php7.1-fpm.sock
RUN chown www-data:www-data /var/run/php/php7.1-fpm.sock
#RUN mkdir -p /var/log/php7
#RUN touch /var/log/php7/error.log
#RUN chown www-data:www-data /var/log/php7/error.log
COPY build/config/fpm-pool.conf /etc/php7/php-fpm.d/zzz_custom.conf
COPY build/config/php.ini /etc/php7/conf.d/zzz_custom.ini

# Configure supervisord
COPY build/config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Add application
RUN mkdir -p /var/www/html
COPY craft/ /var/www/html/craft/
COPY public/ /var/www/html/public/

# Set permissions
RUN chown -R www-data:www-data /var/www/html/craft/storage

EXPOSE 80 443
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]