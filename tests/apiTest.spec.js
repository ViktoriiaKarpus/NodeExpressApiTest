import {test, expect} from '@playwright/test';
import * as testData from '../testData/apiTestData/apiTestData.js';
import * as utils from '../utils/apiUtils/apiTestUtils.js';
import * as preconditions from '../utils/preconditions.js';
import {expectedStatusCodes} from "../testData/apiTestData/apiTestData.js";
import {USERS_ENDPOINT} from "../testData/apiTestData/apiTestData.js";

const BASE_URL = 'http://localhost:5009/api';

let apiRequest;

test.beforeEach(async () => {
    apiRequest = await utils.createNewContext();
})

test.afterEach(async () => {
    await apiRequest.dispose();
})

test('GET /', async () => {

//request
    const response = await apiRequest.get(`${BASE_URL}/`);
    const statusCode = response.status();
    const headersArray = response.headersArray();
    const contentTypeHeader = headersArray.find(
        (header) => header.name === 'Content-Type');
    const contentTypeHeaderValue = contentTypeHeader.value;
    const contentLengthHeaderValue = headersArray
        .find((header) => header.name === 'Content-Length')
        .value;
    const responseText = await response.text();

    //Assert response
    // await expect(actualResult).assertWord.(expected result)
    await expect(statusCode).toBe(200);
    await expect(response).toBeOK();
    await expect(response.ok()).toBeTruthy();
    await expect(responseText).toEqual("Node Express API Server App");
    await expect(contentTypeHeaderValue).toBe("text/html; charset=utf-8");
    await expect(contentLengthHeaderValue).toEqual(responseText.length.toString());

})

test('GET / with utils', async () => {

    const response = await apiRequest.get(`${testData.BASE_URL}/`); //act

    const statusCode = utils.getResponseStatus(response);

    await expect(statusCode).toBe(testData.expectedStatusCodes._200);

    const contentTypeHeaderValue = utils.getContentTypeHeaderValue(response);
    const contentLengthHeaderValue = utils.getContentLengthHeaderValue(response);
    const responseText = await utils.getResponseText(response);

    await expect(responseText).toEqual(testData.expectedTexts.successfulGetApiHome);
    await expect(contentTypeHeaderValue).toBe(testData.expectedHeaders.contentTypeValue.textHtml);
    await expect(contentLengthHeaderValue).toEqual(testData.expectedHeaders.contentLengthValue.successfulGetApiHome);
})

test('GET /users/ empty DB message with utils', async () => {

    await preconditions.setPrecondition_DeleteUsers(apiRequest);

    const response = await apiRequest.get(`${testData.USERS_ENDPOINT}/`);
    const statusCode = utils.getResponseStatus(response);

    await expect(statusCode).toBe(testData.expectedStatusCodes._200);

    const contentTypeHeaderValue = utils.getContentTypeHeaderValue(response);
    const contentLengthHeaderValue = utils.getContentLengthHeaderValue(response);
    const responseText = await utils.getResponseText(response);

    await expect(contentTypeHeaderValue).toBe(testData.expectedHeaders.contentTypeValue.textHtml);
    await expect(contentLengthHeaderValue).toBe(testData.expectedHeaders.contentLengthValue.successfulGetApiUsersHomeEmptyDb);
    await expect(responseText).toBe(testData.expectedTexts.successfulGetUsersHomeEmptyDb);
})

test ('GET /users/ response testData', async () => {

    await preconditions.setPrecondition_DeleteUsers_CreateUser(apiRequest);

    const response = await apiRequest.get(`${testData.USERS_ENDPOINT}/`);
    const statusCode = response.status();

    await expect(statusCode).toBe(testData.expectedStatusCodes._200);

    const contentTypeHeaderValue = utils.getContentTypeHeaderValue(response);
    const responseBody = await utils.getResponseBody(response);
    const isArray = await Array.isArray(responseBody);

    await expect(contentTypeHeaderValue).toBe(testData.expectedHeaders.contentTypeValue.applicationJson);
    await expect(isArray).toBeTruthy();
    await expect(isArray).toBe(true);
    await expect(responseBody).toHaveLength(testData.expectedResponseObjectsCount._1);
    await expect(responseBody[0].firstName).toBe(testData.user.firstName);
    await expect(responseBody[0].lastName).toBe(testData.user.lastName);
    await expect(responseBody[0].age).toBe(testData.user.age);
    await expect(responseBody[0].id.length).toBe(testData.expected.idLength);
})
