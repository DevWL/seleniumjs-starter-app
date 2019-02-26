'use strict';
/**
 * https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html#titleContains
 * https://remarkablemark.org/blog/2016/06/15/firefox-binary-webdriverjs/
 * https://www.npmjs.com/package/selenium-webdriver
 */

/**
 * Module dependencies.
 * http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
 */
var webdriver = require('selenium-webdriver');
const { writeFile } = require('fs');
const { promisify } = require('util');
const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
// const chrome = require('selenium-webdriver/chrome');


/**
 * Create WebDriver instance.
 * http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Builder.html
 */
var builder = new webdriver.Builder();
// set default browser to 'firefox'
builder.forBrowser('firefox');

/**
 * Set configuration options for the FirefoxDriver.
 * http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox/index.html
 */
var firefoxOptions = new firefox.Options();
// set the binary to use (replace the argument below to point to your Firefox executable)
firefoxOptions.setBinary('C:/Program Files (x86)/Mozilla Firefox/firefox.exe');
builder.setFirefoxOptions(firefoxOptions);

/**
 * Run driver.
 * http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox/index_exports_Driver.html
 */
var driver = builder.build();

const waitForPageLoad = async function(){
    await driver.wait(async () => {
        const readyState = await driver.executeScript('return document.readyState');
        return readyState === 'complete';
      });
}

async function main() {
    try {
        await driver.get('https://developer.mozilla.org/');
    
        await waitForPageLoad();
    
        await driver.findElement(By.id('home-q')).sendKeys('testing', Key.RETURN);

        // await driver.sleep(2000); // use drive.wait and until utility instead

        // wait for the element to be present then add some text
        const elementSearch = await driver.wait(until.elementLocated(By.id('search-q')), 20000)
            .then(result => {
                console.log('Element found? %s', result); //returns string
                return result;
            }
        );

        await elementSearch.sendKeys('Wiktor Liszkiewicz ');

        // show page title
        let title = await driver.getTitle();
        console.log('This is page title: ', title);

        // until documentation https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html#titleContains
        await driver.wait(until.titleIs('Wyniki szukania dla „testing” | MDN')) // if no timeout will be set in collback - script will keep waiting to match the condition
            .then(async result => {
                await driver.sleep(6000); // give your self time to take a pick before next action hits
                console.log('titleIs same? %s', result);
                return result; //returns boolean
            }, error => {
                // if timeout is set!
                console.log('timeout');   
            }
        ); 
        
        // until documentation https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html#titleContains
        const button = await driver.wait(
            until.elementLocated(By.css('a[tabindex="1"]')), 
            20000
        ).then(btn => {
            console.log('button? %s', btn);
            btn.click();
            return btn;
        });
        

        const data = await driver.takeScreenshot();
        await promisify(writeFile)('screenshot.png', data, 'base64');
        
    } catch (error) {
        console.log('something went wrong -----', error);
    } finally {
        await driver.quit();
        console.log('driver quit');
    } 
}
  
  main();