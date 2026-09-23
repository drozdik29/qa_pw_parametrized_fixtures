import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';

test.use({ contextsNumber: 3, usersNumber: 3 });

test.beforeEach(async ({ pages, users, logger }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await signUpUser(pages[2], users[2], 3);

  const firstArticle = generateNewArticleData(logger);
  const secondArticle = generateNewArticleData(logger);

  await createArticle(pages[0], firstArticle, 1);
  await createArticle(pages[1], secondArticle, 2);

  test.info().firstArticle = firstArticle;
  test.info().secondArticle = secondArticle;
});

test('View an article created by another user', async ({
  pages,
  users,
}, testInfo) => {
  const viewArticlePage = new ViewArticlePage(pages[2], 3);
  const firstArticle = testInfo.firstArticle;

  await viewArticlePage.open(firstArticle.url);
  await viewArticlePage.assertArticleTitleIsVisible(firstArticle.title);
  await viewArticlePage.assertArticleTextIsVisible(firstArticle.text);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[0].username);
});

test('User can see articles from two different users', async ({
  pages,
  users,
}, testInfo) => {
  const viewArticlePage = new ViewArticlePage(pages[2], 3);
  const firstArticle = testInfo.firstArticle;
  const secondArticle = testInfo.secondArticle;

  await viewArticlePage.open(firstArticle.url);
  await viewArticlePage.assertArticleTitleIsVisible(firstArticle.title);
  await viewArticlePage.assertArticleTextIsVisible(firstArticle.text);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[0].username);

  await viewArticlePage.open(secondArticle.url);
  await viewArticlePage.assertArticleTitleIsVisible(secondArticle.title);
  await viewArticlePage.assertArticleTextIsVisible(secondArticle.text);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[1].username);
});