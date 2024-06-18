enum ERROR_TYPES {
  BAD_REQUEST = 'BadRequest',
  UNAUTHORIZED = 'Unauthorized',
  PAYMENT_REQUIRED = 'PaymentRequired',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'NotFound',
  METHOD_NOT_ALLOWED = 'MethodNotAllowed',
  NOT_ACCEPTABLE = 'NotAcceptable',
  PROXY_AUTHENTICATION_REQUIRED = 'ProxyAuthenticationRequired',
  REQUEST_TIMEOUT = 'RequestTimeout',
  CONFLICT = 'Conflict',
  GONE = 'Gone',
  LENGTH_REQUIRED = 'LengthRequired',
  PRECONDITION_FAILED = 'PreconditionFailed',
  PAYLOAD_TOO_LARGE = 'PayloadTooLarge',
  URI_TOO_LONG = 'URITooLong',
  UNSUPPORTED_MEDIA_TYPE = 'UnsupportedMediaType',
  RANGE_NOT_SATISFIABLE = 'RangeNotSatisfiable',
  EXPECTATION_FAILED = 'ExpectationFailed',
  IM_A_TEAPOT = 'ImATeapot',
  MISDIRECTED_REQUEST = 'MisdirectedRequest',
  UNPROCESSABLE_ENTITY = 'UnprocessableEntity',
  LOCKED = 'Locked',
  FAILED_DEPENDENCY = 'FailedDependency',
  TOO_EARLY = 'TooEarly',
  UPGRADE_REQUIRED = 'UpgradeRequired',
  PRECONDITION_REQUIRED = 'PreconditionRequired',
  TOO_MANY_REQUESTS = 'TooManyRequests',
  REQUEST_HEADER_FIELDS_TOO_LARGE = 'RequestHeaderFieldsTooLarge',
  UNAVAILABLE_FOR_LEGAL_REASONS = 'UnavailableForLegalReasons',
  INTERNAL_SERVER_ERROR = 'InternalServerError',
  NOT_IMPLEMENTED = 'NotImplemented',
  BAD_GATEWAY = 'BadGateway',
  SERVICE_UNAVAILABLE = 'ServiceUnavailable',
  GATEWAY_TIMEOUT = 'GatewayTimeout',
  HTTP_VERSION_NOT_SUPPORTED = 'HTTPVersionNotSupported',
  VARIANT_ALSO_NEGOTIATES = 'VariantAlsoNegotiates',
  INSUFFICIENT_STORAGE = 'InsufficientStorage',
  LOOP_DETECTED = 'LoopDetected',
  BANDWIDTH_LIMIT_EXCEEDED = 'BandwidthLimitExceeded',
  NOT_EXTENDED = 'NotExtended',
  NETWORK_AUTHENTICATION_REQUIRED = 'NetworkAuthenticationRequired'
}

const ERROR_STATUS: Record<ERROR_TYPES, number> = {
  [ERROR_TYPES.BAD_REQUEST]: 400,
  [ERROR_TYPES.UNAUTHORIZED]: 401,
  [ERROR_TYPES.PAYMENT_REQUIRED]: 402,
  [ERROR_TYPES.FORBIDDEN]: 403,
  [ERROR_TYPES.NOT_FOUND]: 404,
  [ERROR_TYPES.METHOD_NOT_ALLOWED]: 405,
  [ERROR_TYPES.NOT_ACCEPTABLE]: 406,
  [ERROR_TYPES.PROXY_AUTHENTICATION_REQUIRED]: 407,
  [ERROR_TYPES.REQUEST_TIMEOUT]: 408,
  [ERROR_TYPES.CONFLICT]: 409,
  [ERROR_TYPES.GONE]: 410,
  [ERROR_TYPES.LENGTH_REQUIRED]: 411,
  [ERROR_TYPES.PRECONDITION_FAILED]: 412,
  [ERROR_TYPES.PAYLOAD_TOO_LARGE]: 413,
  [ERROR_TYPES.URI_TOO_LONG]: 414,
  [ERROR_TYPES.UNSUPPORTED_MEDIA_TYPE]: 415,
  [ERROR_TYPES.RANGE_NOT_SATISFIABLE]: 416,
  [ERROR_TYPES.EXPECTATION_FAILED]: 417,
  [ERROR_TYPES.IM_A_TEAPOT]: 418,
  [ERROR_TYPES.MISDIRECTED_REQUEST]: 421,
  [ERROR_TYPES.UNPROCESSABLE_ENTITY]: 422,
  [ERROR_TYPES.LOCKED]: 423,
  [ERROR_TYPES.FAILED_DEPENDENCY]: 424,
  [ERROR_TYPES.TOO_EARLY]: 425,
  [ERROR_TYPES.UPGRADE_REQUIRED]: 426,
  [ERROR_TYPES.PRECONDITION_REQUIRED]: 428,
  [ERROR_TYPES.TOO_MANY_REQUESTS]: 429,
  [ERROR_TYPES.REQUEST_HEADER_FIELDS_TOO_LARGE]: 431,
  [ERROR_TYPES.UNAVAILABLE_FOR_LEGAL_REASONS]: 451,
  [ERROR_TYPES.INTERNAL_SERVER_ERROR]: 500,
  [ERROR_TYPES.NOT_IMPLEMENTED]: 501,
  [ERROR_TYPES.BAD_GATEWAY]: 502,
  [ERROR_TYPES.SERVICE_UNAVAILABLE]: 503,
  [ERROR_TYPES.GATEWAY_TIMEOUT]: 504,
  [ERROR_TYPES.HTTP_VERSION_NOT_SUPPORTED]: 505,
  [ERROR_TYPES.VARIANT_ALSO_NEGOTIATES]: 506,
  [ERROR_TYPES.INSUFFICIENT_STORAGE]: 507,
  [ERROR_TYPES.LOOP_DETECTED]: 508,
  [ERROR_TYPES.BANDWIDTH_LIMIT_EXCEEDED]: 509,
  [ERROR_TYPES.NOT_EXTENDED]: 510,
  [ERROR_TYPES.NETWORK_AUTHENTICATION_REQUIRED]: 511
} as const

type MethodType = Record<ERROR_TYPES | number, (message: string, data?: MetaData) => HttpError>

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
    const key = Object.keys(ERROR_STATUS).find((k) => ERROR_STATUS[k as ERROR_TYPES] === value)
    return key ? this.formatKey(key) : undefined
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').trim()
  }

  private static create(status: number, message: string, data?: MetaData): HttpError {
    return new HttpError(status, message, data)
  }

  static createMethods(): MethodType {
    const methods: MethodType = {} as MethodType
    Object.entries(ERROR_STATUS).forEach(([errorType, status]) => {
      const createError = (message: string, data?: MetaData) => this.create(status, message, data)
      methods[errorType as ERROR_TYPES] = createError
      methods[status] = createError
    })
    return methods
  }
}

export const Errors = HttpError.createMethods()
