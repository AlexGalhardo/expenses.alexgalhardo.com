import ExcelJS from 'exceljs'

function generateRandomDate(start: any, end: any) {
	const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
	const date = new Date(randomTime);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

function generateRandomTransaction() {
	const categories = ['Alimentação', 'Casa', 'Lazer e hobbies', 'Assinaturas e serviços', 'Transporte', 'Roupas', 'Educação', 'Compras', 'Presentes e doações', 'Saúde', 'Bares e restaurantes', 'Trabalho', 'Aluguel'];
	const status = ["Pago"];

	const itemsByCategory: any = {
		'Alimentação': ['Mercado Central', 'Restaurante do João', 'Padaria Pão Quente', 'Hamburgueria do Zé', 'Mercado Expresso'],
		'Casa': ['Material de Construção', 'Pagamento de Contas de Luz', 'Compra de Móveis', 'Manutenção Hidráulica', 'Reforma do Banheiro'],
		'Lazer e hobbies': ['Ingresso para Cinema', 'Assinatura de Streaming', 'Aula de Dança', 'Livro de Ficção Científica', 'Camping com Amigos'],
		'Assinaturas e serviços': ['Spotify Premium', 'Netflix', 'Academia', 'Plano de Telefonia', 'Curso Online de Fotografia'],
		'Transporte': ['Combustível', 'Uber', 'Passagem de Ônibus', 'Manutenção de Veículo', 'Aluguel de Bicicleta'],
		'Roupas': ['Loja de Departamento', 'Compra de Tênis', 'Roupa para Ocasiões Especiais', 'Camisetas Personalizadas', 'Lavagem a Seco'],
		'Educação': ['Mensalidade da Faculdade', 'Material Didático', 'Curso de Idiomas', 'Palestra sobre Marketing Digital', 'Curso de Programação'],
		'Compras': ['Compra de Eletrônicos', 'Supermercado', 'Loja de Decoração', 'Compra de Presentes', 'Shopping Center'],
		'Presentes e doações': ['Doação para ONG', 'Presente de Aniversário', 'Contribuição para Vaquinha Online', 'Doação para Abrigo de Animais', 'Ajuda a um Amigo'],
		'Saúde': ['Consulta Médica', 'Plano de Saúde', 'Medicamentos', 'Exames Laboratoriais', 'Acupuntura'],
		'Bares e restaurantes': ['Barzinho com os Amigos', 'Restaurante Japonês', 'Churrascaria', 'Happy Hour no Pub', 'Rodízio de Pizza'],
		'Trabalho': ['Material de Escritório', 'Despesas de Viagem a Trabalho', 'Taxa de Inscrição em Evento Corporativo', 'Café para Reunião', 'Aluguel de Sala para Reuniões'],
		'Aluguel': ['Aluguel do Apartamento', 'Aluguel de Carro', 'Taxa de Condomínio', 'Aluguel de Equipamentos', 'Aluguel de Espaço para Evento']
	};

	const date = generateRandomDate(new Date(2020, 0, 1), new Date());
	const category = categories[Math.floor(Math.random() * categories.length)];

	const descriptions = itemsByCategory[category];
	const description = descriptions[Math.floor(Math.random() * descriptions.length)];

	const amount = Math.round((Math.random() * -250 - 1));
	const transactionStatus = status[Math.floor(Math.random() * status.length)];

	return [date, description, category, amount, transactionStatus];
}

const transactions: any = [["Data", "Descrição", "Categoria", "Valor", "Situação"]]

for (let i = 0; i < 1000; i++) {
	transactions.push(generateRandomTransaction());
}


const createExcel = async () => {
	try {
		const excelBuffer = await generateXLS(transactions);
		await Bun.write(`./expenses-excel.xls`, await excelBuffer);
	} catch (err) {
		console.error(err);
	}
};

async function generateXLS(data: any) {
	try {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Data");

		data.forEach((row: any) => {
			worksheet.addRow(row);
		});

		worksheet.columns.forEach((column: any) => {
			let maxLength = 0;
			column?.eachCell({ includeEmpty: true }, (cell: any) => {
				const columnLength = cell.value ? cell.value.toString().length : 10;
				if (columnLength > maxLength) {
					maxLength = columnLength;
				}
			});
			column.width = maxLength < 10 ? 10 : maxLength;
		});

		return await workbook.xlsx.writeBuffer();
	} catch (err) {
		console.error(err);
		throw new Error("Failed to generate Excel file");
	}
}

await createExcel()
