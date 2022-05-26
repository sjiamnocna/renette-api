export interface API_props {
    preparing: Promise<any> | false,
    authenticated: boolean,
    authorized: boolean,
    accessKey: string
}

export interface API_config_modifier {
    apiUri?: string,
    allowedMethod?: string[],
    defaultHeaders?: Headers
}

export interface API_config {
    apiUri: string,
    allowedMethod: string[],
    defaultHeaders: Headers
}

export interface API_fetch_param {
    resource: string,
    action: string,
    method?: 'GET' | 'POST',
    headers?: Headers,
    data?: object
    id?: number,
}

class CAPI {
    /**
     * @var bool    Locked for initialization
     * @var string  Access key to use to authenticate each request
     * @var bool    If the API is authorized via key or not
     * @var string  API Base URI
     */
    __props: API_props = {
        preparing: false,
        authenticated: false,
        authorized: false,
        accessKey: '',
    }

    __config: API_config = {
        apiUri: '/api',
        allowedMethod: ['POST', 'GET'],
        defaultHeaders: new Headers({
            'X-Requested-With': 'XMLHttpRequest',
            'content-type': 'application/json',
        })
    }

    /** the session is authenticated via access key */
    get isAuthenticated(): boolean {
        return Boolean(this.__props.accessKey)
    }

    /** the session is authorized via service name and key */
    get isAuthorized(): boolean {
        return this.__props.authorized
    }

    /** Configuration of the module */
    setConfig(config: API_config_modifier): void {
        if (typeof config !== 'object') {
            throw Error('Config must be object')
        }

        this.__config = {
            ...this.__config,
            ...config,
        }
    }

    /**
     * Authenticate session with service name
     * @param function Function after the work is done
     */
    async authenticateWithName(serviceName: string): Promise<string> {
        // must be unique process
        if (this.__props.preparing){
            throw Error('Cant have another authentication')
        }

        return this.__props.preparing = new Promise<string>((resolve, reject) => {
            if (this.__props.authenticated) {
                reject('API already authenticated')
            }
            if (this.isAuthenticated) {
                reject('API already authenticated')
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
                    this.__props.authenticated = false

                    const accessKey = res.accessKey

                    if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                        this.__props.accessKey = accessKey
                        this.__config.defaultHeaders.set('X-Access-Key', accessKey)
                        resolve(accessKey)
                    } else {
                        reject('Something went wrong with access key')
                    }
                })
        }).finally(() => {
            this.__props.authenticated = false
        })
    }

    /** Authorizes current service with service key */
    async authorizeWithKey(serviceKey: string): Promise<any> {
        // wait until the authentication completes
        await this.__props.preparing;

        return this.__props.preparing = new Promise((resolve, reject) => {
            if (this.__props.authenticated) {
                reject('API is preparing, wait')
            }
            if (this.__props.authorized) {
                reject('API already authorized with key')
            }
            if (!this.__props.accessKey) {
                reject('No access key, run `authenticate` first')
            }
            if (!serviceKey || typeof serviceKey !== 'string') {
                reject('serviceKey must be present')
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
                    this.__props.authenticated = false
                    const accessKey = res.accessKey

                    if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                        this.__props.accessKey = accessKey
                        this.__config.defaultHeaders.set('X-Access-Key', accessKey)
                        this.__props.authenticated = true;
                        resolve(accessKey)
                    } else {
                        console.log('reject', res);
                        reject('Something went wrong with access key')
                    }
                })
        })
    }

    /** Close connection */
    connectionClose(): void{
        this.post({
            resource: 'Chk',
            action: 'connectionClose',
        })
    }


    /**
     * Get request
     * @param param Fetch arguments except data (only for POST)
     * @returns promise
     */
    async get(param: API_fetch_param): Promise<any> {

        param.method = 'GET'

        if (param.data) {
            // cannot use data with GET method
            throw Error('Cant use data with GET method')
        }

        return this.__fetch(param)
    }

    /**
     * Post request
     * @param param Fetch arguments
     * @returns promise
     */
    async post(param: API_fetch_param): Promise<any> {

        param.method = 'POST'

        return this.__fetch(param)
    }

    /**
    * 
    * @param object Fetch API data
    *  'resource'  string  (reqired)
    *  'action'    string  if not set, default action is used
    *  'id'        int     resource id
    *  'method'    HTTP2   REST method ['GET', 'PUT'] (POST is default)
    *  'headers'   Object  Key => Value pairs
    *  'data'      Object  Key => Value pairs, data used to create request body
    * @returns promise
    */
    async __fetch(param: API_fetch_param, ): Promise<any> {
        // wait until the authentication completes
        if (this.__props.preparing){
            await this.__props.preparing;
        }
        
        const { resource, action, id } = param
        const method: string = param.method && this.__config.allowedMethod.includes(param.method) ? String(param.method) : 'GET'
        const path = `${this.__config.apiUri}/${resource}` + (action ? `/${action}` : '') + (id ? `/${id}` : '')
        
        const headers = this.__config.defaultHeaders;

        // merge headers
        param.headers && param.headers.forEach((value, name) => {
            headers.set(name, value)
        })

        const fetchParam: RequestInit = {
            method: method,
            headers: headers,
            body: method !== 'GET' ? // if request is GET, body is not allowed
                JSON.stringify(param.data) : null
        }

        return fetch(path, fetchParam)
    }
}

exports.CAPI = CAPI