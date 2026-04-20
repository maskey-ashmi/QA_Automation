import { expect } from '@playwright/test';

export class ContactPage {
    constructor(page) {
        this.page = page;
        this.addContactButton = '#add-contact';
        this.firstNameInput = '#firstName';
        this.lastNameInput = '#lastName';
        this.birthdateInput = '#birthdate';
        this.emailInput = '#email';
        this.phoneInput = '#phone';
        this.street1Input = '#street1';
        this.cityInput = '#city';
        this.stateInput = '#stateProvince';
        this.postalCodeInput = '#postalCode';
        this.countryInput = '#country';
        this.submitButton = '#submit';
        this.editButton = '#edit-contact';
        this.contactRow = '.contactTableBodyRow';
        // Add this line
        this.deleteButton = '#delete'; 
    }

    // ... your existing methods (contactAdd, viewContact, etc.)

    /**
     * Deletes a contact and handles the browser confirmation dialog
     */
    async deleteContact() {
        // Listen for the dialog (popup) and accept it automatically
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });

        // Click the delete button
        await this.page.click(this.deleteButton);

        // Optional: Wait for the contact list to reload after deletion
        await this.page.waitForSelector(this.addContactButton);
    }

    async validateContactCreated(fName, lName, dob, email, phone, street, city, state, zip, country) {
        if (!fName || !lName) {
            throw new Error(`Validation Error: firstName: ${fName}, lastName: ${lName}`);
        }
        await this.page.waitForSelector('#firstName');
        await expect(this.page.locator('#firstName')).toHaveText(fName);
        await expect(this.page.locator('#lastName')).toHaveText(lName);
    }
}