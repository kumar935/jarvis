var test = require('selenium-webdriver/testing');

const { runFlow, runSimpleFlow } = require("../service/seleniumService");

var {expect} = require('chai');

let driver;


describe('Testing Basic Login', function() {
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
        driver = await runSimpleFlow("onlineLoginTest");

        await new Promise(resolve => setTimeout(resolve, 2000));

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