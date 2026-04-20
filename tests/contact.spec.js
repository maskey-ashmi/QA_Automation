import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageObjects/login.po.js';
import { ContactPage } from '../pageObjects/contact.po.js';
import { authenticateUser, createEntity } from '../Helper/helper.spec.js';
import testData from '../fixtures/loginFixtures.json';
import contactTestData from '../fixtures/contactFixtures.json' assert { type: 'json' };

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    // Best practice: use testData.validUser.username instead of hardcoding
    await login.login("maskeyashmi@gmail.com", "Ashmi@123"); 
    await login.verifyValidLogin();
});

test.describe('Contact Management', () => {

    test('Add New Contact via UI', async ({ page }) => {
        const contact = new ContactPage(page);
        await contact.contactAdd(
            "Rajesh", "hamal", "1919-12-12", "hamal@gmail.com", 
            "980000000", "Thamel", "Kathmandu", "Bagmati", "44600", "Nepal"
        );
        await contact.viewContact();
        await contact.validateContactCreated(
            "Rajesh", "hamal", "1919-12-12", "hamal@gmail.com", 
            "980000000", "Thamel", "Kathmandu", "Bagmati", "44600", "Nepal"
        );
    });

    test('Edit Existing Contact (API Setup + UI Edit)', async ({ page, request }) => {
        const contact = new ContactPage(page);
        const initialData = contactTestData.contact1;
        const updatedData = contactTestData.contact2;

        const accessToken = await authenticateUser(testData.validUser.username, testData.validUser.password, { request });
        await createEntity(initialData, accessToken, '/contacts', { request });

        await page.reload();
        await contact.viewContact();
        
        await contact.contactEdit(
            updatedData.firstName, updatedData.lastName, updatedData.birthdate, 
            updatedData.email, updatedData.phone, updatedData.street1, 
            updatedData.city, updatedData.stateProvince, updatedData.postalCode, updatedData.country
        );

        await contact.validateContactCreated(
            updatedData.firstName, updatedData.lastName, updatedData.birthdate, 
            updatedData.email, updatedData.phone, updatedData.street1, 
            updatedData.city, updatedData.stateProvince, updatedData.postalCode, updatedData.country
        );
    });

    test.only('Contact Delete test', async ({ page, request }) => {
        const contact = new ContactPage(page);
        
        // Dynamic data ensures uniqueness every time you run the test
        const timestamp = Date.now();
        const data = {
            "firstName": "Delete",
            "lastName": `User_${timestamp}`,
            "birthdate": "1990-01-01",
            "email": `delete_me_${timestamp}@example.com`,
            "phone": "1234567890",
            "street1": "123 Test St",
            "city": "Kathmandu",
            "stateProvince": "Bagmati",
            "postalCode": "44600",
            "country": "Nepal"
        };

        // 1. Setup: Create the entity via API
        const accessToken = await authenticateUser(testData.validUser.username, testData.validUser.password, { request });
        await createEntity(data, accessToken, '/contacts', { request });

        // 2. Action: UI Deletion
        await page.reload();
        // Locate specifically the contact we just created
        await page.getByText(data.firstName + " " + data.lastName).click(); 
        await contact.deleteContact(); 

        // 3. Validation: Verify it is gone
        await expect(page.getByText(data.firstName + " " + data.lastName)).not.toBeVisible();
    });
});