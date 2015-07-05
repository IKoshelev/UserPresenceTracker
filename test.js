var selenium = require('selenium-webdriver');

var driver = new selenium
					.Builder()
					.withCapabilities(selenium.Capabilities.firefox())
					.build();

 var promise = driver.get("http://127.0.0.1:8080/test.js")//.get('http://www.techinsight.io/')
		.then(function(){
			////var element = driver.findElement(selenium.By.tagName('body'));
			
			//// element
			////     .getAttribute('id')
			////     .then(console.log);
    var a = driver;
			
			
		})
		.thenFinally(function () { driver.quit(); });
