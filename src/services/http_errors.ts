enum ERROR_TYPES {
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  PaymentRequired = 'PaymentRequired',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  MethodNotAllowed = 'MethodNotAllowed',
  NotAcceptable = 'NotAcceptable',
  ProxyAuthenticationRequired = 'ProxyAuthenticationRequired',
  RequestTimeout = 'RequestTimeout',
  Conflict = 'Conflict',
  Gone = 'Gone',
  LengthRequired = 'LengthRequired',
  PreconditionFailed = 'PreconditionFailed',
  PayloadTooLarge = 'PayloadTooLarge',
  URITooLong = 'URITooLong',
  UnsupportedMediaType = 'UnsupportedMediaType',
  RangeNotSatisfiable = 'RangeNotSatisfiable',
  ExpectationFailed = 'ExpectationFailed',
  ImATeapot = 'ImATeapot',
  MisdirectedRequest = 'MisdirectedRequest',
  UnprocessableEntity = 'UnprocessableEntity',
  Locked = 'Locked',
  FailedDependency = 'FailedDependency',
  TooEarly = 'TooEarly',
  UpgradeRequired = 'UpgradeRequired',
  PreconditionRequired = 'PreconditionRequired',
  TooManyRequests = 'TooManyRequests',
  RequestHeaderFieldsTooLarge = 'RequestHeaderFieldsTooLarge',
  UnavailableForLegalReasons = 'UnavailableForLegalReasons',
  InternalServerError = 'InternalServerError',
  NotImplemented = 'NotImplemented',
  BadGateway = 'BadGateway',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
  HTTPVersionNotSupported = 'HTTPVersionNotSupported',
  VariantAlsoNegotiates = 'VariantAlsoNegotiates',
  InsufficientStorage = 'InsufficientStorage',
  LoopDetected = 'LoopDetected',
  BandwidthLimitExceeded = 'BandwidthLimitExceeded',
  NotExtended = 'NotExtended',
  NetworkAuthenticationRequired = 'NetworkAuthenticationRequired'
}

const ERROR_STATUS: Record<ERROR_TYPES, number> = {
  [ERROR_TYPES.BadRequest]: 400,
  [ERROR_TYPES.Unauthorized]: 401,
  [ERROR_TYPES.PaymentRequired]: 402,
  [ERROR_TYPES.Forbidden]: 403,
  [ERROR_TYPES.NotFound]: 404,
  [ERROR_TYPES.MethodNotAllowed]: 405,
  [ERROR_TYPES.NotAcceptable]: 406,
  [ERROR_TYPES.ProxyAuthenticationRequired]: 407,
  [ERROR_TYPES.RequestTimeout]: 408,
  [ERROR_TYPES.Conflict]: 409,
  [ERROR_TYPES.Gone]: 410,
  [ERROR_TYPES.LengthRequired]: 411,
  [ERROR_TYPES.PreconditionFailed]: 412,
  [ERROR_TYPES.PayloadTooLarge]: 413,
  [ERROR_TYPES.URITooLong]: 414,
  [ERROR_TYPES.UnsupportedMediaType]: 415,
  [ERROR_TYPES.RangeNotSatisfiable]: 416,
  [ERROR_TYPES.ExpectationFailed]: 417,
  [ERROR_TYPES.ImATeapot]: 418,
  [ERROR_TYPES.MisdirectedRequest]: 421,
  [ERROR_TYPES.UnprocessableEntity]: 422,
  [ERROR_TYPES.Locked]: 423,
  [ERROR_TYPES.FailedDependency]: 424,
  [ERROR_TYPES.TooEarly]: 425,
  [ERROR_TYPES.UpgradeRequired]: 426,
  [ERROR_TYPES.PreconditionRequired]: 428,
  [ERROR_TYPES.TooManyRequests]: 429,
  [ERROR_TYPES.RequestHeaderFieldsTooLarge]: 431,
  [ERROR_TYPES.UnavailableForLegalReasons]: 451,
  [ERROR_TYPES.InternalServerError]: 500,
  [ERROR_TYPES.NotImplemented]: 501,
  [ERROR_TYPES.BadGateway]: 502,
  [ERROR_TYPES.ServiceUnavailable]: 503,
  [ERROR_TYPES.GatewayTimeout]: 504,
  [ERROR_TYPES.HTTPVersionNotSupported]: 505,
  [ERROR_TYPES.VariantAlsoNegotiates]: 506,
  [ERROR_TYPES.InsufficientStorage]: 507,
  [ERROR_TYPES.LoopDetected]: 508,
  [ERROR_TYPES.BandwidthLimitExceeded]: 509,
  [ERROR_TYPES.NotExtended]: 510,
  [ERROR_TYPES.NetworkAuthenticationRequired]: 511
} as const

type MethodType = Record<
  ERROR_TYPES | number,
  (message: string, data?: MetaData) => HttpError
>

type MetaData = { [key: string]: any }

class HttpError extends Error {
  status: number
  data?: MetaData
  code: string

  constructor(status: number, message: string, data?: MetaData) {
    super(message)
    this.status = status
    this.data = data
    this.code = this.getKeyByValueAndFormat(status) ?? 'Unhandled Error'
  }

  private getKeyByValueAndFormat(value: number): string | undefined {
    const key = Object.keys(ERROR_STATUS).find(
      (k) => ERROR_STATUS[k as ERROR_TYPES] === value
    )
    return key ? this.formatKey(key) : undefined
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').trim()
  }

  private static create(
    status: number,
    message: string,
    data?: MetaData
  ): HttpError {
    return new HttpError(status, message, data)
  }

  static createMethods(): MethodType {
    const methods: MethodType = {} as MethodType
    Object.entries(ERROR_STATUS).forEach(([errorType, status]) => {
      const createError = (message: string, data?: MetaData) =>
        this.create(status, message, data)
      methods[errorType as ERROR_TYPES] = createError
      methods[status] = createError
    })
    return methods
  }
}

export default HttpError.createMethods()
