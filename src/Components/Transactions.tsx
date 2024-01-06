import { getTransactionCategoryIcon, transformToBRL } from "../Utils/Functions";

export default function Transactions({ transactions, setAccount }: { transactions: any; setAccount: any }) {
    if (transactions.length === 0) {
        return (
            <div className="alert alert-warning mt-3 text-center fw-bold fs-4" role="alert">
                No transactions found...
            </div>
        );
    }

    function handleDeleteTransaction(e: any) {
        if (confirm(`Are you sure you want to delete this transaction?`)) {
            const transactionId = e.nativeEvent.submitter.id;

            let Account = JSON.parse(localStorage.getItem("account") as string);

            for (let i = 0; i < Account.transactions.length; i++) {
                if (Account.transactions[i].id === transactionId) {
                    const amount = Account.transactions[i].amount;

                    Account.total_expenses -= amount;

                    if (Account.transactions[i].category === "FOOD") Account.total_expenses_food -= amount;

                    if (Account.transactions[i].category === "SUBSCRIPTIONS")
                        Account.total_expenses_subscriptions -= amount;

                    if (Account.transactions[i].category === "SHOP") Account.total_expenses_shop -= amount;

                    if (Account.transactions[i].category === "CLOTHES") Account.total_expenses_clothes -= amount;

                    if (Account.transactions[i].category === "ENTERTAINMENT")
                        Account.total_expenses_entertainment -= amount;

                    if (Account.transactions[i].category === "EDUCATION") Account.total_expenses_education -= amount;

                    if (Account.transactions[i].category === "TRANSPORT") Account.total_expenses_transport -= amount;

                    if (Account.transactions[i].category === "HOUSE") Account.total_expenses_house -= amount;

                    if (Account.transactions[i].category === "SERVICES") Account.total_expenses_services -= amount;

                    if (Account.transactions[i].category === "GIFTS") Account.total_expenses_gifts -= amount;

                    if (Account.transactions[i].category === "HEALTH") Account.total_expenses_health -= amount;

                    if (Account.transactions[i].category === "GOING_OUT") Account.total_expenses_going_out -= amount;

                    if (Account.transactions[i].category === "WORK") Account.total_expenses_work -= amount;

                    if (Account.transactions[i].category === "RENT") Account.total_expenses_rent -= amount;

                    Account.transactions.splice(i, 1);
                    localStorage.setItem("account", JSON.stringify(Account));
                    setAccount(Account);

                    break;
                }
            }
        }
    }

    return (
        <>
            {transactions.map((transaction: any, index: number) => (
                <li key="index" className="list-group-item list-group-item-action d-flex justify-content-between mt-2">
                    <div className="me-auto">
                        <p className="fw-bold text-danger">
                            <i className={getTransactionCategoryIcon(transaction.category)}></i>{" "}
                            {transaction.description.toUpperCase()}
                        </p>
                        <small>{transaction.created_at}</small>
                    </div>
                    <div className="ms-auto">
                        <h5 className="fw-bold text-danger">- R$ {transformToBRL(transaction.amount)}</h5>
                        <form className="d-flex justify-content-end" onSubmit={handleDeleteTransaction}>
                            <button type="submit" className="btn btn-sm btn-outline-danger" id={transaction.id}>
                                <i className="bi bi-trash"></i> Delete
                            </button>
                        </form>
                    </div>
                </li>
            ))}
        </>
    );
}
