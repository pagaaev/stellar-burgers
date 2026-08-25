import { test, expect, Page, BrowserContext } from '@playwright/test';
import path from 'path';

const harsDir = path.join(__dirname, 'hars');
const bunName = 'Краторная булка N-200i';
const fillingName = 'Биокотлета из марсианской Магнолии';
const orderNumber = '12345';

const mockBackend = async (page: Page) => {
  await page.routeFromHAR(path.join(harsDir, 'ingredients.har'), {
    url: '**/api/ingredients',
    update: false
  });
  await page.routeFromHAR(path.join(harsDir, 'user.har'), {
    url: '**/api/auth/**',
    update: false
  });
  await page.routeFromHAR(path.join(harsDir, 'orders.har'), {
    url: '**/api/orders**',
    update: false
  });
};

const setAuthTokens = async (page: Page, context: BrowserContext) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      url: 'http://localhost:4000'
    }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });
};

const addIngredient = async (page: Page, name: string) => {
  await page
    .locator('li')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await page.goto('/');
  });

  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await addIngredient(page, bunName);
    await expect(constructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${bunName} (низ)`)).toBeVisible();

    await addIngredient(page, fillingName);
    await expect(constructor.getByText(fillingName)).toBeVisible();
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await page.goto('/');
  });

  test('открывает модальное окно с данными выбранного ингредиента', async ({
    page
  }) => {
    await page.getByRole('link', { name: bunName }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText(bunName)).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();
    await expect(modal.getByText('80')).toBeVisible();
    await expect(modal.getByText('24')).toBeVisible();
    await expect(modal.getByText('53')).toBeVisible();
    await expect(modal.getByText(fillingName)).toHaveCount(0);
  });

  test('закрывает модальное окно ингредиента по крестику', async ({ page }) => {
    await page.getByRole('link', { name: bunName }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).toHaveCount(0);
  });

  test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
    await page.getByRole('link', { name: bunName }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 4, y: 4 } });
    await expect(modal).toHaveCount(0);
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockBackend(page);
    await setAuthTokens(page, context);
    await page.goto('/');
  });

  test('оформляет заказ, показывает номер и очищает конструктор', async ({
    page
  }) => {
    await addIngredient(page, bunName);
    await addIngredient(page, fillingName);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(orderNumber)).toBeVisible();
    await expect(modal.getByText('идентификатор заказа')).toBeVisible();

    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).toHaveCount(0);
  });
});
