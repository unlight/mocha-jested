/* eslint-disable */

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getPath = getPath;
exports.interpolateVariables = void 0;

const isPrimitive = value => Object(value) !== value;

function _prettyFormat() {
  const data = require('pretty-format');

  _prettyFormat = function () {
    return data;
  };

  return data;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const interpolateVariables = (title, template, index) =>
  Object.keys(template)
    .reduce(getMatchingKeyPaths(title), []) // aka flatMap
    .reduce(replaceKeyPathWithValue(template), title)
    .replace('$#', '' + index);

exports.interpolateVariables = interpolateVariables;

const getMatchingKeyPaths = title => (matches, key) =>
  matches.concat(title.match(new RegExp(`\\$${key}[\\.\\w]*`, 'g')) || []);

const replaceKeyPathWithValue = template => (title, match) => {
  const keyPath = match.replace('$', '').split('.');
  const value = getPath(template, keyPath);

  if (isPrimitive(value)) {
    return title.replace(match, String(value));
  }

  return title.replace(
    match,
    (0, _prettyFormat().format)(value, {
      maxDepth: 1,
      min: true,
    }),
  );
};
/* eslint import/export: 0*/

function getPath(template, [head, ...tail]) {
  if (!head || !template.hasOwnProperty || !template.hasOwnProperty(head))
    return template;
  return getPath(template[head], tail);
}
