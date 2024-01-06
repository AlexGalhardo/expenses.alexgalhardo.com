import { CSSProperties } from "react";
import { TOTAL_EXPENSES_PER_PAGE } from "./Envs";
import { v4 as uuidv4 } from "uuid";

export const container: CSSProperties = {
    marginTop: "100px",
};

export function getTransactionCategoryIcon(category: string) {
    switch (category) {
        case "FOOD":
            return `bi bi-apple`;
        case "SUBSCRIPTIONS":
            return `bi bi-bookmark-star`;
        case "SHOP":
            return `bi bi-shop`;
        case "CLOTHES":
            return `bi bi-universal-access`;
        case "ENTERTAINMENT":
            return `bi bi-controller`;
        case "EDUCATION":
            return `bi bi-book`;
        case "TRANSPORT":
            return `bi bi-car-front-fill`;
        case "HOUSE":
            return `bi bi-house-door`;
        case "SERVICES":
            return `bi bi-tools`;
        case "GIFTS":
            return `bi bi-gift`;
        case "HEALTH":
            return `bi bi-hospital`;
        case "GOING_OUT":
            return `bi bi-lightning`;
        case "WORK":
            return `bi bi-folder2`;
        case "RENT":
            return `bi bi-house-dash`;
        default:
            return "";
    }
}

export function transformToBRL(amount: number) {
    return (amount / 100).toLocaleString("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getDateTimeBrazil() {
    let date = new Date().toLocaleDateString("pt-BR");
    let time = new Date().toLocaleTimeString("pt-BR");
    return `${date} ${time}`;
}

export function transformToFixedTwo(value: number) {
    return `${value.toFixed(2)} %`;
}

export function transformStringInputValueMaskToNumber(value: string): number {
    value = value.replace("R$ ", "");
    value = value.replace(",", "");
    value = value.replace(".", "");
    return Number(value);
}

export function iterateFromIndex(transactions: any, pageOffset: number) {
    const newOffset = (pageOffset * TOTAL_EXPENSES_PER_PAGE) % transactions.length;
    const arrayFromOffeset = [];
    for (let i = newOffset; i < newOffset + TOTAL_EXPENSES_PER_PAGE; i++) {
        if (transactions[i]) arrayFromOffeset.push(transactions[i]);
        if (!transactions[i]) break;
    }
    return arrayFromOffeset;
}

export function maskInputToBrazilReal(e: any) {
    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = (inputValue / 100).toFixed(2) + "";
    inputValue = inputValue.replace(".", ",");
    inputValue = inputValue.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    inputValue = inputValue.replace(/(\d)(\d{3}),/g, "$1.$2,");
    e.target.value = `R$ ${inputValue}`;
}

export interface Dados {
    Data: string;
    Descrição: string;
    Categoria: string;
    Valor: number;
    Situação: string;
}

export interface Transaction {
    id: string;
    created_at: string;
    category: string;
    description: string;
    amount: number;
}

export interface Account {
    total_expenses: number;

    total_expenses_food: number;
    total_expenses_food_percentage: number | string;

    total_expenses_subscriptions: number;
    total_expenses_subscriptions_percentage: number | string;

    total_expenses_shop: number;
    total_expenses_shop_percentage: number | string;

    total_expenses_clothes: number;
    total_expenses_clothes_percentage: number | string;

    total_expenses_entertainment: number;
    total_expenses_entertainment_percentage: number | string;

    total_expenses_education: number;
    total_expenses_education_percentage: number | string;

    total_expenses_transport: number;
    total_expenses_transport_percentage: number | string;

    total_expenses_house: number;
    total_expenses_house_percentage: number | string;

    total_expenses_services: number;
    total_expenses_services_percentage: number | string;

    total_expenses_gifts: number;
    total_expenses_gifts_percentage: number | string;

    total_expenses_health: number;
    total_expenses_health_percentage: number | string;

    total_expenses_going_out: number;
    total_expenses_going_out_percentage: number | string;

    total_expenses_work: number;
    total_expenses_work_percentage: number | string;

    total_expenses_rent: number;
    total_expenses_rent_percentage: number | string;
    transactions: Transaction[];
}

export function setAccountLocalStorage(
    dados: Dados[],
    setAccount: any,
    setTransactions: any,
    setPageCount: any,
    setPageOffset: any,
    setTotalTransactions: any,
) {
    const Account: Account = {
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

        transactions: [],
    };

    function getTimeBrazil() {
        let time = new Date().toLocaleTimeString("pt-BR");
        return `${time}`;
    }

    function getCategory(category: string) {
        if (category === "Alimentação" || category === "Mercado") return "FOOD";
        if (category === "Casa") return "HOUSE";
        if (category === "Lazer e hobbies") return "ENTERTAINMENT";
        if (category === "Assinaturas e serviços") return "SUBSCRIPTIONS";
        if (category === "Transporte") return "TRANSPORT";
        if (category === "Roupas") return "CLOTHES";
        if (category === "Educação") return "EDUCATION";
        if (category === "Compras") return "SHOP";
        if (category === "Presentes e doações") return "GIFTS";
        if (category === "Saúde") return "HEALTH";
        if (category === "Bares e restaurantes") return "GOING_OUT";
        if (category === "Trabalho") return "WORK";
        if (category === "Aluguel") return "RENT";
        return "NOT_FOUND";
    }

    for (let i = 1; i < dados.length; i++) {
        if (
            dados[i].Valor < 0 &&
            dados[i].Categoria !== "Pagamento de fatura" &&
            dados[i].Categoria !== "Outros" &&
            dados[i].Categoria !== "Investimentos" &&
            dados[i].Categoria !== "Outras receitas"
        ) {
            const amount = Math.ceil(Math.abs(dados[i].Valor)) * 100;

            console.log(`amount: ${amount} => SOMA: ${(Account.total_expenses += amount)}`);

            if (dados[i].Categoria === "Alimentação") Account.total_expenses_food += amount;
            if (dados[i].Categoria === "Casa") Account.total_expenses_house += amount;
            if (dados[i].Categoria === "Lazer e hobbies") Account.total_expenses_entertainment += amount;
            if (dados[i].Categoria === "Assinaturas e serviços") Account.total_expenses_subscriptions += amount;
            if (dados[i].Categoria === "Transporte") Account.total_expenses_transport += amount;
            if (dados[i].Categoria === "Roupas") Account.total_expenses_clothes += amount;
            if (dados[i].Categoria === "Educação") Account.total_expenses_education += amount;
            if (dados[i].Categoria === "Compras") Account.total_expenses_shop += amount;
            if (dados[i].Categoria === "Presentes e doações") Account.total_expenses_gifts += amount;
            if (dados[i].Categoria === "Saúde") Account.total_expenses_health += amount;
            if (dados[i].Categoria === "Bares e restaurantes") Account.total_expenses_going_out += amount;
            if (dados[i].Categoria === "Trabalho") Account.total_expenses_work += amount;
            if (dados[i].Categoria === "Aluguel") Account.total_expenses_rent += amount;

            Account.transactions.push({
                id: uuidv4(),
                created_at: `${dados[i].Data.replace(".", "/").replace(".", "/")} ${getTimeBrazil()}`,
                category: getCategory(dados[i].Categoria),
                description: `${dados[i].Descrição}`,
                amount: amount,
            });
        }
    }

    Account.total_expenses_food_percentage = `${((Account.total_expenses_food / Account.total_expenses) * 100).toFixed(
        2,
    )} %`;

    Account.total_expenses_subscriptions_percentage = `${(
        (Account.total_expenses_subscriptions / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_shop_percentage = `${((Account.total_expenses_shop / Account.total_expenses) * 100).toFixed(
        2,
    )} %`;

    Account.total_expenses_clothes_percentage = `${(
        (Account.total_expenses_clothes / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_entertainment_percentage = `${(
        (Account.total_expenses_entertainment / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_education_percentage = `${(
        (Account.total_expenses_education / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_transport_percentage = `${(
        (Account.total_expenses_transport / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_house_percentage = `${(
        (Account.total_expenses_house / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_services_percentage = `${(
        (Account.total_expenses_services / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_gifts_percentage = `${(
        (Account.total_expenses_gifts / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_health_percentage = `${(
        (Account.total_expenses_health / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_going_out_percentage = `${(
        (Account.total_expenses_going_out / Account.total_expenses) *
        100
    ).toFixed(2)} %`;

    Account.total_expenses_work_percentage = `${((Account.total_expenses_work / Account.total_expenses) * 100).toFixed(
        2,
    )} %`;

    Account.total_expenses_rent_percentage = `${((Account.total_expenses_rent / Account.total_expenses) * 100).toFixed(
        2,
    )} %`;

    Account.transactions.reverse();

    window.localStorage.setItem("account", JSON.stringify(Account, null, 4));

    console.log(Account);

    setAccount(Account);
    setTransactions(iterateFromIndex(Account.transactions, 0));
    setPageCount(Math.ceil(Account.transactions.length / TOTAL_EXPENSES_PER_PAGE));
    setPageOffset(0);
    setTotalTransactions(Account.transactions.length);
}
