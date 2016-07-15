var elements;
var cookieClicking;
var clickSpeed = 100;
var autoBuyBuildings;
var autoBuyUpgrades;
var considerLuckyBonus;
var autoClickGolden;
var autoClickSeason;

function initialize() {
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
	var minPP = Infinity;
	var index;
	for (var o in CM.Cache.Objects) {
		if (CM.Cache.Objects[o].pp < minPP) {
			minPP = CM.Cache.Objects[o].pp;
			index = o;
		}
	}
	var obj = Game.Objects[index];
	var poor = true;
	if (Game.Objects[index].price < Game.cookies) {
		Game.Objects[index].buy();
		poor = false; //If we can afford to buy the best PP building, we don't consider ourselves poor.
	}
	if (autoBuyBuildings) {
		var time = 500;
		if (poor) {
			time = 10000; //If we're poor, we should save up a bit instead of trying again in half a second.
		}
		setTimeout(clickBest, time);
	}
}

function startBuyingBuildings() {
	autoBuyBuildings = true;
	clickBest();
}

function stopBuyingBuildings() {
	autoBuyBuildings = false;
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
	autoClickGolden = false; //TODO: make timeout variable and clear it?
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
	autoClickSeason = false; //TODO: make timeout variable and clear it?
}
