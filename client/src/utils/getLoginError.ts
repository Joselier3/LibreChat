const getLoginError = (errorText: string) => {
  const defaultError = 'com_auth_error_login';

  if (!errorText) {
    return defaultError;
  }

  switch (true) {
    case errorText.includes('429'):
      return 'com_auth_error_login_rl';
    case errorText.includes('403'):
      return 'com_auth_error_login_ban';
    case errorText.includes('500'):
      return 'com_auth_error_login_server';
    case errorText.includes('422'):
      return 'com_auth_error_login_unverified';
    case errorText.includes('409'):
      return 'com_auth_error_login_no_verify';
    default:
      return defaultError;
  }
};

export default getLoginError;
