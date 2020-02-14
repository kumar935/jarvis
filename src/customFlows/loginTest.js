var test = require('selenium-webdriver/testing');

const { runFlow, runSimpleFlow } = require("../service/seleniumService");

var {expect} = require('chai');

let driver;

var {url, civilId, password} = require("../../config/vars");

// let url = "https://appb-kwt.almullaexchange.com/login";
let civilIdInputXpath = "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/INPUT[1]";
// let civilId = "284052306594";
let pwdXpath = "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]";
// let password = "Amx@1234"
let loginBtnXpath = "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[3]/BUTTON[1]";

describe(`Testing Basic Login, TS: ${+new Date()}, DateTime: ${new Date()}`, function() {
    before(async function() {
      // runs before all tests in this block
      
    });
  
    after(function() {
      // runs after all tests in this block
      driver.quit();
    });
  
    beforeEach(function() {
      // runs before each test in this block
    });
  
    afterEach(function() {
      // runs after each test in this block
    });
  
    // test cases
    it( 'Login Test' , async function(){
        this.timeout(60000 * 10);
        driver = await runSimpleFlow("onlineUrl", url);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await driver
          .findElement({ xpath: civilIdInputXpath })
          .sendKeys(civilId);
        
        await driver
          .findElement({ xpath: pwdXpath })
          .sendKeys(password);
        
        await driver.findElement({ xpath: loginBtnXpath }).click();

        await new Promise(resolve => setTimeout(resolve, 3000));

        let tabsDiv = await driver.findElement({ className: "tabs" });
        let firstTab = tabsDiv.findElement({ tagName: "a" })
        let firstTabHref = await firstTab.getAttribute("href")


        let userDiv = await driver.findElement({ className: "user-name" });
        let userDivText = await userDiv.getAttribute("innerText");
        

        expect(firstTabHref).to.have.string("/app/landing/add-remitt");
        expect(userDivText).to.have.string("Welcome,")
        // driver.getTitle().then(function(title){
        //     expect(title).equals(my_title);
        // })

        // driver.sleep();
    });
  });