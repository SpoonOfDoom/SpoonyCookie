var elements;
var cookie;
var cookieClicking;
var clickSpeed = 100;
var autoBuyBuildings;
var autoBuyUpgrades;
var considerLuckyBonus;
var autoClickGolden;
var autoClickSeason;

function initialize() {
	elements = [];
	elements.push(document.getElementById('productPrice0'));
	elements.push(document.getElementById('productPrice1'));
	elements.push(document.getElementById('productPrice2'));
	elements.push(document.getElementById('productPrice3'));
	elements.push(document.getElementById('productPrice4'));
	elements.push(document.getElementById('productPrice5'));
	elements.push(document.getElementById('productPrice6'));
	elements.push(document.getElementById('productPrice7'));
	elements.push(document.getElementById('productPrice8'));
	elements.push(document.getElementById('productPrice9'));
	elements.push(document.getElementById('productPrice10'));
	elements.push(document.getElementById('productPrice11'));
	elements.push(document.getElementById('productPrice12'));
	elements.push(document.getElementById('productPrice13'));
	
	cookie = document.getElementById('bigCookie');
	clickSpeed = 100;
	autoBuyBuildings = false;
	autoBuyUpgrades = false;
	considerLuckyBonus = false;
	autoClickGolden = false;
	autoClickSeason = false;
	
	//TODO: add buttons for auto buying and auto clicking
}

function getColor(element) {
	var rgb = element.style.color;

	rgb = rgb.substring(4, rgb.length-1)
			 .replace(/ /g, '')
			 .split(',');
	return rgb;
}

function clickBest() {
	elements.forEach(function(e) {
		var colors = getColor(e);
		if (colors[0] == 0 && colors[1] == 255 && colors[2] == 0) {
			//Span is green, i.e. this is the most cost effective according to Cookie Monster
			e.click();
		}
	});
}
function clickGold() {
	if (goldenCookie.style.display != "none") {
		goldenCookie.click();
	}
	if (autoClickGolden === true) {
		setTimeout(clickGold, 1500);
	}
}
function buyUpgrades() {
	var myUpgrades = document.getElementById('upgrades').getElementsByClassName('upgrade enabled');
	if (myUpgrades.length > 0) {
		myUpgrades[0].click();
		setTimeout(buyUpgrades, 500);
	}
	//TODO: if autobuy, set timeout for larger time
}

function setClicksPerSecond(number) {
	clickSpeed = 1000/number;
}

function clickCookie() {
	Game.ClickCookie();
	cookieClicking = setTimeout(clickCookie, clickSpeed);
}

function startClicking() {
	cookieClicking = setTimeout(clickCookie, clickSpeed);
}

function stopClicking() {
	clearTimeout(cookieClicking);
}

function startAutoClickGold() {
	autoClickGolden = true;
	clickGold();
}

function stopAutoClickGold() {
	autoClickGolden = false; //TODO: make timeout variable and clear it
}

function clickSeason() {
	if (seasonPopup.style.display != "none") {
		seasonPopup.click();
	}
	if (autoClickSeason === true) {
		setTimeout(clickSeason, 5000);
	}
}

function startAutoClickSeason() {
	autoClickSeason = true;
	clickSeason();
}

function stopAutoClickSeason() {
	autoClickSeason = false; //TODO: make timeout variable and clear it
}
