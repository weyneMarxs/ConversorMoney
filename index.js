const fromCur = document.querySelector('.from select')
const toCur = document.querySelector('.to select')
const getBtn = document.querySelector('form button')
const exIcon = document.querySelector('form .reverse')
const amount = document.querySelector('form input')
const exRateTxt = document.querySelector('form .result')
let isRotation = false

;[fromCur, toCur].forEach((select, i) => {
  for (let curCode in Country_List) {
    const selected =
      (i === 0 && curCode === 'BRL') || (i === 1 && curCode === 'USD')
        ? 'selected'
        : ''
    select.insertAdjacentHTML(
      'beforeend',
      `<option value="${curCode}" ${selected}>${curCode}</option>`
    )
  }
  select.addEventListener('change', () => {
    const code = select.value
    const imgTag = select.parentElement.querySelector('img')
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[
      code
    ].toLowerCase()}.png`
  })
})

function formatInputMoney(input) {
  const value = input.value.replace(/\D/g, '') // Remove todos os caracteres não numéricos
  const formattedValue = formatCurrency(value / 100) // Divide por 100 para considerar os centavos

  input.value = formattedValue
}

function formatCurrency(value) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: fromCur.value
  })

  return formatter.format(value)
}
// function to get exchange rate from api

async function getExchangeRate() {
  const amountValue = amount.value.replace(/\D/g, '') * 0.01 || 1

  if (isNaN(amountValue)) {
    exRateTxt.style.color = 'rgba(255, 99, 71, 1)'
    exRateTxt.innerHTML = 'Valor Digitado Invalido !'
    amount.value = ''
    return
  }
  exRateTxt.innerText = 'Getting exchenga rate...'
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/198ddf83c76dc502ccd50d9a/latest/${fromCur.value}`,
      {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
    const result = await response.json()
    const exchangeRate = result.conversion_rates[toCur.value]
    const totalExRate = (amountValue * exchangeRate).toFixed(2)
    exRateTxt.innerHTML = `${formatCurrency(amountValue).slice(3)} ${
      fromCur.value
    } = ${formatCurrency(totalExRate).slice(3)} ${toCur.value}`
  } catch (e) {
    exRateTxt.innerHTML = 'Somenting went wrong...'
    console.log(e)
  }
}

window.addEventListener('load', getExchangeRate)
getBtn.addEventListener('click', e => {
  e.preventDefault()
  getExchangeRate()
})

exIcon.addEventListener('click', () => {
  const rotateValue = isRotation ? '90deg' : '270deg'
  ;[fromCur.value, toCur.value] = [toCur.value, fromCur.value]
  ;[fromCur, toCur].forEach(select => {
    const code = select.value
    const imgTag = select.parentElement.querySelector('img')
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[
      code
    ].toLowerCase()}.png`
  })

  exIcon.style.transition = 'transform 0.5s ease'
  exIcon.style.transform = `rotate(${rotateValue})`
  isRotation = !isRotation
  formatInputMoney(amount)
  getExchangeRate()
})
