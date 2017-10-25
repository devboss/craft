/**
 * WARNING!
 *
 * This script will DESTROY all order information.
 */

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `craft_commerce_orderadjustments`;
TRUNCATE TABLE `craft_commerce_orderhistories`;
TRUNCATE TABLE `craft_commerce_orders`;
TRUNCATE TABLE `craft_commerce_orderstatus_emails`;
TRUNCATE TABLE `craft_commerce_orderstatuses`;
TRUNCATE TABLE `craft_commerce_paymentcurrencies`;
TRUNCATE TABLE `craft_commerce_producttypes`;
TRUNCATE TABLE `craft_commerce_shippingcategories`;
TRUNCATE TABLE `craft_commerce_shippingmethods`;
TRUNCATE TABLE `craft_commerce_shippingrule_categories`;
TRUNCATE TABLE `craft_commerce_shippingrules`;
TRUNCATE TABLE `craft_commerce_shippingzone_countries`;
TRUNCATE TABLE `craft_commerce_shippingzones`;
TRUNCATE TABLE `craft_commerce_taxcategories`;
TRUNCATE TABLE `craft_commerce_taxrates`;
TRUNCATE TABLE `craft_commerce_taxzone_countries`;
TRUNCATE TABLE `craft_commerce_taxzones`;

INSERT INTO `craft_commerce_orderstatuses` (`id`, `name`, `handle`, `color`, `sortOrder`, `default`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 'Created', 'created', 'yellow', 999, 1, NOW(), NOW(), UUID()),
  (2, 'Processing', 'processing', 'green', 999, 0, NOW(), NOW(), UUID()),
  (3, 'Shipped', 'shipped', 'blue', 999, 0, NOW(), NOW(), UUID()),
  (4, 'Rejected', 'rejected', 'red', 999, 0, NOW(), NOW(), UUID()),
  (5, 'Cancelled', 'cancelled', 'orange', 999, 0, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_paymentcurrencies` (`id`, `iso`, `primary`, `rate`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 'GBP', 1, 1.0000, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_producttypes` (`id`, `fieldLayoutId`, `variantFieldLayoutId`, `name`, `handle`, `hasUrls`, `hasDimensions`, `hasVariants`, `hasVariantTitleField`, `titleFormat`, `skuFormat`, `descriptionFormat`, `template`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, (SELECT id FROM craft_fieldlayouts WHERE type = 'Commerce_Product' LIMIT 1), (SELECT id FROM craft_fieldlayouts WHERE type = 'Commerce_Variant' LIMIT 1), 'Fruit', 'fruit', 1, 1, 0, 0, '{product.title}', NULL, NULL, 'shop/products/_product', NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_shippingcategories` (`id`, `name`, `handle`, `description`, `default`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 'General', 'general', NULL, 1, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_shippingmethods` (`id`, `name`, `handle`, `enabled`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 'Free Shipping', 'freeShipping', 1, NOW(), NOW(), UUID()),
  (2, 'Standard Shipping', 'standardShipping', 1, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_shippingrule_categories` (`id`, `shippingRuleId`, `shippingCategoryId`, `condition`, `perItemRate`, `weightRate`, `percentageRate`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 1, 1, 'allow', NULL, NULL, NULL, NOW(), NOW(), UUID()),
  (2, 2, 1, 'allow', NULL, NULL, NULL, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_shippingrules` (`id`, `shippingZoneId`, `name`, `description`, `methodId`, `priority`, `enabled`, `minQty`, `maxQty`, `minTotal`, `maxTotal`, `minWeight`, `maxWeight`, `baseRate`, `perItemRate`, `weightRate`, `percentageRate`, `minRate`, `maxRate`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 1, 'Free UK Delivery ', 'United Kingdom, free shipping.', 1, 2, 1, 0, 0, 50.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, NOW(), NOW(), UUID()),
  (2, 1, 'Standard UK Delivery', 'United Kingdom, standard shipping.', 2, 1, 1, 0, 0, 0.0000, 50.0000, 0.0000, 0.0000, 3.5000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_shippingzone_countries` (`id`, `shippingZoneId`, `countryId`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 1, (SELECT id
          FROM craft_commerce_countries
          WHERE iso = 'GB'), NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_shippingzones` (`id`, `name`, `description`, `countryBased`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 'United Kingdom', '', 1, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_taxcategories` (`id`, `name`, `handle`, `description`, `default`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 'Standard VAT', 'standardVat', NULL, 1, NOW(), NOW(), UUID()),
  (2, 'Reduced VAT', 'reducedVat', NULL, 1, NOW(), NOW(), UUID()),
  (3, 'Zero VAT', 'zeroVat', NULL, 1, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_taxzones` (`id`, `name`, `description`, `countryBased`, `default`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 'United Kingdom', '', 1, 1, NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_taxzone_countries` (`id`, `taxZoneId`, `countryId`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 1, (SELECT id
          FROM craft_commerce_countries
          WHERE iso = 'GB'), NOW(), NOW(), UUID());

INSERT INTO `craft_commerce_taxrates` (`id`, `taxZoneId`, `taxCategoryId`, `name`, `rate`, `include`, `isVat`, `taxable`, `dateCreated`, `dateUpdated`, `uid`)
VALUES
  (1, 1, 1, 'Standard VAT', 0.2000, 1, 1, 'price', NOW(), NOW(), UUID()),
  (2, 1, 2, 'Reduced rate VAT', 0.0500, 1, 1, 'price', NOW(), NOW(), UUID()),
  (3, 1, 3, 'Zero rate VAT', 0.0000, 1, 1, 'price', NOW(), NOW(), UUID());

SET FOREIGN_KEY_CHECKS = 1;
