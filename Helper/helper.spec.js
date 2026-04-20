import { expect } from '@playwright/test';

let apiUrl;

async function getApiBaseUrl() {
    apiUrl = process.env.API_BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com';
    return apiUrl;
}

export async function authenticateUser(username, password, { request }) {
    const baseUrl = await getApiBaseUrl();
    const requestBody = { email: username, password: password };

    const response = await request.post(`${baseUrl}/users/login`, {
        data: requestBody,
        headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    return responseBody.token; 
}

export async function createEntity(userData, accessToken, modulePath, { request }) {
    const baseUrl = await getApiBaseUrl();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    const response = await request.post(baseUrl + modulePath, {
        headers,
        data: userData,
    });

    const responseBody = await response.json();

    if (response.status() !== 201) {
        console.error("DEBUG: API Error Response ->", responseBody);
    }

    expect(response.status(), `Expected 201 but got ${response.status()}. Error: ${JSON.stringify(responseBody)}`).toBe(201);
    return responseBody._id || responseBody.id || null;
}

export async function deleteEntity(entityId, accessToken, modulePath, { request }) {
    const baseUrl = await getApiBaseUrl();
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    const response = await request.delete(`${baseUrl}${modulePath}/${entityId}`, { headers });
    expect(response.status()).toBe(200);
}

// ... rest of your helper functions (validateEntity, getEntity) remain the same

/**
 * Validates an entity exists by checking status code
 */
export async function validateEntity(accessToken, modulePath, expectedStatus, { request }) {
    const baseUrl = await getApiBaseUrl();
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
    };
    
    const response = await request.get(baseUrl + modulePath, {
        headers,
    });
    
    expect(response.status()).toBe(parseInt(expectedStatus));
}

/**
 * Gets an entity ID from a list
 */
export async function getEntity(accessToken, modulePath, expectedStatus, { request }) {
    const baseUrl = await getApiBaseUrl();
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
    };
    
    const response = await request.get(baseUrl + modulePath, {
        headers,
    });
    
    expect(response.status()).toBe(parseInt(expectedStatus));
    const responseBody = await response.json();
    
    return (responseBody && responseBody.length > 0) ? (responseBody[0]._id || responseBody[0].id) : null;
}