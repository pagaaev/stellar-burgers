export const BUN_COUNT = 2;
export const ORDER_NUMBER_LENGTH = 6;

export const apiErrorMessages: Record<string, string> = {
  'User already exists': 'Пользователь уже существует',
  'user already exists': 'Пользователь уже существует',
  'email or password are incorrect': 'Неверный e-mail или пароль',
  'Email, password and name are required fields':
    'Заполните имя, e-mail и пароль'
};

export const formatOrderNumber = (value?: string | number) =>
  String(value ?? '').padStart(ORDER_NUMBER_LENGTH, '0');

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error && 'message' in error) {
    const message = String((error as { message: string }).message);
    return apiErrorMessages[message] || message;
  }
  return fallback;
};
