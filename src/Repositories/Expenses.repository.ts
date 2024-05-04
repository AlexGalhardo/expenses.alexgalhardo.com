import * as stringSimilarity from "string-similarity";

import { transactions } from "./Jsons/expenses.json";

export interface ExpenseTransaction {
    id: string;
    created_at: string;
    category: string;
    description: string;
    amount: number;
}

export interface ExpensesRepositoryPort {
    searchAllExpensesTransactionsSimilarDescription(expenseDescription: string): ExpenseTransaction[];
}

export default class ExpensesRepository implements ExpensesRepositoryPort {
    constructor(private expensesTransactions: ExpenseTransaction[] = transactions) {
        if (window.localStorage.getItem("account")) {
            const { transactions } = JSON.parse(window.localStorage.getItem("account") as string);
            this.expensesTransactions = transactions;
        }
    }

    public searchAllExpensesTransactionsSimilarDescription(expenseDescription: string): ExpenseTransaction[] {
        if (window.localStorage.getItem("account")) {
            const { transactions } = JSON.parse(window.localStorage.getItem("account") as string);
            this.expensesTransactions = transactions;
        }

        const transactionsFound = this.expensesTransactions.filter((transaction: ExpenseTransaction) =>
            transaction.description.toLowerCase().includes(expenseDescription.toLowerCase()),
        );

        const matches = stringSimilarity.findBestMatch(
            expenseDescription,
            this.expensesTransactions.map((transaction) => transaction.description),
        );

        matches.ratings.forEach((similarity) => {
            if (similarity.rating >= 0.5) {
                if (
                    !transactionsFound.some(
                        (transaction) => transaction.description.toLowerCase() === similarity.target.toLowerCase(),
                    )
                ) {
                    transactionsFound.push(
                        this.expensesTransactions.filter(
                            (transaction) => transaction.description === similarity.target,
                        )[0],
                    );
                }
            }
        });

        return transactionsFound;
    }
}
