const express = require("express");
const app = express();
const path = require("path");
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { getWebDriver, quitWebDriver } = require("./webDriver.js");
const Trend = require("./models/trends.js");
const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

async function main(params) {
  await mongoose.connect(process.env.MONGODB);
}

main().then(()=>{
  console.log("DB connected");
}).catch((err)=>{
  console.log("Error while connecting to DB");
})

app.get("/", (req, res)=>{
  res.render("../views/trendingtopics.ejs");
})

app.get("/tdata", async(req, res)=>{

  const driver = await getWebDriver();

  try {
    //navigate to facebook login page
    await driver.get("https://x.com/i/flow/login");
    // Select input elements and fill them out
    

    await driver.findElement(By.className("css-175oi2r")).click();

    const usernameField = await driver.wait(until.elementLocated(By.xpath("//input[@autocomplete='username']")), 5000)
    await usernameField.sendKeys(process.env.USER);

    await driver.findElement(By.xpath("//button[.//span[text()='Next']]")).click();

    // const emailField = await driver.wait(until.elementLocated(By.xpath("//input[@type='text']")), 4000);
    // await emailField.sendKeys("apscary444@gmail.com");

    // await driver.findElement(By.xpath, "//button[@tabindex='-1']").click();

    const passwordField = await driver.wait(until.elementLocated(By.xpath("//input[@type='password']")), 4000);
    await passwordField.sendKeys(process.env.PASSWORD);
   
    await driver.findElement(By.xpath("//button[@data-testid='LoginForm_Login_Button']")).click();
   
    await driver.sleep(10000);

    await driver.executeScript("window.location.href='https://x.com/explore/tabs/trending'")

    await driver.sleep(4000);

    let trendsList = await driver.wait(until.elementsLocated(By.xpath("//div[contains(@class, 'r-1bymd8e')]//span[contains(@class, 'css-1jxf684')]")), 100000)

    let trendArray = [];
    
    for(let i=1; i<=5;i++){
      let trendText = await trendsList[i].getText();
      trendArray.push(trendText);
    }

    const response = await fetch('https://httpbin.org/ip');
    const data = await response.json();
    let ip = data.origin;
    console.log('Your Public IP Address:', data.origin);

    const dbData = new Trend({
        trendsArray : trendArray,
        ip : ip,
    })

    let dbdata = await dbData.save();
   
    let tData = await Trend.find();
    let tdata = (tData[tData.length - 1]);
   
    res.json(tdata);    

  }catch(error){
    console.log(error.message)
  }

})


app.get("/moreTrends/:id", async(req, res)=>{

  try {
    let {id} = req.params;
  let start = Number(id);

  const driver = await getWebDriver();

    let trendsList = await driver.wait(until.elementsLocated(By.xpath("//div[contains(@class, 'r-1bymd8e')]//span[contains(@class, 'css-1jxf684')]")), 100000)

    listLength = trendsList.length;
    console.log(listLength)

    if (start >= listLength) {
      return res.status(404).json({ trends: "No more trends available" });
  }

  let end = Math.min(start + 5, listLength);

    let trendArray = [];
    
    for(let i = start; i<= end; i++){
      let trendText = await trendsList[i].getText();
      trendArray.push(trendText);
    }

    const response = await fetch('https://httpbin.org/ip');
    const data = await response.json();
    let ip = data.origin;
    console.log('Your Public IP Address:', data.origin);

    const dbData = new Trend({
        trendsArray : trendArray,
        ip : ip,
    })

    let dbdata = await dbData.save();

    let tData = await Trend.find();
    let tdata = (tData[tData.length - 1]);
   
    res.json(tdata);    
  } catch (error) {
    res.json({error : error.message})
  }
})


app.listen("8080", ()=>{
    console.log("Running on port 8080")
});

app.all("*",(req, res)=>{
  if(req.path === "/"){
    return res.redirect("/recipes")
}
  res.redirect("/")
})
