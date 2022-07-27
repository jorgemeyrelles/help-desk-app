import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup
    .string()
    .email("E-mail/senha inválido(s)\nSenha deve conter pelo menos 6 caracteres, uma maiúscula, um numero e um caracter especial")
    .required("Por favor, insira um e-mail"),
  password: yup
    .string()
    .required("Por favor, insira uma senha")
    .min(
      6,
      "E-mail/senha inválido(s)\nSenha deve conter pelo menos 6 caracteres, uma maiúscula, um numero e um caracter especial"
    ),
    // .matches(
    //   /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    //   "E-mail/senha inválido(s)\nSenha deve conter pelo menos 6 caracteres, uma maiúscula, um numero e um caracter especial"
    // ),
});
