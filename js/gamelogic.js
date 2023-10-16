let sum = 0;
  let tempSum = 0;
  let n = 9;
  let tempN = n;
  let numDice = Math.ceil(n*(4/18));
  let score = (n*(n+1))/2;
  let availableNums = Array(n).fill(true);
  let usedNums = Array(n).fill(false);
  let selectedNums = Array(n).fill(false);

  const TOTAL_WIDTH_IN_PIXELS = 360;
  const SCORE_WIDTH = 36;
  const MAX_TILES = 64;
  const MIN_TILES = 9;
  
  const setupScoreDisplay = function() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.style.width = SCORE_WIDTH.toString() + "px";
    
    const scoreProgressBar = document.getElementById("scoreProgressBar");
    scoreProgressBar.style.height = (100 - (score / tri(n) * 100)).toString() + "%";
    scoreProgressBar.style.width = SCORE_WIDTH.toString() + "px";
  }

  const setupNumButtons = function() {
    const numCols = Math.ceil(Math.sqrt(n));
    const numRows = Math.ceil(n / numCols);
    const cellWidth = (TOTAL_WIDTH_IN_PIXELS - SCORE_WIDTH) / numCols;
    const cellHeight = cellWidth;
    
    const numbersScoreWrapper = document.getElementById("numbersScoreWrapper");
    numbersScoreWrapper.style.height = (cellHeight * numRows).toString() + "px";
    numbersScoreWrapper.style.width = TOTAL_WIDTH_IN_PIXELS.toString() + "px";
    
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.style.height = (cellHeight * numRows - (cellWidth * 0.2)).toString() + "px";
    scoreDisplay.style.marginTop = (cellWidth * 0.2).toString() + "px";
    
    const numbersWrapper = document.getElementById("numbersWrapper");
    numbersWrapper.style.height = (cellHeight * numRows).toString() + "px";
    numbersWrapper.style.width = (TOTAL_WIDTH_IN_PIXELS - SCORE_WIDTH).toString() + "px";
    while (numbersWrapper.firstChild) {
      numbersWrapper.removeChild(numbersWrapper.lastChild);
    }
    
    for (let num = 0; num < n; num++) {
      const numString = (num+1).toString();
      const cellNode = document.createElement("div");
      cellNode.id = "button" + numString;
      cellNode.classList.add("numberButton");
      cellNode.setAttribute("onclick", "selectNumber(" + numString + ")");
      cellNode.innerHTML = numString;
      cellNode.style.width = (cellWidth * 0.8).toString() + "px";
      cellNode.style.height = (cellWidth * 0.8).toString() + "px";
      cellNode.style.marginTop = (cellWidth * 0.2).toString() + "px";
      cellNode.style.marginRight = (cellWidth * 0.2).toString() + "px";
      numbersWrapper.appendChild(cellNode);
    }
  };

  const setupDice = function() {
    const dieWidth = TOTAL_WIDTH_IN_PIXELS / numDice;
    const diceWrapper = document.getElementById("diceWrapper");
    while (diceWrapper.firstChild) {
      diceWrapper.removeChild(diceWrapper.lastChild);
    }
    diceWrapper.style.width = TOTAL_WIDTH_IN_PIXELS.toString() + "px";
    diceWrapper.style.height = Math.min(dieWidth, 120).toString() + "px";
    diceWrapper.style.marginTop = "20px";
    for (let die = 0; die < numDice; die++) {
      const dieNode = document.createElement("div");
      dieNode.classList.add("dice");
      dieNode.style.width = (dieWidth * 0.8).toString() + "px";
      dieNode.style.height = (dieWidth * 0.8).toString() + "px";
      dieNode.style.marginLeft = (dieWidth * 0.1).toString() + "px";
      dieNode.style.marginRight = (dieWidth * 0.1).toString() + "px";
      dieNode.style.maxWidth = "100px";
      dieNode.style.maxHeight = "100px";
      dieNode.style.borderRadius = Math.min(dieWidth * 0.15, 10).toString() + "px";
      const dieIconNode = document.createElement("img");
      dieIconNode.setAttribute("src", "icons/dice_icons/DiceIcons.009.png"); // ***
      dieIconNode.setAttribute("width", Math.min((dieWidth * 0.65), 65).toString() + "px");
      dieIconNode.setAttribute("height", Math.min((dieWidth * 0.65), 65).toString() + "px");
      dieNode.appendChild(dieIconNode);
      diceWrapper.appendChild(dieNode);
    }
  };

  const updateNumTilesDisplay = function() {
    const numTilesDisplay = document.getElementById("numTilesDisplay");
    numTilesDisplay.innerHTML = tempN.toString();
  };

  const updateScoreProgressBar = function() {
    const scoreProgressBar = document.getElementById("scoreProgressBar");
    scoreProgressBar.style.height = (100 - (score / tri(n) * 100)).toString() + "%";
    
    const scoreDisplayTexts = document.getElementsByClassName("scoreDisplayText");
    for (let i = 0; i < scoreDisplayTexts.length; i++) {
      scoreDisplayTexts[i].innerHTML = "SCORE: " + score.toString();
    }
  }

  const rollDice = function() {
    if (sum != tempSum) {
      console.log("You must choose a combination of available tiles that add up to a total of " + sum.toString() + " before you may reroll.");
      return null;
    }
    sum = 0;
    tempSum = 0;
    let dice = document.getElementsByClassName("dice");
    for (let i = 0; i < dice.length; i++) {
      let roll = Math.floor(Math.random() * 6) + 1;
      sum += roll;
      dice.item(i).firstChild.setAttribute("src", "icons/dice_icons/DiceIcons.00" + roll.toString() + ".png");
    }
    let rollButton = document.getElementById("rollDiceButton");
    rollButton.classList.add("disabled");
    useNumbers();
    updateAvailableNums();
    updateOptions();
    if (checkGameOver()) {
      handleGameOver();
    }
  };

  const useNumbers = function() {
    for (i = 0; i < n; i++) {
      if (selectedNums[i]) {
        availableNums[i] = false;
        selectedNums[i] = false;
        usedNums[i] = true;
      }
    }
    calculateScore();
    updateScoreProgressBar();
  };

  const calculateScore = function() {
    score = (n*(n+1))/2;
    for (i = 0; i < n; i++) {
      if (usedNums[i]) {
        score -= (i+1);
      }
    }
    console.log("Score: " + score.toString());
    checkWin();
  };

  const checkWin = function() {
    if (score == 0) {
      return true;
    }
    return false;
  };

  const checkLose = function() {
    if (checkWin()) {
      return false;
    }
    if (availableNums.every((x) => !x) && selectedNums.every((x) => !x)) {
      return true;
    }
    return false;
  };

  const checkGameOver = function() {
    if (checkWin()) {
      return true;
    } else if (checkLose()) {
      return true;
    }
    return false;
  };
  
  const spellWithDice = function(str) {
    numDice = str.length;
    setupDice();
    let dice = document.getElementsByClassName("dice");
    for (let i = 0; i < dice.length; i++) {
      if (str[i] != ' ') {
        dice.item(i).firstChild.setAttribute("src", "Lettering/Squares/letter_" + str[i] + ".png");
      }
    }
  };

  const handleGameOver = function() {
    if (checkWin()) {
      console.log("You shut the box!");
      spellWithDice("you win");
    } else if (checkLose()) {
      console.log("—— GAME OVER ——");
      console.log("Final Score: " + score);
      spellWithDice("game over");
    }
  };

  const updateOptions = function() {
    for (i = 0; i < n; i++) {
      numButton = document.getElementById("button" + (i+1).toString());
      if (selectedNums[i]) {
        numButton.classList.add("selected");
      } else {
        numButton.classList.remove("selected");
      }
      if (availableNums[i]) {
        numButton.classList.add("available");
        numButton.classList.remove("unavailable");
      } else {
        numButton.classList.add("unavailable");
        numButton.classList.remove("available");
      }
      if (usedNums[i]) {
        numButton.classList.add("used");
      } else {
        numButton.classList.remove("used");
      }
    }
    let rollButton = document.getElementById("rollDiceButton");
    if (sum == tempSum) {
      rollButton.classList.remove("disabled");
    } else {
      rollButton.classList.add("disabled");
    }
    let newGameButton = document.getElementById("newGameButton");
    if (checkGameOver()) {
      newGameButton.classList.add("emphasized");
    } else {
      newGameButton.classList.remove("emphasized");
    }
  };
  
  const checkSolutions = function() {
    unusedNums = [];
    for (i = n-1; i >= 0; i--) {
      if (!usedNums[i] && !selectedNums[i]) {
        unusedNums.push(i+1);
      }
    }
    solutions = checkSolutionsHelper(unusedNums, sum - tempSum, 0);
    return solutions;
  };
  
  // k = new sum for recursive call
  // i = pointer for where to start iterating in this recursive call
  const checkSolutionsHelper = function(arr, k, i) {
    let solutions = [];
    for (let j = i; k <= tri(arr[j]); j++) {
      let subSolutions = [];
      if (arr[j] == k) {
        subSolutions.push([]);
      }
      if (arr[j] < k) {
        subSolutions = checkSolutionsHelper(arr, k - arr[j], j+1);
      }
      for (let s = 0; s < subSolutions.length; s++) {
        solutions.push([arr[j]].concat(subSolutions[s]));
      }
    }
    return solutions;
  };
          
  const tri = function(x) {
    return (x*(x+1))/2;
  };

  const updateAvailableNums = function() {
    let solutions = checkSolutions();
    solutions = solutions.flat();
    for (let i = 0; i < n; i++) {
      if (!usedNums[i] && solutions.includes(i+1)) {
        availableNums[i] = true;
      } else if (!selectedNums[i]) {
        availableNums[i] = false;
      }
    }
  };

  const selectNumber = function(num) {
    if (usedNums[num-1] || (!availableNums[num-1] && !selectedNums[num-1])) {
      return null;
    }
    if (selectedNums[num-1]) {
      selectedNums[num-1] = false;
      availableNums[num-1] = true;
      tempSum -= num;
    } else {
      if (availableNums[num-1]) {
        selectedNums[num-1] = true;
        availableNums[num-1] = false;
        tempSum += num;
      }
    }
    updateAvailableNums();
    updateOptions();
  };
  
  const newGame = function() {
    n = tempN;
    sum = 0;
    tempSum = 0;
    score = (n*(n+1))/2;
    numDice = Math.ceil(n*(4/18));
    availableNums = Array(n).fill(true);
    usedNums = Array(n).fill(false);
    selectedNums = Array(n).fill(false);
    setupNumButtons();
    setupDice();
    updateNumTilesDisplay();
    rollDice();
  };

  const debugVals = function() {
    console.log("sum = " + sum.toString());
    console.log("tempSum = " + tempSum.toString());
    console.log("n = " + n.toString());
    console.log("score = " + score.toString());
    console.log("availableNums = " + availableNums.toString());
    console.log("selectedNums = " + selectedNums.toString());
    console.log("usedNums = " + usedNums.toString());
  };

  const changeNumTiles = function(d) {
    if (tempN + d <= MAX_TILES && tempN + d >= MIN_TILES) {
      tempN += d;
      updateNumTilesDisplay();
    }
  };

  const toggleInfoPopup = function() {
    const infoPopup = document.getElementById("infoPopupWrapper");
    infoPopup.classList.toggle("hidden");
  };

  const selectInfoTab = function(selectedTabPrefix) {
    switchSelectedInfoTab(selectedTabPrefix + "Tab");
    switchInfoPage(selectedTabPrefix + "Page");
  };

  const switchSelectedInfoTab = function(selectedInfoTabId) {
    const infoTabs = document.getElementsByClassName("infoTab");
    for (let i = 0; i < infoTabs.length; i++) {
       infoTabs[i].classList.remove("selected");
    }
    const selectedInfoTab = document.getElementById(selectedInfoTabId);
    selectedInfoTab.classList.add("selected");
  };

  const switchInfoPage = function(selectedInfoPageId) {
    const infoPages = document.getElementsByClassName("infoPage");
    for (let i = 0; i < infoPages.length; i++) {
       infoPages[i].classList.add("hidden");
    }
    const selectedInfoPage = document.getElementById(selectedInfoPageId);
    selectedInfoPage.classList.remove("hidden");
  };

  document.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      newGame();
    }
    if (event.keyCode == 32) {
      rollDice();
    }
    if (event.keyCode == 38) {
      changeNumTiles(1);
    }
    if (event.keyCode == 40) {
      changeNumTiles(-1);
    }
  });

  const main = function() {
    setupNumButtons();
    setupScoreDisplay();
    setupDice();
    updateNumTilesDisplay();
    rollDice();
  };