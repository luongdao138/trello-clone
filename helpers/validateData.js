const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const verifyLogin = (body) => {
  const { email, password } = body;
  const errors = {};

  if (!email) {
    errors.email = 'Email can not be empty!';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Email is not valid!';
  }

  if (!password) {
    errors.password = 'Password can not be empty!';
  }

  return errors;
};

const verifyRegister = (body) => {
  const { email, password, username } = body;
  const errors = {};

  if (!username) {
    errors.username = 'Username can not be empty!';
  } else if (username.length > 50 || username.length < 3) {
    errors.username = 'Username can must be between 3 and 50 characters!';
  }

  if (!email) {
    errors.email = 'Email can not be empty!';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Email is not valid!';
  }

  if (!password) {
    errors.password = 'Password can not be empty!';
  }

  return errors;
};

const validateBoard = (body) => {
  const { title, visibility } = body;
  const errors = {};
  const visibilityOptions = ['PUBLIC', 'PRIVATE'];

  if (!title) {
    errors.title = 'Title can not be empty!';
  } else if (title.length > 50) {
    errors.title = 'Title cannot be more than 50 characters!';
  }

  if (!visibilityOptions.includes(visibility)) {
    errors.visibility = 'Visibility not supported!';
  }

  return errors;
};

module.exports = {
  verifyLogin,
  verifyRegister,
  validateBoard,
};
