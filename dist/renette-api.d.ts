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
//# sourceMappingURL=renette-api.d.ts.map