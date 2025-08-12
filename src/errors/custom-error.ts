class CustomErrorClass extends Error {
  statusCode?: number;
  errors?: unknown;

  constructor(message: string, statusCode?: number, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, CustomErrorClass.prototype);
  }
}

export default CustomErrorClass;