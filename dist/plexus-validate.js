(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["PlexusValidate"] = factory();
	else
		root["PlexusValidate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	eval("/*\nThe MIT License (MIT)\n\nCopyright (c) 2014 The Australian National University\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n*/\n\n'use strict';\n\n\nvar checkNumber = function(schema, instance) {\n  var errors = [];\n\n  if (schema.maximum !== null) {\n    if (instance > schema.maximum)\n      errors.push('may be at most ' + schema.maximum);\n    else if (schema.exclusiveMaximum && instance >= schema.maximum)\n      errors.push('must be less than ' + schema.maximum);\n  }\n  if (schema.minimum !== null) {\n    if (instance < schema.minimum)\n      errors.push('must be at least ' + schema.minimum);\n    else if (schema.exclusiveMinimum && instance <= schema.minimum)\n      errors.push('must be more than ' + schema.minimum);\n  }\n  if (schema.multipleOf != null) {\n    if ((instance / schema.multipleOf) % 1 != 0)\n      errors.push('must be a multiple of ' + schema.multipleOf);\n  }\n\n  return errors;\n};\n\n\nvar fieldErrors = function(errors) {\n  if (errors.length > 0)\n    return [ { path: [], errors: errors } ];\n  else\n    return [];\n};\n\n\nvar validator = {};\n\n\nvalidator.boolean = function(schema, instance) {\n  var errors = [];\n\n  if (typeof instance != 'boolean')\n    errors.push('must be boolean');\n\n  return fieldErrors(errors);\n};\n\n\nvalidator.enum = function(schema, instance) {\n  var errors = [];\n\n  if (schema.enum.indexOf(instance) < 0)\n    errors.push('value not in list');\n\n  return fieldErrors(errors);\n};\n\n\nvalidator.number = function(schema, instance) {\n  var errors = [];\n\n  if (typeof instance != 'number')\n    errors.push('must be a number');\n  else\n    errors = checkNumber(schema, instance);\n\n  return fieldErrors(errors);\n};\n\n\nvalidator.integer = function(schema, instance) {\n  var errors = [];\n\n  if (typeof instance != 'number')\n    errors.push('must be a number');\n  else {\n    errors = checkNumber(schema, instance);\n    if (instance % 1 > 0)\n      errors.unshift('must be an integer');\n  }\n\n  return fieldErrors(errors);\n};\n\n\nvalidator.string = function(schema, instance) {\n  var errors = [];\n\n  if (typeof instance != 'string')\n    errors.push('must be a string');\n  else {\n    if (schema.maxLength != null && instance.length > schema.maxLength)\n      errors.push('may have at most ' + schema.maxLength + ' characters');\n    if (schema.minLength != null && instance.length < schema.minLength)\n      errors.push('must have at least ' + schema.minLength + ' characters');\n    if (schema.pattern != null && !(RegExp(schema.pattern).test(instance)))\n      errors.push('must match ' + schema.pattern);\n  }\n\n  return fieldErrors(errors);\n};\n\n\nvalidator.array = function(schema, instance, context) {\n  var errors = [];\n  var result, i, j;\n\n  if (!Array.isArray(instance))\n    return fieldErrors(['must be an array']);\n  else {\n    if (schema.maxItems != null && instance.length > schema.maxItems)\n      errors.push('may have at most ' + schema.maxItems + ' items');\n    if (schema.minItems != null && instance.length < schema.minItems)\n      errors.push('must have at least ' + schema.minItems + ' items');\n    result = fieldErrors(errors);\n\n    if (schema.items != null) {\n      for (i in instance) {\n        errors = validate(schema.items, instance[i], context);\n        for (j in errors) {\n          result.push({\n            path  : [i].concat(errors[j].path),\n            errors: errors[j].errors\n          });\n        }\n      }\n    }\n  }\n\n  return result;\n};\n\n\nvar requires = function(schema, key) {\n  var subschema;\n\n  if (schema.required != null && schema.required.indexOf(key) >= 0)\n    return 'must be present';\n  else {\n    subschema = schema.properties[key];\n    if (subschema.type == 'array' && subschema.minItems > 0)\n      return 'must have at least ' + subschema.minItems + ' items';\n    else\n      return null;\n  }\n};\n\nvalidator.object = function(schema, instance, context) {\n  var result = [];\n  var key, errors, i;\n\n  if (instance == null)\n    instance = {};\n\n  if (instance.constructor !== Object)\n    result.push({ path: [], errors: ['must be a plain object'] });\n  else {\n    for (key in schema.properties) {\n      if (instance.hasOwnProperty(key)) {\n        errors = validate(schema.properties[key], instance[key], context);\n        for (i = 0; i < errors.length; ++i)\n          result.push({\n            path  : [key].concat(errors[i].path),\n            errors: errors[i].errors\n          });\n      }\n      else if (requires(schema, key)) {\n        result.push({\n          path  : [key],\n          errors: [requires(schema, key)]\n        });\n      }\n    }\n  }\n\n  return result;\n};\n\n\nvar merge = function() {\n  var args = [].slice.call(arguments);\n  var result = args.every(Array.isArray) ? [] : {};\n  var i, obj, key;\n  for (i in args) {\n    obj = args[i];\n    for (key in obj)\n      result[key] = obj[key];\n  }\n  return result;\n};\n\n\nvar without = function(obj) {\n  var args = [].slice.call(arguments);\n  var result = Array.isArray(obj) ? [] : {};\n\n  for (var key in obj)\n    if (args.indexOf(key) < 0)\n      result[key] = obj[key];\n\n  return result;\n};\n\n\nvar getIn = function(root, path) {\n  if (path.length == 0 || root == undefined)\n    return root;\n  else\n    return getIn(root[path[0]], path.slice(1))\n};\n\n\nvar cat = function(arrayOfArrays) {\n  return [].concat.apply([], arrayOfArrays);\n};\n\n\nvar resolve = function(schema, context) {\n  var reference = schema['$ref'];\n\n  if (reference) {\n    if (!reference.match(/^#(\\/([a-zA-Z_][a-zA-Z_0-9]*|[0-9]+))*$/))\n      throw new Error('reference '+reference+' has unsupported format');\n\n    return {\n      allOf: [\n        without(schema, '$ref'),\n        getIn(context, reference.split('/').slice(1))\n      ]\n    };\n  } else\n    return schema;\n};\n\n\nvar validate = function(schema, instance, context) {\n  var effectiveContext = context || schema;\n  var effectiveSchema  = resolve(schema, effectiveContext);\n\n  if (effectiveSchema.allOf) {\n    var results = [without(effectiveSchema, 'allOf')]\n      .concat(effectiveSchema.allOf)\n      .map(function(schema) {\n        return validate(schema, instance, effectiveContext);\n      });\n    return cat(results);\n  } else {\n    var type = effectiveSchema.enum ? 'enum' : effectiveSchema.type;\n    if (type)\n      return validator[type](effectiveSchema, instance, effectiveContext);\n    else\n      return [];\n  }\n};\n\nmodule.exports = validate;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./index.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./index.js?");

/***/ }
/******/ ])
});
;