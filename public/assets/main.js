var counter = 0;

var question1 = document.querySelector("#question1")
var clickToQ2 = document.querySelector(".clickToQ2")

var question2 = document.querySelector("#question2")
var clickToQ3 = document.querySelector(".clickToQ3")

var question3 = document.querySelector("#question3")
var clickToQ4 = document.querySelector(".clickToQ4")

var question4 = document.querySelector("#question4")
var clickToQ5 = document.querySelector(".clickToQ5")

var question5 = document.querySelector("#question5")
var clickToQ6 = document.querySelector(".clickToQ6")

var question6 = document.querySelector("#question6")
var clickToQ7 = document.querySelector(".clickToQ7")

var question7 = document.querySelector("#question7")
var clickToResult = document.querySelector(".clickToResult")

var result = document.querySelector("#result")

/* ========================================================================== */


clickToQ2.onclick = () => {
    errorMsg = question1.querySelector(".error-msg")
    var val = question1.querySelector('input[name="options"]:checked');
    if (val != null) {
        var points = parseInt(val.value);
        counter += points
        if(!isNaN(parseInt(document.querySelector('span').innerHTML))){
            addExtra = parseInt(document.querySelector('span').innerHTML);
        }
        counter += addExtra
        document.querySelector("span").innerHTML = counter
        question1.style.display = 'none'
        question2.style.display = 'block'
        console.log(counter)
    } else {
        errorMsg.innerHTML = errorMessage2
    }
}

clickToQ3.onclick = () => {
    errorMsg = question2.querySelector(".error-msg")
    var val = question2.querySelector('input[name="options"]:checked');
    if (val != null) {
        var points = parseInt(val.value);
        counter += points
        document.querySelector("span").innerHTML = counter
        question2.style.display = 'none'
        question3.style.display = 'block'
        console.log(counter)

    } else {
        errorMsg.innerHTML = errorMessage2
    }
}

clickToQ4.onclick = () => {
    errorMsg = question3.querySelector(".error-msg")
    var val = question3.querySelector('input[name="options"]:checked');
    if (val != null) {
        var points = parseInt(val.value);
        counter += points
        document.querySelector("span").innerHTML = counter
        question3.style.display = 'none'
        question4.style.display = 'block'
        console.log(counter)

    } else {
        errorMsg.innerHTML = errorMessage2
    }
}

clickToQ5.onclick = () => {
    errorMsg = question4.querySelector(".error-msg")
    var val = question4.querySelector('input[name="options"]:checked');
    if (val != null) {
        var points = parseInt(val.value);
        counter += points
        document.querySelector("span").innerHTML = counter
        question4.style.display = 'none'
        question5.style.display = 'block'
        console.log(counter)

    } else {
        errorMsg.innerHTML = errorMessage2
    }
}

clickToQ6.onclick = () => {
    errorMsg = question5.querySelector(".error-msg")
    var val = question5.querySelector('input[name="options"]:checked');
    if (val != null) {
        var points = parseInt(val.value);
        counter += points
        document.querySelector("span").innerHTML = counter
        question5.style.display = 'none'
        question6.style.display = 'block'
        console.log(counter)

    } else {
        errorMsg.innerHTML = errorMessage2
    }
}

clickToQ7.onclick = () => {
    errorMsg = question6.querySelector(".error-msg")
    var val = question6.querySelector('input[name="options"]:checked');
    if (val != null) {
        var points = parseInt(val.value);
        counter += points
        document.querySelector("span").innerHTML = counter
        question6.style.display = 'none'
        question7.style.display = 'block'
        console.log(counter)

    } else {
        errorMsg.innerHTML = errorMessage2
    }
}

clickToResult.onclick = () => {
    document.querySelector('.points').style.display= "none"
    errorMsg = question7.querySelector(".error-msg")
    var val = question7.querySelector('input[name="options"]:checked');
    if (val != null) {
        var points = parseInt(val.value);
        counter += points
        question7.style.display = 'none'
        result.style.display = 'block'
        var str = ""
        if (counter <= 40 && counter > 30) {
            str = "Excellent, Your points: " + counter
        } else if (counter <= 30 && counter > 15) {
            str = "Good enough, Your points: " + counter
        } else if (counter <= 15 && counter > 0) {
            str = "Pay more attention next time, Your points: " + counter
        }
        document.querySelector(".show-result").innerHTML = str
        console.log(counter)
    } else {
        errorMsg.innerHTML = errorMessage2
    }
}