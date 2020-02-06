var test = require('selenium-webdriver/testing');

const { runFlowWithTestCases, runSimpleFlow } = require("../service/seleniumService");

var {expect} = require('chai');

let driver;

const wait = time => new Promise(resolve => setTimeout(resolve, time))


describe('Testing My Profile and Add Bene', function() {
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
    it( 'Add Bene Duplicate Test' , async function(){
        this.timeout(60000 * 10);
        driver = await runFlowWithTestCases("addBeneTest", 0);
        console.log("first");
        //some test
        wait(300);
        driver = await runFlowWithTestCases("addBeneTest", 1);
        console.log("second");
        // some test
        wait(300);
        driver = await runFlowWithTestCases("addBeneTest", 2);
        console.log("third");
        // some test



        let eleLocator = { className: "custom-toast" };
        let toastContainer = await driver.findElement(eleLocator);
        let titleDiv = await toastContainer.findElement({className: "title"});
        let descDiv = await toastContainer.findElement({className: "desc"});
        let title = await titleDiv.getAttribute("innerHTML");
        let desc = await descDiv.getAttribute("innerHTML");
        console.log(desc);
        expect(title).equals("ERROR");
        expect(desc).equals("Duplicate Beneficiary  Cash Account");
        // driver.getTitle().then(function(title){
        //     expect(title).equals(my_title);
        // })

        // driver.sleep();
    });


    it( 'Reset Password Test' , async function(){
        this.timeout(60000 * 1);
        driver = await runSimpleFlow("resetOnlinePwd");

        await new Promise(resolve => setTimeout(resolve, 700));
        let acInfoContainer = await driver.findElement({ className: "account-info" });
        let titleEle = await acInfoContainer.findElement({ tagName: "h4" });
        let title = await titleEle.getAttribute("innerHTML");
        expect(title).equals("My Information");
        // driver.sleep();
    });


    it( 'Reset Sec Ques Test' , async function(){
        this.timeout(60000 * 1);
        driver = await runSimpleFlow("resetSecQues");

        await new Promise(resolve => setTimeout(resolve, 1000));
        let acInfoContainer = await driver.findElement({ className: "account-info" });
        let titleEle = await acInfoContainer.findElement({ tagName: "h4" });
        let title = await titleEle.getAttribute("innerHTML");
        expect(title).equals("My Information");
        // driver.sleep();
    });

    
  });