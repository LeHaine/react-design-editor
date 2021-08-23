"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObject = void 0;
const fabric_1 = require("fabric");
/**
 * toObject util
 * @param {*} obj
 * @param {string[]} propertiesToInclude
 * @param {{ [key: string]: any }} [properties]
 */
exports.toObject = (obj, propertiesToInclude, properties) => fabric_1.fabric.util.object.extend(obj.callSuper('toObject'), propertiesToInclude.reduce((prev, property) => Object.assign(prev, {
    [property]: obj.get(property),
}), Object.assign({}, properties)));
