"use strict"

const cardNumber = Array.from(document.querySelectorAll(".card__number-part"))
const cardNumberValues = Array.from(document.querySelectorAll(".userdata__card-number"))

cardNumberValues.forEach(item => item.addEventListener("input", (e) => {
    if (e.target.value.length === 4) {
        e.target.nextElementSibling ? e.target.nextElementSibling.focus() : false
    }
    if (isFinite(e.data)) {
        let value = e.target.value
        let partIndex = e.target.dataset["number_part"] - 1
        cardNumber[partIndex].textContent = value.length < 4 ? value.padEnd(4, '#') : value
    } else {
        e.target.value = e.target.value.slice(0, -1)
    }

    const BIN = +cardNumber[0].textContent.slice(0, 2)
    const paymentSystemLogo = document.querySelector(".card__payment-system");

    switch (BIN) {
        case 4: paymentSystemLogo.src = "./assets/payment_system/visa.webp"; break
        case 51: case 52: case 53: case 54: case 55: paymentSystemLogo.src = "./assets/payment_system/master-card.webp"; break
        case 50: case 56: case 57: case 58: case 63: case 67: paymentSystemLogo.src = "./assets/payment_system/maestro.webp"; break
        default: paymentSystemLogo.src = "./assets/payment_system/bank.png";
    }
    BIN >= 20 && BIN < 30 ? paymentSystemLogo.src = "./assets/payment_system/mir.webp" : false;
}))

cardNumberValues.forEach(item => item.addEventListener("keydown", (e) => {
    if (e.keyCode === 8 && e.target.value.length === 0) {
        e.target.previousElementSibling.focus()
    }
}))

const usernameValue = document.querySelector(".userdata__holder-name")
const userName = document.querySelector(".card__name")
const userSurname = document.querySelector(".card__surname")

usernameValue.addEventListener("input", (e) => {
    const [nameValue, surnameValue] = e.target.value.split(/\s/)

    if (!isFinite(e.data) || e.data === " ") {
        userName.textContent = nameValue;
        userSurname.textContent = surnameValue;
    } else {
        if (e.data !== null) e.target.value = e.target.value.slice(0, -1)

        if (e.data === null) {
            userSurname.textContent?.length > surnameValue?.length ? userSurname.textContent = surnameValue : false;
            userName.textContent?.length > nameValue?.length ? userName.textContent = nameValue : false;
        }
    }
})

const dates = Array.from(document.querySelectorAll(".userdata__date"));
const dateValues = Array.from(document.querySelectorAll(".userdata__date-value"));
const cardMonth = document.querySelector('.card__month')
const cardYear = document.querySelector('.card__year')
const yearList = document.querySelectorAll('.userdata__date-list')[1]

const months = dates.filter(item => Object.hasOwn(item.dataset, "month"));

for (let i = 0; i < 7; i++) {
    const yearListItem = document.createElement("li")
    yearListItem.classList.add("userdata__date")
    yearListItem.textContent = (new Date().getFullYear() - 3) + i
    yearList.append(yearListItem)
}

const monthValue = dateValues.filter(item => Object.hasOwn(item.dataset, "month"))[0];
const yearValue = dateValues.filter(item => Object.hasOwn(item.dataset, "year"))[0];

months.forEach(item => item.addEventListener("click", (e) => {
    let month = e.target.dataset.month
    monthValue.value = month
    cardMonth.textContent = month
    month < 10 ? cardMonth.textContent = `0${month}` : cardMonth.textContent = month;
}))

const years = document.querySelectorAll('.years')

years.forEach(item => item.addEventListener("click", (e) => {
    let year = e.target.textContent
    yearValue.value = year;
    year.slice(-2) < 10 ? cardYear.textContent = `0${year.slice(-1)}` : cardYear.textContent = year.slice(-2);
})
)

const cvvElem = document.querySelector(".userdata__cvv")

cvvElem.addEventListener("input", (e) => {
    if (!isFinite(e.data)) e.target.value = e.target.value.slice(0, -1)
})

const form = document.querySelector(".payment__form")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let cardNumber = Number(cardNumberValues.map(part => part.value)?.join("")) || null
    const [nameValue, surnameValue] = usernameValue.value.split(/\s/)
    let name = nameValue || ""
    let surname = surnameValue || ""
    let month = +monthValue.value || null
    let year = +yearValue.value || null
    let cvv = +cvvElem.value || null
    let userdata = {
        cardNumber,
        name,
        surname,
        month,
        year,
        cvv,
    }

    if (`${cardNumber}`.length === 16 && name.length > 0 && surname.length > 0 && Number.isFinite(month) && Number.isFinite(year) && Number.isFinite(cvv)) {
        const btn = document.querySelector('.payment__submit-btn')
        btn.disabled = true
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: "POST",
            body: JSON.stringify(userdata),
            "headers": {
                "Content-type": "application/json"
            }
        }).then(res => { btn.disabled = false; return res.text(); })
            .then(text => alert(text))
            .catch(err => {
                alert("Ошибка отправки");
                throw new Error(err)
            })
    } else {
        alert("Неверно заполненны данные")
    }
})