export interface API_props {
    preparing: Promise<any> | false;
    authenticated: boolean;
    authorized: boolean;
    accessKey: string;
}
export interface API_config_modifier {
    apiUri?: string;
    allowedMethod?: string[];
    defaultHeaders?: Headers;
}
export interface API_config {
    apiUri: string;
    allowedMethod: string[];
    defaultHeaders: Headers;
}
export interface API_fetch_param {
    resource: string;
    action: string;
    method?: 'GET' | 'POST';
    headers?: Headers;
    data?: object;
    id?: number;
}
declare class CAPI {
    __props: API_props;
    __config: API_config;
    get isAuthenticated(): boolean;
    get isAuthorized(): boolean;
    setConfig(config: API_config_modifier): void;
    authenticateWithName(serviceName: string): Promise<string>;
    authorizeWithKey(serviceKey: string): Promise<any>;
    connectionClose(): void;
    get(param: API_fetch_param): Promise<any>;
    post(param: API_fetch_param): Promise<any>;
    __fetch(param: API_fetch_param): Promise<any>;
}
export default CAPI;
//# sourceMappingURL=renette-api.d.ts.map