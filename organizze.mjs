import { readFileSync, writeFileSync } from 'fs'
import { randomUUID } from 'crypto'
import xlsx from 'node-xlsx'

const excelConverted = xlsx.parse(
	readFileSync('organizze.xls')
)

const dados = excelConverted[0].data

const myExpenses = {
	total_expenses: 0,

	total_expenses_food: 0,
	total_expenses_food_percentage: 0,

	total_expenses_subscriptions: 0,
	total_expenses_subscriptions_percentage: 0,

	total_expenses_shop: 0,
	total_expenses_shop_percentage: 0,

	total_expenses_clothes: 0,
	total_expenses_clothes_percentage: 0,

	total_expenses_entertainment: 0,
	total_expenses_entertainment_percentage: 0,

	total_expenses_education: 0,
	total_expenses_education_percentage: 0,

	total_expenses_transport: 0,
	total_expenses_transport_percentage: 0,

	total_expenses_house: 0,
	total_expenses_house_percentage: 0,

	total_expenses_services: 0,
	total_expenses_services_percentage: 0,

	total_expenses_gifts: 0,
	total_expenses_gifts_percentage: 0,

	total_expenses_health: 0,
	total_expenses_health_percentage: 0,

	total_expenses_going_out: 0,
	total_expenses_going_out_percentage: 0,

	total_expenses_work: 0,
	total_expenses_work_percentage: 0,

	total_expenses_rent: 0,
	total_expenses_rent_percentage: 0,

	transactions: []
}

function getTimeBrazil () {
	let time = new Date().toLocaleTimeString("pt-BR");
	return `${time}`;
}

function getCategory (category) {
	if (category === 'Alimentação' || category === 'Mercado') return 'FOOD'
	if (category === 'Casa') return 'HOUSE'
	if (category === 'Lazer e hobbies') return 'ENTERTAINMENT'
	if (category === 'Assinaturas e serviços') return 'SUBSCRIPTIONS'
	if (category === 'Transporte') return 'TRANSPORT'
	if (category === 'Roupas') return 'CLOTHES'
	if (category === 'Educação') return 'EDUCATION'
	if (category === 'Compras') return 'SHOP'
	if (category === 'Presentes e doações') return 'GIFTS'
	if (category === 'Saúde') return 'HEALTH'
	if (category === 'Bares e restaurantes') return 'GOING_OUT'
	if (category === 'Trabalho') return 'WORK'
	if (category === 'Aluguel') return 'RENT'
	return 'NOT_FOUND'
}

for (let i = 1; i < dados.length; i++) {

	if (dados[i][3] < 0 && dados[i][2] !== 'Pagamento de fatura' && dados[i][2] !== 'Outros' && dados[i][2] !== 'Investimentos' && dados[i][2] !== 'Outras receitas') {

		const amount = Math.ceil(Math.abs(dados[i][3])) * 100

		console.log(`amount: ${amount} => SOMA: ${myExpenses.total_expenses += amount}`)

		if (dados[i][2] === 'Alimentação') myExpenses.total_expenses_food += amount
		if (dados[i][2] === 'Casa') myExpenses.total_expenses_house += amount
		if (dados[i][2] === 'Lazer e hobbies') myExpenses.total_expenses_entertainment += amount
		if (dados[i][2] === 'Assinaturas e serviços') myExpenses.total_expenses_subscriptions += amount
		if (dados[i][2] === 'Transporte') myExpenses.total_expenses_transport += amount
		if (dados[i][2] === 'Roupas') myExpenses.total_expenses_clothes += amount
		if (dados[i][2] === 'Educação') myExpenses.total_expenses_education += amount
		if (dados[i][2] === 'Compras') myExpenses.total_expenses_shop += amount
		if (dados[i][2] === 'Presentes e doações') myExpenses.total_expenses_gifts += amount
		if (dados[i][2] === 'Saúde') myExpenses.total_expenses_health += amount
		if (dados[i][2] === 'Bares e restaurantes') myExpenses.total_expenses_going_out += amount
		if (dados[i][2] === 'Trabalho') myExpenses.total_expenses_work += amount
		if (dados[i][2] === 'Aluguel') myExpenses.total_expenses_rent += amount

		myExpenses.transactions.push({
			id: randomUUID(),
			created_at: `${dados[i][0].replace('.', '/').replace('.', '/')} ${getTimeBrazil()}`,
			category: getCategory(dados[i][2]),
			description: `${dados[i][1]}`,
			amount: amount
		})
	}
}

myExpenses.total_expenses_food_percentage = `${((myExpenses.total_expenses_food / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_subscriptions_percentage = `${((myExpenses.total_expenses_subscriptions / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_shop_percentage = `${((myExpenses.total_expenses_shop / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_clothes_percentage = `${((myExpenses.total_expenses_clothes / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_entertainment_percentage = `${((myExpenses.total_expenses_entertainment / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_education_percentage = `${((myExpenses.total_expenses_education / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_transport_percentage = `${((myExpenses.total_expenses_transport / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_house_percentage = `${((myExpenses.total_expenses_house / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_services_percentage = `${((myExpenses.total_expenses_services / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_gifts_percentage = `${((myExpenses.total_expenses_gifts / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_health_percentage = `${((myExpenses.total_expenses_health / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_going_out_percentage = `${((myExpenses.total_expenses_going_out / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_work_percentage = `${((myExpenses.total_expenses_work / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.total_expenses_rent_percentage = `${((myExpenses.total_expenses_rent / myExpenses.total_expenses) * 100).toFixed(2)} %`

myExpenses.transactions.reverse()

writeFileSync(
	'./src/Repositories/Jsons/expenses.json',
	JSON.stringify(myExpenses, null, 4, 'utf-8')
)
