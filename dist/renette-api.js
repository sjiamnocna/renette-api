"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var CAPI = (function () {
    function CAPI() {
        this.__props = {
            preparing: false,
            authenticated: false,
            authorized: false,
            accessKey: '',
        };
        this.__config = {
            apiUri: '/api',
            allowedMethod: ['POST', 'GET'],
            defaultHeaders: new Headers({
                'X-Requested-With': 'XMLHttpRequest',
                'content-type': 'application/json',
            })
        };
    }
    Object.defineProperty(CAPI.prototype, "isAuthenticated", {
        get: function () {
            return Boolean(this.__props.accessKey);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CAPI.prototype, "isAuthorized", {
        get: function () {
            return this.__props.authorized;
        },
        enumerable: false,
        configurable: true
    });
    CAPI.prototype.setConfig = function (config) {
        if (typeof config !== 'object') {
            throw Error('Config must be object');
        }
        this.__config = __assign(__assign({}, this.__config), config);
    };
    CAPI.prototype.authenticateWithName = function (serviceName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.__props.preparing) {
                    throw Error('Cant have another authentication');
                }
                return [2, this.__props.preparing = new Promise(function (resolve, reject) {
                        if (_this.__props.authenticated) {
                            reject('API already authenticated');
                        }
                        if (_this.isAuthenticated) {
                            reject('API already authenticated');
                        }
                        _this.post({
                            resource: 'Chk',
                            action: 'init',
                            headers: new Headers({
                                'X-Service-Name': serviceName
                            })
                        })
                            .then(function (res) { return res.json(); })
                            .then(function (res) {
                            _this.__props.authenticated = false;
                            var accessKey = res.accessKey;
                            if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                                _this.__props.accessKey = accessKey;
                                _this.__config.defaultHeaders.set('X-Access-Key', accessKey);
                                resolve(accessKey);
                            }
                            else {
                                reject('Something went wrong with access key');
                            }
                        });
                    }).finally(function () {
                        _this.__props.authenticated = false;
                    })];
            });
        });
    };
    CAPI.prototype.authorizeWithKey = function (serviceKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.__props.preparing];
                    case 1:
                        _a.sent();
                        return [2, this.__props.preparing = new Promise(function (resolve, reject) {
                                if (_this.__props.authenticated) {
                                    reject('API is preparing, wait');
                                }
                                if (_this.__props.authorized) {
                                    reject('API already authorized with key');
                                }
                                if (!_this.__props.accessKey) {
                                    reject('No access key, run `authenticate` first');
                                }
                                if (!serviceKey || typeof serviceKey !== 'string') {
                                    reject('serviceKey must be present');
                                }
                                _this.post({
                                    resource: 'Chk',
                                    action: 'authorize',
                                    headers: new Headers({
                                        'X-Access-Key': _this.__props.accessKey,
                                        'X-Service-Key': serviceKey,
                                    })
                                })
                                    .then(function (res) { return res.json(); })
                                    .then(function (res) {
                                    _this.__props.authenticated = false;
                                    var accessKey = res.accessKey;
                                    if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                                        _this.__props.accessKey = accessKey;
                                        _this.__config.defaultHeaders.set('X-Access-Key', accessKey);
                                        _this.__props.authenticated = true;
                                        resolve(accessKey);
                                    }
                                    else {
                                        console.log('reject', res);
                                        reject('Something went wrong with access key');
                                    }
                                });
                            })];
                }
            });
        });
    };
    CAPI.prototype.connectionClose = function () {
        this.post({
            resource: 'Chk',
            action: 'connectionClose',
        });
    };
    CAPI.prototype.get = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                param.method = 'GET';
                if (param.data) {
                    throw Error('Cant use data with GET method');
                }
                return [2, this.__fetch(param)];
            });
        });
    };
    CAPI.prototype.post = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                param.method = 'POST';
                return [2, this.__fetch(param)];
            });
        });
    };
    CAPI.prototype.__fetch = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var resource, action, id, method, path, headers, fetchParam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.__props.preparing) return [3, 2];
                        return [4, this.__props.preparing];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        resource = param.resource, action = param.action, id = param.id;
                        method = param.method && this.__config.allowedMethod.includes(param.method) ? String(param.method) : 'GET';
                        path = "".concat(this.__config.apiUri, "/").concat(resource) + (action ? "/".concat(action) : '') + (id ? "/".concat(id) : '');
                        headers = this.__config.defaultHeaders;
                        param.headers && param.headers.forEach(function (value, name) {
                            headers.set(name, value);
                        });
                        fetchParam = {
                            method: method,
                            headers: headers,
                            body: method !== 'GET' ?
                                JSON.stringify(param.data) : null
                        };
                        return [2, fetch(path, fetchParam)];
                }
            });
        });
    };
    return CAPI;
}());
exports.default = CAPI;
