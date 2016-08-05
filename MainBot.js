var cookieClicking;
var clickSpeed;
var autoBuyBuildings;
var autoBuyUpgrades;
var considerLuckyBonus;
var autoClickGolden;
var autoClickReindeer;
var autoClickCookie;

function initialize() {
	autoBuyBuildings = false;
	autoBuyUpgrades = false;
	considerLuckyBonus = false;
	autoClickGolden = false;
	autoClickReindeer = false;
	autoClickCookie = false;
	cookieClicking = false;
	setClicksPerSecond(60);

	var SCUpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		SCUpdateMenu();
		addOptionButtons();
	}

	if (Game.prefs.popups) {
		Game.Popup('SpoonyCookie loaded!');
	}
	else {
		Game.Notify('SpoonyCookie loaded!', '', '', 1, 1);
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
		var btnAutoClickBigCookie = createButton('SCToggleAutoClickBigCookie', 'Autoclick big cookie', 'Automatically click the big cookie', toggleClicking, cookieClicking);
		fragment.appendChild(btnAutoClickGold);
		fragment.appendChild(btnAutoClickReindeer);
		fragment.appendChild(btnAutoBuyBestBuilding);
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
	if (cookieClicking) {
		setTimeout(clickCookie, clickSpeed); //TODO: Why doesn't the clickspeed work as intended? I get that it's not 100% accurate, but the Average Cookie Clicks Per Second are all over the place, sometimes decreasing when they should be increasing, or the other way around. While I was typing this comment, I've seen them go from 40 to 18 and back to 38 without anything even being changed.
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
		document.getElementById('SCToggleAutoClickBigCookie').textContent = document.getElementById('SCToggleAutoClickBigCookie').textContent.replace('ON', 'OFF');
		cookieClicking = true;
		clickCookie();
	}
}

function toggleBuyingBuildings() {
	if (autoBuyBuildings) {
		autoBuyBuildings = false;
		document.getElementById('SCToggleAutoBuyBestBuilding').textContent = document.getElementById('SCToggleAutoBuyBestBuilding').textContent.replace('ON', 'OFF');
	} else {
		autoBuyBuildings = true;
		document.getElementById('SCToggleAutoBuyBestBuilding').textContent = document.getElementById('SCToggleAutoBuyBestBuilding').textContent.replace('ON', 'OFF');
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
		document.getElementById('SCToggleAutoClickReindeer').textContent = document.getElementById('SCToggleAutoClickReindeer').textContent.replace('OFF', 'ON');
	} else {
		autoClickReindeer = true;
		document.getElementById('SCToggleAutoClickReindeer').textContent = document.getElementById('SCToggleAutoClickReindeer').textContent.replace('OFF', 'ON');
		clickReindeer();
	}
}

initialize();