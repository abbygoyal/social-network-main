import { loginWithUser, loginWithGoogle } from '../../lib/firebase-auth.js';
import { loginValidation } from '../../lib/validation.js';
import { errorMessages } from '../../lib/erros.js';

export default () => {
  const container = document.createElement('div');

  const template = `
    <img class= "logo" id= "img-logo-login" src="./img/logo.png" alt="logo"> 
    <h1>Welcome to Abishek's Website</h1>
    <section class="container-user">
      <h2 class="subtitle">Login</h2>
          <form class="form-login">
            <label for="input-email" class="label-for-input" id="label-email">E-mail:*</label>
            <input type="email" class="input-area" id="input-email" placeholder="Enter your Email"/>

            <label for="input-password" class="label-for-input" id="label-password">Password:*</label>
            <input type="password" class="input-area" id="input-password" placeholder="Enter your Password"/>
            
            <p class="txt-error" id="error-output"></p>
            <p class="txt-error" id="error-output2"></p>

            <button type="submit" class="btn" id="btn-login">Login</button>
          </form>
          <hr>
          <button class="btn" id="btn-login-google">Login from Google</button>
          <hr>
          <a href= "#signup"><button class="btn" id="btn-register">Click here to register</button></a>
    </section>
    <footer>
      <p class="footer-devs">Developed by <a class="link-linkedin" href="https://www.linkedin.com/in/abhishek-goyal-7a9778160/" target="_blank"
      >Abhishek Goyal</a> </p>
    </footer>
    `;
  container.innerHTML = template;

  // Eventos para capturar inputs:
  const email = container.querySelector('#input-email');
  const password = container.querySelector('#input-password');
  const form = container.querySelector('.form-login');
  const errorOutput = container.querySelector('#error-output');
  const otherErrorOutput = container.querySelector('#error-output2');
  const btnLoginGoogle = container.querySelector('#btn-login-google');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    otherErrorOutput.innerHTML = '';
    errorOutput.innerHTML = '';

    const validationLogin = loginValidation(email.value, password.value);

    if (validationLogin) {
      otherErrorOutput.innerHTML = validationLogin;
    } else {
      // => ENTRADA DA NOVA FUN????O DE NOVO USU??RIO
      loginWithUser(email.value, password.value)
        .then(() => {
          // .then((userCredential) => {
          // const user = userCredential.user;
          // console.log(user);
          window.location.hash = '#post';
        })
        .catch((error) => {
          errorOutput.innerHTML = errorMessages(error);
        });
    }
    // testando:
    // console.log('submit');
    // console.log(email.value);
    // console.log(password.value);
  });

  btnLoginGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    loginWithGoogle()
      .then(() => {
        window.location.hash = '#post';
      })
      .catch((error) => {
        errorOutput.innerHTML = errorMessages(error);
      });
  });

  return container;
};
