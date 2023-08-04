const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const LengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatePassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let chechkCount = 0;
let symbols = `~'!@#$%^&*()_-+={}[];:"<,>.?/`;
handleSlider();
setIndicator("#ccc");

// Set Password length
function handleSlider() {
    inputSlider.value = passwordLength;
    LengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) +"% 100%";
}


// Set Strength Color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) {
        hasUpper = true
        console.log("U")
    };
    if (lowercaseCheck.checked){
         hasLower = true;
         console.log("L")
    }
    if (numbersCheck.checked){
         hasNum = true;
         console.log("N")
    }
    if (symbolsCheck.checked){ 
        hasSym = true;
        console.log("S")
    }

    console.log(((hasUpper && hasLower) && (hasNum || hasSym)) && (passwordLength >= 8));

    if (((hasUpper && hasLower) && (hasNum || hasSym)) && (passwordLength >= 8)) {
        setIndicator("#00FF00");
        console.log("Green");
    }
    else if (((hasLower || hasUpper) && (hasNum || hasSym)) && (passwordLength >= 6)) {
        setIndicator("#FF0000");
        console.log("Red");
    }
    else {
        setIndicator("#f00");
        console.log("Else");
    }
}

async function copyContent() {
    try {
        navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange() {
    chechkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            chechkCount++;
    });

    //Special Condition
    if (passwordLength < chechkCount) {
        passwordLength = chechkCount;
        handleSlider();
    }
}

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});



generateBtn.addEventListener('click', () => {
    // None of Checkbox are Selected
    if (chechkCount <= 0) return;

    if (passwordLength < chechkCount) {
        passwordLength = chechkCount;
        // console.log("Password Length")
        handleSlider();
    }

    // Find New Password

    // Remove Old Password
    password = "";
    let funArr = [];
    if (uppercaseCheck.checked) {
        funArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funArr.push(generateLowerCase);

    }
    if (numbersCheck.checked) {
        funArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funArr.push(generateSymbol);
    }

    //COMPULSORY ADDITION
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = generateRandomNumber(0, funArr.length - 1);
        while (typeof funArr[randIndex] !== "function") {
            randIndex = generateRandomNumber(0, funArr.length - 1);
        }
        password += funArr[randIndex]();
        // console.log(funArr[randIndex] + funArr.length + i);
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;
    calcStrength();
});
