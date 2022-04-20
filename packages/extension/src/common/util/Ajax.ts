import Constants, { getEnv } from "./Constants";
import SecurityUtils from "./SecurityUtils";
import _ from "lodash";

class RequestConfigBuilder {
  private mContent?: any;
  private mParams?: {};
  private mFormData?: {};
  private mResponseType?: ResponseType;
  private mHeaders: {};

  constructor() {
    this.mHeaders = {};
    this.mHeaders[Constants.Headers.CONTENT_TYPE] = Constants.JSON_LD_MIME_TYPE;
    this.mHeaders[Constants.Headers.ACCEPT] = Constants.JSON_LD_MIME_TYPE;
    this.mResponseType = undefined;
  }

  public content(value: any): RequestConfigBuilder {
    this.mContent = value;
    return this;
  }

  public contentType(value: string): RequestConfigBuilder {
    this.mHeaders[Constants.Headers.CONTENT_TYPE] = value;
    return this;
  }

  public params(value: {}): RequestConfigBuilder {
    this.mParams = value;
    return this;
  }

  public formData(value: {}): RequestConfigBuilder {
    this.mFormData = value;
    return this;
  }

  public param(paramName: string, paramValue?: string): RequestConfigBuilder {
    if (paramValue !== undefined) {
      const p = {};
      p[paramName] = paramValue;
      this.mParams = Object.assign({}, this.mParams, p);
    }
    return this;
  }

  public accept(value: string): RequestConfigBuilder {
    this.mHeaders[Constants.Headers.ACCEPT] = value;
    return this;
  }

  public responseType(value: ResponseType): RequestConfigBuilder {
    this.mResponseType = value;
    return this;
  }

  public header(headerName: string, value?: string): RequestConfigBuilder {
    if (value !== undefined) {
      const h = {};
      h[headerName] = value;
      this.headers(h);
    }
    return this;
  }

  public headers(value: {}): RequestConfigBuilder {
    this.mHeaders = Object.assign({}, this.mHeaders, value);
    return this;
  }

  public getContent() {
    return this.mContent;
  }

  public getContentType() {
    return this.mHeaders[Constants.Headers.CONTENT_TYPE];
  }

  public getParams() {
    return this.mParams;
  }

  public getFormData() {
    return this.mFormData;
  }

  public getHeaders() {
    return this.mHeaders;
  }

  /**
   * This should be used sparsely.
   *
   * It is mainly to support downloading binary files.
   */
  public getResponseType() {
    return this.mResponseType;
  }
}

export function content(value: any): RequestConfigBuilder {
  return new RequestConfigBuilder().content(value);
}

export function contentType(value: string): RequestConfigBuilder {
  return new RequestConfigBuilder().contentType(value);
}

export function params(value: {}): RequestConfigBuilder {
  return new RequestConfigBuilder().params(value);
}

export function accept(value: string): RequestConfigBuilder {
  return new RequestConfigBuilder().accept(value);
}

export function param(paramName: string, value?: string) {
  return new RequestConfigBuilder().param(paramName, value);
}

export function header(headerName: string, value?: string) {
  return new RequestConfigBuilder().header(headerName, value);
}

export function headers(value: {}) {
  return new RequestConfigBuilder().headers(value);
}

export function ifModifiedSince(value?: string) {
  return new RequestConfigBuilder().header(
    Constants.Headers.IF_MODIFIED_SINCE,
    value
  );
}

export function paramsSerializer(paramData: {} | undefined) {
  if (!paramData) {
    return "";
  }

  const keys = Object.keys(paramData);
  let options = "";

  keys.forEach((key) => {
    const isParamTypeObject = typeof paramData[key] === "object";
    const isParamTypeArray = isParamTypeObject && paramData[key].length >= 0;
    if (!paramData[key]) {
      return;
    }

    if (!isParamTypeObject) {
      options += `${key}=${encodeURIComponent(paramData[key])}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      paramData[key].forEach((element: any) => {
        options += `${key}=${encodeURIComponent(element)}&`;
      });
    }
  });

  return options ? `?${options.slice(0, -1)}` : options;
}

const callFetch = (baseURL: string, path: string, config) => {
  // pre-request interceptor
  config.headers[Constants.Headers.AUTHORIZATION] = SecurityUtils.loadToken();
  if (['GET', 'HEAD'].includes(config.method) && config.body){
    console.warn('Fetch request includes body in a get/head requested, deleting:: ', config.body);
    delete config.body
  } 
  return fetch(`${baseURL}${path}`, config).then((response: Response) => {
    // TODO: add validate get status
    if (!response.ok) {
      if (response.status === Constants.STATUS_UNAUTHORIZED) {
        SecurityUtils.clearToken();
        // TODO: how to handle unauthorized?
        console.log("user unauthorized!");
      }
      throw new Error("Fetch failed");
    }
    if (response.headers && response.headers[Constants.Headers.AUTHORIZATION]) {
      SecurityUtils.saveToken(
        response.headers[Constants.Headers.AUTHORIZATION]
      );
    }

    if (response.status !== 201 && response.status !== 204) {
      return response.json();
    }

    return;
  });
};

const fetchConfig = {
  method: "POST",
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
    Accept: "application/ld+json",
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

const createFetchInstance = ({ baseURL }: { baseURL: string }) => ({
  head(path, config = {}) {
    return callFetch(
      baseURL,
      path,
      Object.assign(fetchConfig, config, { method: "HEAD" })
    );
  },
  get(path, config = {}) {
    return callFetch(
      baseURL,
      path,
      Object.assign(fetchConfig, config, { method: "GET" })
    );
  },
  post(path, body, config = {}) {
    return callFetch(
      baseURL,
      path,
      Object.assign(fetchConfig, config, {
        body: body ? JSON.stringify(body) : null,
        method: "POST",
      })
    );
  },
  put(path, body, config = {}) {
    return callFetch(
      baseURL,
      path,
      Object.assign(fetchConfig, config, {
        body: body ? JSON.stringify(body) : null,
        method: "PUT",
      })
    );
  },
  del(path, config = {}) {
    return callFetch(
      baseURL,
      path,
      Object.assign(fetchConfig, config, { method: "DELETE" })
    );
  },
});

export class Ajax {
  protected fetchInstance;

  constructor({ baseURL }: { baseURL: string }) {
    this.fetchInstance = createFetchInstance({
      baseURL,
    });
  }

  /**
   * Custom status validator for Axios, which accepts 304 Not Modified as a non-error status.
   * @param status HTTP response status
   */
  private static validateGetStatus(status: number): boolean {
    return (status >= 200 && status < 300) || status === 304;
  }

  /**
   * Performs a HTTP HEAD request and returns the raw Axios response object.
   * @param path URL path
   * @param config Request configuration
   */
  public head(
    path: string,
    config: RequestConfigBuilder = new RequestConfigBuilder()
  ) {
    const conf = {};
    return this.fetchInstance.head(
      path + paramsSerializer(config.getParams()),
      conf
    );
  }

  /**
   * Gets response from the server and returns its content.
   */
  public get(
    path: string,
    config: RequestConfigBuilder = new RequestConfigBuilder()
  ) {
    return this.getResponse(path, config);
  }

  /**
   * Gets response from the server and returns it.
   */
  public getResponse(
    path: string,
    config: RequestConfigBuilder = new RequestConfigBuilder()
  ) {
    const conf = {
      params: config.getParams(),
      headers: config.getHeaders(),
      responseType: config.getResponseType(),
      validateStatus: Ajax.validateGetStatus,
    };
    return this.fetchInstance.get(path + paramsSerializer(params), conf);
  }

  public post(path: string, config: RequestConfigBuilder) {
    const conf = {
      headers: config.getHeaders(),
    };
    delete conf.headers[Constants.Headers.ACCEPT];
    const par = new URLSearchParams();
    // @ts-ignore
    const paramData: object =
      config.getParams() !== undefined ? config.getParams() : {};
    Object.keys(paramData).forEach((n) => par.append(n, paramData[n]));

    const formData: object =
      config.getFormData() !== undefined ? config.getFormData()! : {};
    if (config.getContentType() === Constants.X_WWW_FORM_URLENCODED) {
      // TODO: we probably don't need this (hasn't been tested)
      return this.fetchInstance.post(path, par, conf);
    } else if (config.getContentType() === Constants.MULTIPART_FORM_DATA) {
      // TODO: we probably don't need this (hasn't been tested)
      return this.fetchInstance.post(path, formData, conf);
    } else {
      const query: string = config.getParams() ? "?" + par.toString() : "";
      return this.fetchInstance.post(
        path + paramsSerializer(config.getParams()),
        config.getContent(),
        conf
      );
    }
  }

  public put(path: string, config: RequestConfigBuilder) {
    const conf = {
      headers: config.getHeaders(),
    };
    const pathWithParams = path + paramsSerializer(config.getParams());
    if (
      config.getContentType() === Constants.MULTIPART_FORM_DATA &&
      config.getFormData()
    ) {
      return this.fetchInstance.put(pathWithParams, config.getFormData(), conf);
    }
    return this.fetchInstance.put(pathWithParams, config.getContent(), conf);
  }

  public delete(path: string, config?: RequestConfigBuilder) {
    let conf: any;
    if (config) {
      conf = {
        params: config.getParams(),
      };
      if (config.getContent()) {
        conf.data = config.getContent();
        conf.headers = config.getHeaders();
        delete conf.headers[Constants.Headers.ACCEPT];
      }
    }
    return this.fetchInstance.del(
      path + paramsSerializer(config?.getParams()),
      conf
    );
  }
}

export default Ajax;
