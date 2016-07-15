var cookieClicking;
var clickSpeed = 100;
var autoBuyBuildings;
var autoBuyUpgrades;
var considerLuckyBonus;
var autoClickGolden;
var autoClickSeason;

function initialize() {
	setClicksPerSecond(60);
	autoBuyBuildings = false;
	autoBuyUpgrades = false;
	considerLuckyBonus = false;
	autoClickGolden = false;
	autoClickSeason = false;
	
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
	if (Game.Objects[index].price < Game.cookies) {
		Game.Objects[index].buy();
		poor = false; //If we can afford to buy the best PP building, we don't consider ourselves poor.
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
	if (goldenCookie.style.display != "none") {
		goldenCookie.click();
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
	clickSpeed = 1000/number; //TODO: Why doesn't the clickspeed work as intended?
}

function clickCookie() { //Either redo this or redo the other setTimeouts, so that they're all somewhat consistent.
	Game.ClickCookie();
	cookieClicking = setTimeout(clickCookie, clickSpeed); //TODO: Why doesn't the clickspeed work as intended? I get that it's not 100% accurate, but the Average Cookie Clicks Per Second are all over the place, sometimes decreasing when they should be increasing, or the other way around. While I was typing this comment, I've seen them go from 40 to 18 and back to 38 without anything even being changed.
}

function clickSeason() {
	if (seasonPopup.style.display != "none") {
		seasonPopup.click();
	}
	if (autoClickSeason === true) {
		setTimeout(clickSeason, 5000); //TODO: this only works if they stay long enough, after buying the upgrades - else they might escape. I should check what upgrades are owned and adjust the time accordingly.
	}
}

//TODO: merge this start/stop mess into single toggleX() functions, so that I may hold on to my sanity a tiny bit longer
function startClicking() {
	cookieClicking = setTimeout(clickCookie, clickSpeed);
}

function stopClicking() {
	clearTimeout(cookieClicking);
}

function startBuyingBuildings() {
	autoBuyBuildings = true;
	clickBestBuilding();
}

function stopBuyingBuildings() {
	autoBuyBuildings = false; //TODO: make timeout variable and clear it to prevent potentially unwanted "one last execution" syndrome?
}

function startAutoClickGold() {
	autoClickGolden = true;
	clickGold();
}

function stopAutoClickGold() {
	autoClickGolden = false; //TODO: make timeout variable and clear it to prevent potentially unwanted "one last execution" syndrome?
}

function startAutoClickSeason() {
	autoClickSeason = true;
	clickSeason();
}

function stopAutoClickSeason() {
	autoClickSeason = false; //TODO: make timeout variable and clear it to prevent potentially unwanted "one last execution" syndrome?
}
