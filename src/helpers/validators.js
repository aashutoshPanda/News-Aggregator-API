export class UserValidator {
  static allSignupValuesProvided({ fullName, email, role, password }) {
    return fullName && email && role && password;
  }
  static allLoginValuesProvided({ email, password }) {
    return email && password;
  }
}
