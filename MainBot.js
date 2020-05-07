var configKey = 'SCConfig';
var clickSpeed; //TODO: turn all of these into a config object to simplify saving and loading
var autoBuyBuildings;
var autoBuyUpgrades;
var autoBuyReloaded;
var buyUpgradesWInfinitePP; //Should we buy upgrades with infinite PP, for example cursor upgrades?
var considerLuckyBonus;
var considerLuckyBonusFrenzy;
var autoClickGolden;
var autoClickReindeer;
var autoClickCookie;
var switches;

function initialize() {
	autoBuyBuildings = false;
	autoBuyUpgrades = false;
	autoBuyReloaded = false;
	autoClickFortune = false;
	buyUpgradesWInfinitePP = false;
	considerLuckyBonus = false;
	considerLuckyBonusFrenzy = false;
	autoClickGolden = false;
	autoClickReindeer = false;
	autoClickCookie = false;
	switches = [];
	setClicksPerSecond(60);

	loadConfig();

	var SCUpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		SCUpdateMenu();
		addOptionButtons();
	}

	getSwitches();
	// if (autoBuyReloaded) {
	// 	clickBestBuildingOrUpgrade();
	// } else {
	if (autoBuyBuildings) {
	clickBestBuilding();
	}
	if (autoBuyUpgrades) {
		clickBestUpgrade();
	}
	// }

	if (autoClickFortune) {
		clickFortune();
	}
	
	if (autoClickGolden) {
		clickGold();
	}
	if (autoClickReindeer) {
		clickReindeer();
	}
	if (autoClickCookie) {
		clickCookie();
	}
	if (Game.prefs.popups) {
		Game.Popup('SpoonyCookie loaded!');
	}
	else {
		Game.Notify('SpoonyCookie loaded!', '', '', 1, 1);
	}
}

function saveConfig() {
	var config = {};
	// config["autoBuyReloaded"] = autoBuyReloaded;
	config["autoBuyBuildings"] = autoBuyBuildings;
	config["autoBuyUpgrades"] = autoBuyUpgrades;
	config["buyUpgradesWInfinitePP"] = buyUpgradesWInfinitePP;
	config["autoClickFortune"] = autoClickFortune;
	config["autoClickCookie"] = autoClickCookie;
	config["autoClickGolden"] = autoClickGolden;
	config["autoClickReindeer"] = autoClickReindeer;
	config["clickSpeed"] = clickSpeed;
	config["considerLuckyBonus"] = considerLuckyBonus;
	config["considerLuckyBonusFrenzy"] = considerLuckyBonusFrenzy;

	localStorage.setItem(configKey, JSON.stringify(config));
}

function loadConfig() {
	if (localStorage.getItem(configKey) != null) {
		var config = JSON.parse(localStorage.getItem(configKey));
		autoBuyBuildings = config["autoBuyBuildings"];
		autoBuyUpgrades = config["autoBuyUpgrades"];
		// autoBuyReloaded = config["autoBuyReloaded"];
		buyUpgradesWInfinitePP = config["buyUpgradesWInfinitePP"];
		autoClickFortune = config["autoClickFortune"]
		autoClickCookie = config["autoClickCookie"];
		autoClickGolden = config["autoClickGolden"];
		autoClickReindeer = config["autoClickReindeer"];
		clickSpeed = config["clickSpeed"];
		considerLuckyBonus = config["considerLuckyBonus"];
		considerLuckyBonusFrenzy = config["considerLuckyBonusFrenzy"];
	}
}

function getSwitches() {
	for (var key in Game.UpgradesByPool['toggle']) {
		var upgradeName = Game.UpgradesByPool['toggle'][key].name;
		switches.push(upgradeName);
	}
}

function addOptionButtons() {
	if (Game.onMenu == 'prefs') {
		var fragment = document.createDocumentFragment();
		var title = document.createElement('div');
		title.className = 'listing';
		title.style.cssText = 'padding: 5px 16px; opacity: 0.7; font-size: 17px; font-family: "Kavoon",Georgia,serif;';
		title.textContent = 'SpoonyCookie Toggles';
		fragment.appendChild(title);
		var btnAutoClickGold = createButton('SCToggleAutoClickGold', 'Golden Cookies', 'Automatically click golden cookies', toggleAutoClickGold, autoClickGolden);
		var btnAutoClickReindeer = createButton('SCToggleAutoClickReindeer', 'Reindeer', 'Automatically click reindeer', toggleAutoClickReindeer, autoClickReindeer);
		var btnAutoClickFortune = createButton('SCToggleAutoClickFortune', 'Fortune', 'Automatically clicks foruntes in the ticker', toggleAutoClickFortune, autoClickFortune);
		// var btnAutoBuyBestAnything = createButton('SCToggleAutoBuyBestAnything', 'Buy Best Anything', 'Automatically buy the best upgrade or building when you can afford it', toggleBuyingReloaded, autoBuyReloaded);
		var btnAutoBuyBestBuilding = createButton('SCToggleAutoBuyBestBuilding', 'Buy Best Building', 'Automatically buy the best building when you can afford it', toggleBuyingBuildings, autoBuyBuildings);
		var btnAutoBuyBestUpgrade = createButton('SCToggleAutoBuyBestUpgrade', 'Buy Best Upgrade', 'Automatically buy the best upgrade when you can afford it', toggleBuyingUpgrades, autoBuyUpgrades);
		var btnBuyInfinitePPUpgrades = createButton('SCToggleInfinitePPUpgrades', 'Buy Infinite PP Upgrades', 'Buy upgrades that have infinite PP, for example cursor upgrades', toggleBuyInfinitePPUpgrades, buyUpgradesWInfinitePP);
		var btnConsiderLuckyBonus = createButton('SCToggleConsiderLuckyBonus', 'Consider Lucky Bonus Limit', 'Don\'t buy stuff if it puts you under the amount required for the "Lucky!" bonus.', toggleConsiderLucky, considerLuckyBonus);
		var btnConsiderLuckyBonusFrenzy = createButton('SCToggleConsiderLuckyBonusFrenzy', 'Consider Lucky Bonus (Frenzy) Limit', 'Don\'t buy stuff if it puts you under the amount required for the "Lucky!" (Frenzy) bonus.', toggleConsiderLuckyFrenzy, considerLuckyBonusFrenzy);
		var btnAutoClickBigCookie = createButton('SCToggleAutoClickBigCookie', 'Autoclick big cookie', 'Automatically click the big cookie', toggleClicking, autoClickCookie);
		
		fragment.appendChild(btnAutoClickGold);
		fragment.appendChild(btnAutoClickReindeer);
		fragment.appendChild(btnAutoClickFortune);
		// fragment.appendChild(btnAutoBuyBestAnything);
		fragment.appendChild(btnAutoBuyBestBuilding);
		fragment.appendChild(btnAutoBuyBestUpgrade);
		fragment.appendChild(btnBuyInfinitePPUpgrades);
		fragment.appendChild(btnConsiderLuckyBonus);
		fragment.appendChild(btnConsiderLuckyBonusFrenzy);
		fragment.appendChild(btnAutoClickBigCookie);
		document.getElementById('menu').childNodes[2].insertBefore(fragment, document.getElementById('menu').childNodes[2].childNodes[document.getElementById('menu').childNodes[2].childNodes.length - 1]);
	}
}

function createButton(name, btnText, labelText, toCall, state) {
	var div = document.createElement('div');
	div.className = 'listing';
	var a = document.createElement('a');
	a.className = 'option';
	
	a.id = name;
	a.onclick = function() {toCall(); this.classList.toggle('off');};
	a.textContent = btnText;
	if (state === false) {
		a.className += ' off';
		a.textContent += ' OFF';
	} else {
		a.textContent += ' ON';
	}
	div.appendChild(a);
	var label = document.createElement('label');
	label.textContent = labelText;
	div.appendChild(label);
	return div;
}

function luckyOkay (price) {
	if (considerLuckyBonus || considerLuckyBonusFrenzy) {
		var leftOver = Game.cookies - price;
		if ( (considerLuckyBonus && leftOver < CM.Cache.Lucky) || (considerLuckyBonusFrenzy && leftOver < CM.Cache.LuckyFrenzy) ) {
			return false;
		}
	}
	return true;
}

function clickBestUpgrade() {
	var minPP = Infinity;
	var index;
	var poor = true;
	var firstInfPP;

	for (var i = 0; i < Game.UpgradesInStore.length; i++) {
		var upgradeName = Game.UpgradesInStore[i].name;
		if (switches.includes(upgradeName)) {
			continue;
		}
		if (firstInfPP === undefined && CM.Cache.Upgrades[upgradeName].pp == Infinity) {
			firstInfPP = upgradeName;
		}
		if (CM.Cache.Upgrades[upgradeName].pp < minPP) {
			minPP = CM.Cache.Upgrades[upgradeName].pp;
			index = upgradeName;
		}
	}
	if (index === undefined && buyUpgradesWInfinitePP) { // If we haven't found an upgrade without infinite PP, we'll choose the first one of those.
		index = firstInfPP;
	}
	if (index !== undefined) {
		try {
			if (Game.Upgrades[index].getPrice() < Game.cookies && luckyOkay(Game.Upgrades[index].getPrice()) ) {
				Game.Upgrades[index].buy();
				poor = false; //If we can afford to buy the best PP upgrade, we don't consider ourselves poor.
			}
		} catch (e) {
			console.log("Can't buy Upgrade " + index + ": " + e.message);
		}
	}
	
	if (autoBuyUpgrades) {
		var time = 500;
		if (poor) {
			time = 5000; //If we're poor (or there's nothing to buy), we should save up a bit instead of trying again in half a second.
		}
		setTimeout(clickBestUpgrade, time);
	}
}

function clickBestBuilding() {
	var minPP = Infinity;
	var index;
	for (var o in CM.Cache.Objects) {
		if (CM.Cache.Objects[o].pp < minPP) {
			minPP = CM.Cache.Objects[o].pp;
			index = o;
		}
	}
	var poor = true;
	try { //try ... catch because sometimes Game.Objects[index] was undefined and everything crashed and burned. I can only assume that in some cases, index isn't set correctly in the loop above, but I haven't yet been able to reproduce the exact circumstances.
		if (Game.Objects[index].price < Game.cookies && luckyOkay(Game.Objects[index].getPrice()) ) {
			Game.Objects[index].buy();
			poor = false; //If we can afford to buy the best PP building, we don't consider ourselves poor.
		}
	} catch (e) {
		console.log("Can't buy building " + index + ": " + e.message);
	}
	if (autoBuyBuildings) {
		var time = 500;
		if (poor) {
			time = 10000; //If we're poor, we should save up a bit instead of trying again in half a second.
		}
		setTimeout(clickBestBuilding, time);
	}
}

// function clickBestBuildingOrUpgrade() {
// 	var minPP = Infinity;
// 	var indexU;
// 	var indexB;
// 	var poor = true;
// 	var firstInfPP;

// 	for (var i = 0; i < Game.UpgradesInStore.length; i++) {
// 		var upgradeName = Game.UpgradesInStore[i].name;
// 		if (switches.includes(upgradeName)) {
// 			continue;
// 		}
// 		if (firstInfPP === undefined && CM.Cache.Upgrades[upgradeName].pp == Infinity) {
// 			firstInfPP = upgradeName;
// 		}
// 		if (CM.Cache.Upgrades[upgradeName].pp < minPP) {
// 			minPP = CM.Cache.Upgrades[upgradeName].pp;
// 			indexU = upgradeName;
// 		}
// 	}
// 	if (indexU === undefined && buyUpgradesWInfinitePP) { // If we haven't found an upgrade without infinite PP, we'll choose the first one of those.
// 		indexU = firstInfPP;
// 	}
		
// 	for (var o in CM.Cache.Objects) {
// 		if (CM.Cache.Objects[o].pp < minPP) {
// 			minPP = CM.Cache.Objects[o].pp;
// 			indexB = o;
// 		}
// 	}
	
// 	if (indexU !== undefined && indexB === undefined) {
// 		try {
// 			if (Game.Upgrades[indexU].getPrice() < Game.cookies && luckyOkay(Game.Upgrades[indexU].getPrice()) ) {
// 				Game.Upgrades[indexU].buy();
// 				poor = false; //If we can afford to buy the best PP upgrade, we don't consider ourselves poor.
// 			}
// 		} catch (e) {
// 			console.log("Can't buy Upgrade " + indexU + ": " + e.message);
// 		}
// 	} else if (indexB !== undefined) {
// 		try { //try ... catch because sometimes Game.Objects[index] was undefined and everything crashed and burned. I can only assume that in some cases, index isn't set correctly in the loop above, but I haven't yet been able to reproduce the exact circumstances.
// 			if (Game.Objects[indexB].price < Game.cookies && luckyOkay(Game.Objects[indexB].getPrice()) ) {
// 				Game.Objects[indexB].buy();
// 				poor = false; //If we can afford to buy the best PP building, we don't consider ourselves poor.
// 			}
// 		} catch (e) {
// 			console.log("Can't buy building " + index + ": " + e.message);
// 		}
// 	}
	
	// if (autoBuyReloaded) {
	// 	var time = 500;
	// 	if (poor) {
	// 		time = 5000; //If we're poor, we should save up a bit instead of trying again in half a second.
	// 	}
	// 	setTimeout(clickBestBuildingOrUpgrade, time);
	// }
// }

function clickFortune() {
	console.log("click Fortune!")
	if (Game.TickerEffect.type == "fortune") {
		Game.tickerL.click();
	}
	if (autoClickFortune) {
		setTimeout(clickFortune, 1500);
	}
}

function clickGold() {
	for (var i in Game.shimmers) {
		if (Game.shimmers[i].type == "golden") {
			Game.shimmers[i].pop();
		}
	}
	if (autoClickGolden === true) {
		setTimeout(clickGold, 1000);
	}
}

function setClicksPerSecond(number) {
	clickSpeed = 1000/number;
}

function clickCookie() {
	Game.ClickCookie();
	if (autoClickCookie) {
		setTimeout(clickCookie, clickSpeed); //TODO: Dynamically calculate timeout time to adjust for execution time of function. 
	}
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
	if (autoClickCookie) {
		autoClickCookie = false;
		document.getElementById('SCToggleAutoClickBigCookie').textContent = document.getElementById('SCToggleAutoClickBigCookie').textContent.replace('ON', 'OFF');
	} else {
		document.getElementById('SCToggleAutoClickBigCookie').textContent = document.getElementById('SCToggleAutoClickBigCookie').textContent.replace('OFF', 'ON');
		autoClickCookie = true;
		clickCookie();
	}
	saveConfig();
}

// function toggleBuyingReloaded() {
// 	if (autoBuyReloaded) {
// 		autoBuyReloaded = false;
// 		document.getElementById('SCToggleAutoBuyBestAnything').textContent = document.getElementById('SCToggleAutoBuyBestAnything').textContent.replace('ON', 'OFF');
// 	} else {
// 		autoBuyReloaded = true;
// 		document.getElementById('SCToggleAutoBuyBestAnything').textContent = document.getElementById('SCToggleAutoBuyBestAnything').textContent.replace('OFF', 'ON');
// 		clickBestBuildingOrUpgrade();
// 	}
// 	saveConfig();
// }

function toggleBuyingUpgrades() {
	if (autoBuyUpgrades) {
		autoBuyUpgrades = false;
		document.getElementById('SCToggleAutoBuyBestUpgrade').textContent = document.getElementById('SCToggleAutoBuyBestUpgrade').textContent.replace('ON', 'OFF');
	} else {
		autoBuyUpgrades = true;
		document.getElementById('SCToggleAutoBuyBestUpgrade').textContent = document.getElementById('SCToggleAutoBuyBestUpgrade').textContent.replace('OFF', 'ON');
		clickBestUpgrade();
	}
	saveConfig();
}

function toggleBuyInfinitePPUpgrades() {
	if (buyUpgradesWInfinitePP) {
		buyUpgradesWInfinitePP = false;
		document.getElementById('SCToggleInfinitePPUpgrades').textContent = document.getElementById('SCToggleInfinitePPUpgrades').textContent.replace('ON', 'OFF');
	} else {
		buyUpgradesWInfinitePP = true;
		document.getElementById('SCToggleInfinitePPUpgrades').textContent = document.getElementById('SCToggleInfinitePPUpgrades').textContent.replace('OFF', 'ON');
	}
	saveConfig();
}

function toggleConsiderLucky() {
	if (considerLuckyBonus) {
		considerLuckyBonus = false;
		document.getElementById('SCToggleConsiderLuckyBonus').textContent = document.getElementById('SCToggleConsiderLuckyBonus').textContent.replace('ON', 'OFF');
	} else {
		considerLuckyBonus = true;
		document.getElementById('SCToggleConsiderLuckyBonus').textContent = document.getElementById('SCToggleConsiderLuckyBonus').textContent.replace('OFF', 'ON');
	}
	saveConfig();
}

function toggleConsiderLuckyFrenzy() {
	if (considerLuckyBonusFrenzy) {
		considerLuckyBonusFrenzy = false;
		document.getElementById('SCToggleConsiderLuckyBonusFrenzy').textContent = document.getElementById('SCToggleConsiderLuckyBonusFrenzy').textContent.replace('ON', 'OFF');
	} else {
		considerLuckyBonusFrenzy = true;
		document.getElementById('SCToggleConsiderLuckyBonusFrenzy').textContent = document.getElementById('SCToggleConsiderLuckyBonusFrenzy').textContent.replace('OFF', 'ON');
	}
	saveConfig();
}

function toggleBuyingBuildings() {
	if (autoBuyBuildings) {
		autoBuyBuildings = false;
		document.getElementById('SCToggleAutoBuyBestBuilding').textContent = document.getElementById('SCToggleAutoBuyBestBuilding').textContent.replace('ON', 'OFF');
	} else {
		autoBuyBuildings = true;
		document.getElementById('SCToggleAutoBuyBestBuilding').textContent = document.getElementById('SCToggleAutoBuyBestBuilding').textContent.replace('OFF', 'ON');
		clickBestBuilding();
	}
	saveConfig();
}

function toggleAutoClickGold() {
	if (autoClickGolden) {
		autoClickGolden = false;
		document.getElementById('SCToggleAutoClickGold').textContent = document.getElementById('SCToggleAutoClickGold').textContent.replace('ON', 'OFF');
	} else {
		autoClickGolden = true;
		document.getElementById('SCToggleAutoClickGold').textContent = document.getElementById('SCToggleAutoClickGold').textContent.replace('OFF', 'ON');
		clickGold();
	}
	saveConfig();
}

function toggleAutoClickFortune() {
	if (autoClickFortune) {
		autoClickFortune = false;
		document.getElementById('SCToggleAutoClickFortune').textContent = document.getElementById('SCToggleAutoClickFortune').textContent.replace('ON', 'OFF');
	} else {
		autoClickFortune = true;
		document.getElementById('SCToggleAutoClickFortune').textContent = document.getElementById('SCToggleAutoClickFortune').textContent.replace('OFF', 'ON');
		clickFortune();
	}
	saveConfig();
}

function toggleAutoClickReindeer() {
	if (autoClickReindeer) {
		autoClickReindeer = false;
		document.getElementById('SCToggleAutoClickReindeer').textContent = document.getElementById('SCToggleAutoClickReindeer').textContent.replace('ON', 'OFF');
	} else {
		autoClickReindeer = true;
		document.getElementById('SCToggleAutoClickReindeer').textContent = document.getElementById('SCToggleAutoClickReindeer').textContent.replace('OFF', 'ON');
		clickReindeer();
	}
	saveConfig();
}

initialize();