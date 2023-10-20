import basePage from "../utilities/basePage";
import data from '../utilities/data';

class retirementCalculatorPage extends basePage {

    //Retirement Form calculator locators
    get retirementCalcFormTitleSelector() {
        return async () => $(`//section[@id='calculator-intro-section']`);
    }

    get socialBenefitRadioBtnSelector() {
        return async (button: string) => $(`//legend[@id='include-social-label']//following::li/label[@for='${button}-social-benefits']`);
    }
    get maritalStatusLabelSelector() {
        return async () => $(`//legend[@id='marital-status-label']`);
    }
    get maritalStatusRadioBtnSelector() {
        return async (status: string) => $(`//legend[@id='marital-status-label']//following::li/label[contains(text(),'${status}')]`);
    }
    get securityOverrideSelector() {
        return async () => $(`//input[@id='social-security-override']`);
    }
    get defaultValueCalcLnkSelector() {
        return async () => $(`//a[contains(text(),'Adjust default values')]`);
    }
    get calculateBtnSelector() {
        return async () => $(`//button[@data-tag-id='submit']`);
    }
    get resultMessageSelector() {
        return async () => $(`//p[@id='result-message']`);
    }

    get retirementFormAllRequiredInputSelectors() {
        return async () => $$("//form[@id='retirement-form']//input[contains(@class, 'required')]");
    }

    get retirementFormRequiredInputSelector() {
        return async (index: number) => $(`(//input[contains(@class, 'required')])[${index}]`);
    }

    get InvalidInputSelector() {
        return async (index: number) => $(`(//input[contains(@class, 'required')])[${index}]/parent::div[@class='text-input invalid']`)
    }

    get errorMessageSelector() {
        return async () => $(`//p[@id='calculator-input-alert-desc']`);
    }

    get retirmentFormAllTextInputSelectors() {
        return async () => $$("//form[@id='retirement-form']//input[@type='text']");
    }

    get retirementFormInputSelector() {
        return async (index: number) => $(`(//form[@id='retirement-form']//input[@type='text'])[${index}]`);
    }

    //Default Calculator Popup Locators
    get defaultCalculatorTitleSelector() {
        return async () => $(`//h1[@id='default-values-modal-title']`);
    }

    get defaultCalcPopupAllInputSelectors() {
        return async () => $$(`//form[@id='default-values-form']//input[@type='text']`);
    }

    get defaultCalcPopupInputSelector() {
        return async (index: number) => $(`(//form[@id='default-values-form']//input[@type='text'])[${index}]`);
    }

    get inflationRadioBtnSelector() {
        return async (button: string) => $(`//fieldset[@id='include-inflation-container']//following::li/label[@for='${button}-inflation']`);
    }

    get inflationRateSelector() {
        return async () => $(`//input[@id='expected-inflation-rate']`);
    }

    get saveBtnSelector() {
        return async () => $(`//button[@class='dsg-btn-primary btn-block' and contains(text(),'Save changes')]`);
    }

    async openBrowser() {
        await this.open(data['url']);
    }

    //enter data in all the mandatory fields
    async enterDataInAllRequiredFields() {
        let requireFields = await this.retirementFormAllRequiredInputSelectors();
        let reqFieldsData = [data["Current Age"], data['Retirement Age'], data['Current annual income'], data['Current retirement savings'], data['Current retirement contribution'], data['Annual retirement contribution increase']];
        for (let i = 1; i <= requireFields.length; i++) {
            await this.setText(await this.retirementFormRequiredInputSelector(i), reqFieldsData[i - 1]);
            await browser.saveScreenshot(`./results_SS/DataInRequiredFields.png`);
        }
    }

    //skip entering data into a required field based on field number mentioned in feature file
    async skipDataInREquiredField(fieldNum: number) {
        let requireFields = await this.retirementFormAllRequiredInputSelectors();
        let reqFieldsData = [data["Current Age"], data['Retirement Age'], data['Current annual income'], data['Current retirement savings'], data['Current retirement contribution'], data['Annual retirement contribution increase']];
        for (let i = 1; i <= requireFields.length; i++) {
            if (i == fieldNum) {
                continue;
            }
            await this.scrollIntoElement(await this.retirementFormRequiredInputSelector(i));
            await this.setText(await this.retirementFormRequiredInputSelector(i), reqFieldsData[i - 1]);
        }
    }

    //Select social security radio button
    async selectSocialSecurityBenefitButton(buttonName: string) {
        buttonName = buttonName.toLowerCase();
        await this.clickElement(await this.socialBenefitRadioBtnSelector(buttonName));
        await this.waitForElementToExist(await this.socialBenefitRadioBtnSelector(buttonName), 5000, `${buttonName} not displayed`);
        (await this.socialBenefitRadioBtnSelector(buttonName)).isSelected();
        console.log(`Selected the SSN radio button to ${buttonName}`)
        await browser.saveScreenshot(`./results_SS/${buttonName}SocialSecurityFieldsDisplay.png`);
    }

    async selectMaritalStatusButton(buttonName: string) {
        await this.clickElement(await this.maritalStatusRadioBtnSelector(buttonName));
    }

    //click calculate button on retirement calculator form
    async clickCalculateButton() {
        await this.clickElement(await this.calculateBtnSelector());
        console.log(`Clicked the Calculate button`)
    }

    async clickAdjustDefaultValueLink() {
        await this.clickElement(await this.defaultValueCalcLnkSelector());
        (await this.defaultCalculatorTitleSelector()).isDisplayed();
        console.log(`Default Calculator popup displayed`);
    }

    //selelct inflation button on default calculator popup
    async selectInflationRadioButton(buttonName: string) {
        buttonName == 'Yes' ?
            await this.clickElement(await this.inflationRadioBtnSelector('include')) :
            await this.clickElement(await this.inflationRadioBtnSelector('exclude'));
            console.log(`Selected the ${buttonName} inflation radio button on default calculator`)
    }

    //click Save changes button on default calculator popup
    async clickSaveChangesButton() {
        await this.clickElement(await this.saveBtnSelector());
        console.log(`Clicked the Save Changes buuton on default calculator`)
    }

    //get the error message on the page after submitting Form with incomplete data
    async getErrorMessage() {
        await this.scrollIntoElement(await this.errorMessageSelector());
        let errorMessage = await (await this.errorMessageSelector()).getText();
        console.log(`errorMessage: ${errorMessage}`);
        return errorMessage;
    }

    //validate error message on the page after submitting Form with incomplete data
    async validateErrorMessage(errorMsg: string) {
        await expect(await this.getErrorMessage()).toEqual(errorMsg);
        console.log(`Validated the ${errorMsg} is displayed`)
    }

    //validate error message around input field
    async validateInputFieldWarningMessage(index: number) {
        await (await this.InvalidInputSelector(index)).isDisplayed();
        console.log(`Error message "${await (await this.InvalidInputSelector(index)).getAttribute('class')}" displayed around the input field ${index}`)
    }

    //enter data in all fields of the retirement calculator form
    async enterDataInAllFields() {
        let allfields = await this.retirmentFormAllTextInputSelectors();
        let allfieldsData = [data["Current Age"], data['Retirement Age'], data['Current annual income'], data['Spouse’s annual income'], data['Current retirement savings'], data['Current retirement contribution'], data['Annual retirement contribution increase'], data['Social Security Override']];
        try {
            await this.selectSocialSecurityBenefitButton(data['Social Security Income']);
            await this.selectMaritalStatusButton(data['Relationship status']);
            for (let i = 1; i <= allfields.length; i++) {
                await this.scrollIntoElement(await this.retirementFormInputSelector(i));
                await this.setText(await this.retirementFormInputSelector(i), allfieldsData[i - 1]);
                let fieldName = await (await this.retirementFormInputSelector(i)).getAttribute("id");
                console.log(`Entered value ${allfieldsData[i - 1]} into the ${fieldName} field`)
            }
        } catch (e) {
            console.log(`error: ${e}`);
        }
    }

    //validate social security fields after selecting Social security income 'Yes' button 
    async validateSocialSecurityFieldsDisplay() {
        await expect(await this.maritalStatusLabelSelector()).toBeDisplayed();
        await expect(await this.securityOverrideSelector()).toBeDisplayed();
        console.log(`Social Security fields displayed`)
        await browser.saveScreenshot(`./results_SS/SocialSecurityFieldsDisplay.png`);
    }

    //enter data into all fields on default calculator popup
    async enterDataOnDefaultCalculator() {
        let defCalculatorData = [data['Additional/other income'], data['Number of years retirement needs to last'], data['Inflation rate'], data['Percent of final annual income desired'], data['Pre-retirement investment return'], data['Post-retirement investment return']];
        let defCalculatorFields = await this.defaultCalcPopupAllInputSelectors();
        try {
            await this.selectInflationRadioButton(data['Post-retirement income increase with inflation']);
            (await this.inflationRadioBtnSelector(data['Post-retirement income increase with inflation'])).isSelected();
            await this.waitForElementToExist(await this.inflationRateSelector(), 8000, `Inflation Rate text field not displayed`);
            for (let i = 1; i <= defCalculatorFields.length; i++) {
                await this.scrollIntoElement(await this.defaultCalcPopupInputSelector(i));
                await this.setText(await this.defaultCalcPopupInputSelector(i), defCalculatorData[i - 1]);
                console.log(`Entered value ${defCalculatorData[i - 1]} into ${(await (await this.defaultCalcPopupInputSelector(i)).getAttribute('id'))} field`);
            }
        } catch (e) {
            console.log(`error: ${e}`);
        }
        await browser.saveScreenshot(`./results_SS/DataInDefaultCalculator.png`);
    }

}
export default new retirementCalculatorPage();