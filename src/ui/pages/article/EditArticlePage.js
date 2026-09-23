import { expect, testStep } from '../../../common/pwHelpers/pw';

export class EditArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.articleTitleHeader = page.getByRole('heading');
    this.tagField = page.getByPlaceholder('Enter tags');
    this.publishArticleButton = page.getByRole('button', {
      name: 'Update Article',
    });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async fillTagsField(tags) {
    await this.step(`Add tags to the article`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await this.tagField.fill(tags[i]);
        await this.page.keyboard.press('Enter');
      }
    });
  }

  async addTags(tags) {
    await this.fillTagsField(tags);
  }

  async removeAllTags() {
    await this.step(`Remove all tags from the article`, async () => {
      const tagButtons = this.page.locator('.tag-list .tag-default, .tag-list .tag-pill');
      const count = await tagButtons.count();

      for (let i = 0; i < count; i++) {
        const tagButton = tagButtons.nth(0);

        if (await tagButton.locator('button').count()) {
          await tagButton.locator('button').first().click();
        } else {
          await tagButton.click();
        }
      }
    });
  }

  async clickPublishArticleButton() {
    await this.step(`Click the 'Publish Article' button`, async () => {
      await this.publishArticleButton.click();
    });
  }

  async assertArticleTitle(title) {
    await this.step(`Assert the article has correct title'`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleText(text) {
    await this.step(`Assert the article has correct text'`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }
}
