export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionFailure = {
  success: false;
  error: string;
  code?: string;
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export function success<T>(data: T): ActionSuccess<T> {
  return { success: true, data };
}

export function failure(error: string, code?: string): ActionFailure {
  return { success: false, error, code };
}

export function isSuccess<T>(
  result: ActionResult<T>,
): result is ActionSuccess<T> {
  return result.success;
}

export function isFailure<T>(
  result: ActionResult<T>,
): result is ActionFailure {
  return !result.success;
}
