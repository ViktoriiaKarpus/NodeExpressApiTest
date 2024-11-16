import {test, expect} from '@playwright/test';


//UI test

[
    {tabName: 'Add', expected: 'nav-link active'},
    {tabName: 'Search', expected: 'nav-link'},
    {tabName: 'Edit', expected: 'nav-link'},
    {tabName: 'Delete', expected: 'nav-link'},
].forEach(({tabName, expected}) => {
    test.describe('Navigation tabs are available', async () => {

        test.beforeEach('Navigate to home page url', async ({page}) => {
            await page.goto('http://localhost:5009/')

        })

        test(`TC-NavBar-1:Verify ${tabName}Tab Load Correctly and Available`, async ({page}) => {
            const tab = await page.getByRole('link', {name: `${tabName}`, exact: true});
            const tabClassAttribute = await tab.getAttribute('class');

            await expect(tab).toBeAttached(); // загрузился
            await expect(tab).toHaveCount(1);
            await expect(tab).toBeVisible();
            await expect(tab).toBeEditable(); // можно нажать
            await expect(tabClassAttribute).toStrictEqual(`${expected}`);

        })

    })
})

/* test('Search should be available', async ({page}) => {
     const searchTab = await page.getByRole('link', {name: 'Search', exact: true});
     const addTabClassAttribute = await searchTab.getAttribute('class');

     await expect(searchTab).toBeAttached(); // загрузился
     await expect(searchTab).toHaveCount(1);
     await expect(searchTab).toBeVisible();
     await expect(searchTab).toBeEditable(); // можно нажать
     await expect(addTabClassAttribute).toStrictEqual('nav-link');

 })


}) */