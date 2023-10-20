import { Given, When, Then } from "@wdio/cucumber-framework";
import retirementCalculatorPage from '../pages/retirementCalculatorPage';
import {expect, $} from '@wdio/globals';

Given("user navigates to Securian's Retiremnet Savings Calculator page", async () => {
    await retirementCalculatorPage.openBrowser();
});

When("user enters data in {string} fields", async (field) => {
    field == 'required' ?
    await retirementCalculatorPage.enterDataInAllRequiredFields() :
    await retirementCalculatorPage.enterDataInAllFields();
});

When("user enters data into all the required fields except in {string} field",async (fieldNumber) => {
    await retirementCalculatorPage.skipDataInREquiredField(fieldNumber);
})

When("user clicks on calculate button",async () => {
   await retirementCalculatorPage.clickCalculateButton(); 
});

Then("user should see an error message {string}", async(errorMsg) => {
    await retirementCalculatorPage.validateErrorMessage(errorMsg);
});

Then("user should see incomplete field {string} is highlighted with red color", async (fieldNum) => {
    await retirementCalculatorPage.validateInputFieldWarningMessage(parseInt(fieldNum));
  });
  
  Then("user should see the success message with calculated result", async () => {
    await expect(await retirementCalculatorPage.resultMessageSelector()).toBeDisplayed();
    await browser.saveScreenshot(`./results_SS/ResultMessageAfterFormSubmission.png`);
    console.log(`successMessage: ${await (await retirementCalculatorPage.resultMessageSelector()).getText()} is displayed`);
  });
  
  When("user selects SSN radio button to {string} on the Page", async (buttonName) => {
    await retirementCalculatorPage.selectSocialSecurityBenefitButton(buttonName);
  });
  
  Then("user should see the Social Security fields", async () => {
    await retirementCalculatorPage.validateSocialSecurityFieldsDisplay();
  });
  
  Then("user should not see the social Security fields", async () => {
    expect(await retirementCalculatorPage.maritalStatusLabelSelector()).not.toBeDisplayed();
    expect(await retirementCalculatorPage.securityOverrideSelector()).not.toBeDisplayed();
  });
  
  When("user clicks the Adjust default value link", async () => {
    await retirementCalculatorPage.clickAdjustDefaultValueLink();
  });
  
  Then("user should update the data on default calculator popup", async () => {
    await retirementCalculatorPage.enterDataOnDefaultCalculator();
  });
  
  When("user save the changes on default calculator popup", async () => {
    await retirementCalculatorPage.clickSaveChangesButton();
  });
  
  Then("user should be on retirement calculator page", async () => {
    await (await retirementCalculatorPage.retirementCalcFormTitleSelector()).isDisplayed();
  });