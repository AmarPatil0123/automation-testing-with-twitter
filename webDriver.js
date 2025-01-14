// webdriverManager.js
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

let driverInstance = null;

async function getWebDriver() {
    if (!driverInstance) {
        const options = new chrome.Options();
        options.addArguments("--headless"); // Enable headless mode
        options.addArguments("--disable-gpu"); // Disable GPU acceleration
        options.addArguments("--no-sandbox"); // Bypass OS security model, for testing
        options.addArguments("--disable-dev-shm-usage"); // Overcome resource limitations on some systems

        driverInstance = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
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
