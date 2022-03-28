import { ResponseType } from "axios";
import Constants from "./Constants";

// NOTE: deleted some content from the original termit-ui file

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

export function paramsSerializer(paramData: {}) {
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

  return options ? options.slice(0, -1) : options;
}
