'use strict';

/* eslint global-require: 0 */

/** @satisfies {Record<string, import('eslint').Rule.RuleModule>} */
module.exports = {
  'result-check': require('./result-check'),
}