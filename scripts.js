// Variáveis
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

const expenseList = document.getElementById('expenseList')
const expensesQuantity = document.querySelector('aside header p span')
const expenseTotal = document.querySelector('aside header h2')

amount.oninput = () => {
  // Valor do input convertido para apenas números;
  let value = amount.value.replace(/\D/g, '');
  // Converção do valor para centavos
  value = Number(value) / 100;
  // Colocando o valor em centavos para ser convertido para Real e sendo colocado no input
  amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value){
  value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return value
}

form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    amount: amount.value,
    expense: expense.value,
    category_name: category.options[category.selectedIndex].text,
    category_id: category.value,
    created_at: new Date()
  }
  expenseAdd(newExpense)
}

function expenseAdd(newExpense){
  try{
    // Cria um novo item(li) da lista(ul)
    const expenseItem = document.createElement('li');
    expenseItem.classList.add('expense')

    // Cria o ícone do novo item
    const expenseIcon = document.createElement('img')
    expenseIcon.setAttribute('src', `./img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute('alt', `${newExpense.category_name}`)

    // Cria a Info da despesa
    const expenseInfo = document.createElement('div')
    expenseInfo.classList.add('expense-info')

    // Cria o nome da despesa
    const expenseName = document.createElement('strong')
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement('span')
    expenseCategory.textContent = newExpense.category_name

    // Cria o valor da despesa
    const expenseAmount = document.createElement('span')
    expenseAmount.classList.add('expense-amount')
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`

    //Cria o ícone de deletar
    const removeIcon = document.createElement('img')
    removeIcon.classList.add('remove-icon') 
    removeIcon.setAttribute('src', './img/remove.svg')
    removeIcon.setAttribute('alt', 'remover')

    // Adiciona os itens na div Expense-Info
    expenseInfo.append(expenseName, expenseCategory)

    // Adiciona os novos itens na li
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona a nova li na lista(ul)
    expenseList.append(expenseItem)

    // Limpa os inputs
    formClear()

    // Atualiza a lista
    updateTotal()
  }catch(error){
    alert('Não for possivel atualizar a lista de despesas')
    console.log(error)
  }
}

function updateTotal(){
  try {
    const items = expenseList.children

    // Atualiza a quantidade de itens na lista
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`

    // Criar uma variável total
    let total = 0;

    // Percorrer os valores da lista
    for(let item=0; item < items.length; item++){
      const itemAmount = items[item].querySelector('.expense-amount');

      let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',','.')
      
      value = parseFloat(value)

      if(isNaN(value)){
        alert('Não foi possivel pagar a quantia. Parece que não é um número!')
      }

      total += value
    } 

    total = formatCurrencyBRL(total).toUpperCase().replace('R$', '')

    expenseTotal.innerHTML = `<small>R$</small>${total}`

  } catch (error) {
    console.log(error)
    alert('Não foi possivel atualizar o total')
  }
}

expenseList.addEventListener("click", (event) => {
  if(event.target.classList.contains('remove-icon')){
    
    const item = event.target.closest('.expense')
    item.remove()
  }

  updateTotal()
})

function formClear(){
  amount.value = ''
  category.value = ''
  expense.value = ''

  expense.focus()
}