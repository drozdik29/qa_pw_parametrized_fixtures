import { test } from '../_fixtures/fixtures';
import {
  EMPTY_USERNAME_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
  INVALID_EMAIL_OR_PASSWORD_MESSAGE,
} from '../../src/ui/constants/authErrorMessages';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';

const user = generateNewUserData();
const testParameters = [
  {
    email: user.email,
    password: '',
    message: EMPTY_PASSWORD_MESSAGE,
    title: 'empty password',
  },
  {
    email: '',
    password: user.password,
    message: EMPTY_USERNAME_MESSAGE,
    title: 'empty email',
  },
  {
    email: user.email,
    password: '1',
    message: EMPTY_USERNAME_MESSAGE,
    title: 'wrong password',
  },
];

testParameters.forEach((params) => {
  test.describe('Sign up negative tests', () => {
    test(`Sign up with ${params.title}`, async ({ user, signUpPage }) => {
      await signUpPage.open();
      await signUpPage.fillEmailField(params.email);
      await signUpPage.fillPasswordField(params.password);
      await signUpPage.clickSignUpButton();

      await signUpPage.assertErrorMessageContainsText(params.message);
    });
  });
});
