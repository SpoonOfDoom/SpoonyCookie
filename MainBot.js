var cookieClicking;
var clickSpeed;
var autoBuyBuildings;
var autoBuyUpgrades;
var buyUpgradesWInfinitePP; //Should we buy upgrades with infinite PP, for example cursor upgrades?
var considerLuckyBonus;
var autoClickGolden;
var autoClickReindeer;
var autoClickCookie;
var switches;

function initialize() {
	autoBuyBuildings = false;
	autoBuyUpgrades = false;
	buyUpgradesWInfinitePP = false;
	considerLuckyBonus = false;
	autoClickGolden = false;
	autoClickReindeer = false;
	autoClickCookie = false;
	cookieClicking = false;
	switches = [];
	setClicksPerSecond(60);

	var SCUpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		SCUpdateMenu();
		addOptionButtons();
	}

	getSwitches();

	if (Game.prefs.popups) {
		Game.Popup('SpoonyCookie loaded!');
	}
	else {
		Game.Notify('SpoonyCookie loaded!', '', '', 1, 1);
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
		var btnAutoBuyBestBuilding = createButton('SCToggleAutoBuyBestBuilding', 'Buy Best Building', 'Automatically buy the best building when you can afford it', toggleBuyingBuildings, autoBuyBuildings);
		var btnAutoBuyBestUpgrade = createButton('SCToggleAutoBuyBestUpgrade', 'Buy Best Upgrade', 'Automatically buy the best upgrade when you can afford it', toggleBuyingUpgrades, autoBuyUpgrades);
		var btnBuyInfinitePPUpgrades = createButton('SCToggleInfinitePPUpgrades', 'Buy Infinite PP Upgrades', 'Buy upgrades that have infinite PP, for example cursor upgrades', toggleBuyInfinitePPUpgrades, buyUpgradesWInfinitePP);
		var btnAutoClickBigCookie = createButton('SCToggleAutoClickBigCookie', 'Autoclick big cookie', 'Automatically click the big cookie', toggleClicking, cookieClicking);
		fragment.appendChild(btnAutoClickGold);
		fragment.appendChild(btnAutoClickReindeer);
		fragment.appendChild(btnAutoBuyBestBuilding);
		fragment.appendChild(btnAutoBuyBestUpgrade);
		fragment.appendChild(btnBuyInfinitePPUpgrades);
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
			if (Game.Upgrades[index].getPrice() < Game.cookies) {
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
			time = 10000; //If we're poor (or there's nothing to buy), we should save up a bit instead of trying again in half a second.
		}
		setTimeout(clickBestUpgrade, time);
	}
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

function setClicksPerSecond(number) {
	clickSpeed = 1000/number;
}

function clickCookie() {
	Game.ClickCookie();
	if (cookieClicking) {
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
	if (cookieClicking) {
		cookieClicking = false;
		document.getElementById('SCToggleAutoClickBigCookie').textContent = document.getElementById('SCToggleAutoClickBigCookie').textContent.replace('ON', 'OFF');
	} else {
		document.getElementById('SCToggleAutoClickBigCookie').textContent = document.getElementById('SCToggleAutoClickBigCookie').textContent.replace('OFF', 'ON');
		cookieClicking = true;
		clickCookie();
	}
}

function toggleBuyingUpgrades() {
	if (autoBuyUpgrades) {
		autoBuyUpgrades = false;
		document.getElementById('SCToggleAutoBuyBestUpgrade').textContent = document.getElementById('SCToggleAutoBuyBestUpgrade').textContent.replace('ON', 'OFF');
	} else {
		autoBuyUpgrades = true;
		document.getElementById('SCToggleAutoBuyBestUpgrade').textContent = document.getElementById('SCToggleAutoBuyBestUpgrade').textContent.replace('OFF', 'ON');
		clickBestUpgrade();
	}
}

function toggleBuyInfinitePPUpgrades() {
	if (buyUpgradesWInfinitePP) {
		buyUpgradesWInfinitePP = false;
		document.getElementById('SCToggleInfinitePPUpgrades').textContent = document.getElementById('SCToggleInfinitePPUpgrades').textContent.replace('ON', 'OFF');
	} else {
		buyUpgradesWInfinitePP = true;
		document.getElementById('SCToggleInfinitePPUpgrades').textContent = document.getElementById('SCToggleInfinitePPUpgrades').textContent.replace('OFF', 'ON');
	}
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
}

initialize();