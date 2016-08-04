var cookieClicking;
var clickSpeed;
var autoBuyBuildings;
var autoBuyUpgrades;
var considerLuckyBonus;
var autoClickGolden;
var autoClickReindeer;
var autoClickCookie;

function initialize() {
	setClicksPerSecond(60);
	autoBuyBuildings = false;
	autoBuyUpgrades = false;
	considerLuckyBonus = false;
	autoClickGolden = false;
	autoClickSeason = false;
	autoClickCookie = false;
	
	if (Game.prefs.popups) {
		Game.Popup('SpoonyCookie loaded!');
	}
	else {
		Game.Notify('SpoonyCookie loaded!', '', '', 1, 1);
	}
	//TODO: add buttons for auto buying and auto clicking
}

function clickBestBuilding() {
	var minPP = Infinity;
	var index;
	for (var o in CM.Cache.Objects) { //It took me an embarrasingly long time to realize that CM.Cache.Objects is, in fact, an object, not an array, and that array.map would not get me anywhere. I blame the Firefox console for telling blatantly lying and telling me it was an array. </rant>
		if (CM.Cache.Objects[o].pp < minPP) {
			minPP = CM.Cache.Objects[o].pp;
			index = o;
		}
	}
	var poor = true;
	try { //try ... catch because sometimes Game.Objects[index] was undefined and everything crashed and burned. I can only assume that in some cases, index isn't set correctly in the loop above, but I haven't yet been able to reproduce the exact circumstances.
		if (Game.Objects[index].price < Game.cookies) {
			Game.Objects[index].buy();
			poor = false; //If we can afford to buy the best PP building, we don't consider ourselves poor.
		}
	} catch (e) {
		console.log(e.message);
	}
	if (autoBuyBuildings) {
		var time = 500;
		if (poor) {
			time = 10000; //If we're poor, we should save up a bit instead of trying again in half a second.
		}
		setTimeout(clickBestBuilding, time);
	}
}

function clickGold() {
	for (var i in Game.shimmers) {
		if (Game.shimmers[i].type == "golden") {
			Game.shimmers[i].pop();
		}
	}
	if (autoClickGolden === true) {
		setTimeout(clickGold, 1500);
	}
}

function buyUpgrades() {
	var myUpgrades = document.getElementById('upgrades').getElementsByClassName('upgrade enabled'); //TODO: Holy shit, I hope nobody sees this. What was I thinking? Replace with actual Game.UpgradesInStore.
	if (myUpgrades.length > 0) {
		myUpgrades[0].click();
		setTimeout(buyUpgrades, 500);
	}
	//TODO: if autobuy, set timeout for larger time
}

function setClicksPerSecond(number) {
	clickSpeed = 1000/number; //TODO: Why doesn't the clickspeed work as intended? Might have to do with setTimeout vs setInterval.
}

function clickCookie() { //Either redo this or redo the other setTimeouts, so that they're all somewhat consistent.
	Game.ClickCookie();
	cookieClicking = setTimeout(clickCookie, clickSpeed); //TODO: Why doesn't the clickspeed work as intended? I get that it's not 100% accurate, but the Average Cookie Clicks Per Second are all over the place, sometimes decreasing when they should be increasing, or the other way around. While I was typing this comment, I've seen them go from 40 to 18 and back to 38 without anything even being changed.
}

function clickReindeer() {
	for (var i in Game.shimmers) {
		if (Game.shimmers[i].type == "reindeer") {
			Game.shimmers[i].pop();
		}
	}
	if (autoClickReindeer === true) {
		setTimeout(clickReindeer, 5000); //TODO: this only works if they stay long enough, after buying the upgrades - else they might escape. I should check what upgrades are owned and adjust the time accordingly.
	}
}

function toggleClicking() {
	if (cookieClicking) {
		clearTimeout(cookieClicking);
	} else {
		clickCookie();
	}
}

function toggleBuyingBuildings() {
	if (autoBuyBuildings) {
		autoBuyBuildings = false;
	} else {
		autoBuyBuildings = true;
		clickBestBuilding();
	}
}

function toggleAutoClickGold() {
	if (autoClickGolden) {
		autoClickGolden = false;
	} else {
		autoClickGolden = true;
		clickGold();
	}
}

function toggleAutoClickReindeer() {
	if (autoClickReindeer) {
		autoClickReindeer = false;
	} else {
		autoClickReindeer = true;
		clickReindeer();
	}
}

initialize();