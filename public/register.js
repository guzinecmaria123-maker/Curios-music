// Проверка формы регистрации (только на стороне браузера, сервер пока не принимает данные)
const form = document.getElementById('register-form');
const success = form.querySelector('.register-success');
const termsError = form.querySelector('.terms-error');

function setError(input, message) {
  const field = input.closest('.field');
  field.classList.toggle('invalid', Boolean(message));
  field.querySelector('.field-error').textContent = message;
}

function validate() {
  const { username, email, password, confirm, terms } = form.elements;
  let ok = true;

  const checks = [
    [username, username.value.trim().length < 3 ? 'Username must be at least 3 characters' : ''],
    [email, !email.validity.valid || !email.value ? 'Enter a valid email' : ''],
    [password, password.value.length < 8 ? 'Password must be at least 8 characters' : ''],
    [confirm, confirm.value !== password.value || !confirm.value ? 'Passwords do not match' : ''],
  ];

  for (const [input, message] of checks) {
    setError(input, message);
    if (message) ok = false;
  }

  termsError.textContent = terms.checked ? '' : 'You must accept the terms';
  if (!terms.checked) ok = false;

  return ok;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  success.hidden = true;
  if (!validate()) return;

  success.hidden = false;
  form.reset();
});

// Показать / скрыть пароль
form.querySelector('.toggle-password').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const input = form.elements.password;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  button.querySelector('i').className = show ? 'fi fi-rr-eye-crossed' : 'fi fi-rr-eye';
});
