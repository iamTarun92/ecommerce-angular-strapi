'use strict';

/**
 * coupon-code service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::coupon-code.coupon-code');
