"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invariant(value, message) {
    if (value === false || value === null || typeof value === "undefined") {
        throw new Error(message);
    }
}
exports.default = invariant;
