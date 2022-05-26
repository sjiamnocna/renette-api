var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CAPI {
    constructor() {
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
    get isAuthenticated() {
        return Boolean(this.__props.accessKey);
    }
    get isAuthorized() {
        return this.__props.authorized;
    }
    setConfig(config) {
        if (typeof config !== 'object') {
            throw Error('Config must be object');
        }
        this.__config = Object.assign(Object.assign({}, this.__config), config);
    }
    authenticateWithName(serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.__props.preparing) {
                throw Error('Cant have another authentication');
            }
            return this.__props.preparing = new Promise((resolve, reject) => {
                if (this.__props.authenticated) {
                    reject('API already authenticated');
                }
                if (this.isAuthenticated) {
                    reject('API already authenticated');
                }
                this.post({
                    resource: 'Chk',
                    action: 'init',
                    headers: new Headers({
                        'X-Service-Name': serviceName
                    })
                })
                    .then(res => res.json())
                    .then(res => {
                    this.__props.authenticated = false;
                    const accessKey = res.accessKey;
                    if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                        this.__props.accessKey = accessKey;
                        this.__config.defaultHeaders.set('X-Access-Key', accessKey);
                        resolve(accessKey);
                    }
                    else {
                        reject('Something went wrong with access key');
                    }
                });
            }).finally(() => {
                this.__props.authenticated = false;
            });
        });
    }
    authorizeWithKey(serviceKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.__props.preparing;
            return this.__props.preparing = new Promise((resolve, reject) => {
                if (this.__props.authenticated) {
                    reject('API is preparing, wait');
                }
                if (this.__props.authorized) {
                    reject('API already authorized with key');
                }
                if (!this.__props.accessKey) {
                    reject('No access key, run `authenticate` first');
                }
                if (!serviceKey || typeof serviceKey !== 'string') {
                    reject('serviceKey must be present');
                }
                this.post({
                    resource: 'Chk',
                    action: 'authorize',
                    headers: new Headers({
                        'X-Access-Key': this.__props.accessKey,
                        'X-Service-Key': serviceKey,
                    })
                })
                    .then(res => res.json())
                    .then(res => {
                    this.__props.authenticated = false;
                    const accessKey = res.accessKey;
                    if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                        this.__props.accessKey = accessKey;
                        this.__config.defaultHeaders.set('X-Access-Key', accessKey);
                        this.__props.authenticated = true;
                        resolve(accessKey);
                    }
                    else {
                        console.log('reject', res);
                        reject('Something went wrong with access key');
                    }
                });
            });
        });
    }
    connectionClose() {
        this.post({
            resource: 'Chk',
            action: 'connectionClose',
        });
    }
    get(param) {
        return __awaiter(this, void 0, void 0, function* () {
            param.method = 'GET';
            if (param.data) {
                throw Error('Cant use data with GET method');
            }
            return this.__fetch(param);
        });
    }
    post(param) {
        return __awaiter(this, void 0, void 0, function* () {
            param.method = 'POST';
            return this.__fetch(param);
        });
    }
    __fetch(param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.__props.preparing) {
                yield this.__props.preparing;
            }
            const { resource, action, id } = param;
            const method = param.method && this.__config.allowedMethod.includes(param.method) ? String(param.method) : 'GET';
            const path = `${this.__config.apiUri}/${resource}` + (action ? `/${action}` : '') + (id ? `/${id}` : '');
            const headers = this.__config.defaultHeaders;
            param.headers && param.headers.forEach((value, name) => {
                headers.set(name, value);
            });
            const fetchParam = {
                method: method,
                headers: headers,
                body: method !== 'GET' ?
                    JSON.stringify(param.data) : null
            };
            return fetch(path, fetchParam);
        });
    }
}
export default CAPI;
