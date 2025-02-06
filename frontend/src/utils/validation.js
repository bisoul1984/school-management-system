export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2;
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

export const validateForm = (values, fields) => {
  const errors = {};

  fields.forEach(field => {
    if (!values[field]) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  if (values.email && !validateEmail(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (values.password && !validatePassword(values.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (values.firstName && !validateName(values.firstName)) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (values.lastName && !validateName(values.lastName)) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (values.phone && !validatePhone(values.phone)) {
    errors.phone = 'Invalid phone number';
  }

  return errors;
}; 