import { FormControl, AbstractControl } from '@angular/forms'

export class ValidateService {
  /**
   * 手机号码验证
   * @param control
   */
  public static phoneValidate(control: FormControl) {
    const MOBILE_REGEXP = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/
    return MOBILE_REGEXP.test(control.value)
      ? null
      : {
          validateMobile: { valid: false }
        }
  }
}
