// webdriverManager.js
const { Builder } = require("selenium-webdriver");
let driverInstance = null;

async function getWebDriver() {
    if (!driverInstance) {
        driverInstance = await new Builder().forBrowser("chrome").build();
    }
    return driverInstance;
}

async function quitWebDriver() {
    if (driverInstance) {
        await driverInstance.quit();
        driverInstance = null;
    }
}

module.exports = { getWebDriver, quitWebDriver };
