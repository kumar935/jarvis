var test = require('selenium-webdriver/testing');

const { runFlow, runSimpleFlow } = require("../service/seleniumService");

var {expect} = require('chai');

let driver;


describe('hooks', function() {
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
    it( 'Add Bene' , async function(){
        this.timeout(60000 * 10);
        driver = await runSimpleFlow("addBeneTest");
        let eleLocator = { className: "custom-toast" };
        let toastContainer = await driver.findElement(eleLocator);
        let titleDiv = await toastContainer.findElement({className: "title"});
        let descDiv = await toastContainer.findElement({className: "desc"});
        let title = await titleDiv.getAttribute("innerHTML");
        let desc = await descDiv.getAttribute("innerHTML");
        expect(title).equals("ERROR");
        // driver.getTitle().then(function(title){
        //     expect(title).equals(my_title);
        // })

        // driver.sleep();
    });
    it( 'Config test' , async function(){
        this.timeout(60000 * 1);
        driver = await runSimpleFlow("toastTest");
        let eleLocator = { className: "custom-toast" };

        expect("ERR").equals("ERROR");
        // driver.getTitle().then(function(title){
        //     expect(title).equals(my_title);
        // })

        // driver.sleep();
    });
  });