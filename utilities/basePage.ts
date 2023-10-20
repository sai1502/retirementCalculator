import { browser } from "@wdio/globals";
import { WaitForOptions } from "webdriverio";

export default class basePage{

    //Navigate to the URL
    async open(urlPath: string){
        await browser.url(urlPath)
    }

    //TO set the value of text element
    async setText(element: WebdriverIO.Element, text: any){
        await this.waitForElementClickable(element, 5000, "Element not clickable");
        await this.clickElement(element);
        await element.setValue(text);
    }

    //To click an element
    async clickElement(element: WebdriverIO.Element){
        this.scrollIntoElement(element);
        await element.click();
    }

    //To scroll to an element
    async scrollIntoElement(element: WebdriverIO.Element){
        await element.scrollIntoView({block: 'center', inline: 'center'});
    }

    //To wait for an element to exist within DOM
    async waitForElementToExist(element: WebdriverIO.Element, timeout: number, errorMessage: string){
        const options: WaitForOptions={timeout: timeout, reverse: false, timeoutMsg: errorMessage};
        return await element.waitForExist(options);
    }

    //Waiting for an element to be clickable
    async waitForElementClickable(element: WebdriverIO.Element, timeout: number, errorMessage: string){
        const options: WaitForOptions={timeout: timeout, reverse: false, timeoutMsg: errorMessage};
        return await element.waitForClickable(options);
    }

}