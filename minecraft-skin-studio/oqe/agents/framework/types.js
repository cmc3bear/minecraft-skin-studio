"use strict";
/**
 * OQE Framework Core Types
 * Defines the structure for quality verification, alignment, and evidence
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeImpact = exports.ObjectiveLevel = void 0;
// Master Plan Objectives
var ObjectiveLevel;
(function (ObjectiveLevel) {
    ObjectiveLevel["CRITICAL"] = "CRITICAL";
    ObjectiveLevel["CORE"] = "CORE";
    ObjectiveLevel["GROWTH"] = "GROWTH"; // Level 3 - Strategic
})(ObjectiveLevel || (exports.ObjectiveLevel = ObjectiveLevel = {}));
// Change Impact Classification
var ChangeImpact;
(function (ChangeImpact) {
    ChangeImpact["CRITICAL_POSITIVE"] = "CRITICAL_POSITIVE";
    ChangeImpact["CORE_POSITIVE"] = "CORE_POSITIVE";
    ChangeImpact["GROWTH_POSITIVE"] = "GROWTH_POSITIVE";
    ChangeImpact["NEUTRAL"] = "NEUTRAL";
    ChangeImpact["MINOR_NEGATIVE"] = "MINOR_NEGATIVE";
    ChangeImpact["MAJOR_NEGATIVE"] = "MAJOR_NEGATIVE";
    ChangeImpact["BLOCKING"] = "BLOCKING";
})(ChangeImpact || (exports.ChangeImpact = ChangeImpact = {}));
