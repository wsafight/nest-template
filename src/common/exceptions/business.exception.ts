import { HttpException, HttpStatus } from '@nestjs/common';
import { BusinessErrorCode } from './business.error.codes';

type BusinessError = {
  code: number;
  message: string;
};

export class BusinessException extends HttpException {
  constructor(err: BusinessError | string) {
    if (typeof err === 'string') {
      err = {
        code: BusinessErrorCode.Common,
        message: err,
      };
    }
    super(err, HttpStatus.OK);
  }

  static throwUserDisabled() {
    throw new BusinessException({
      code: BusinessErrorCode.UserDisabled,
      message: '您无此权限',
    });
  }

  static throwVersionNotSupport() {
    throw new BusinessException({
      code: BusinessErrorCode.VersionNotSupport,
      message: '当前版本不再支持',
    });
  }
}
