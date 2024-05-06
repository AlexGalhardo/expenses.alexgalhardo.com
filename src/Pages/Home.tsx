import { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import Navbar from "../Components/Navbar";
import Head from "../Components/Head";
import expensesJson from "../Repositories/Jsons/expenses.json";
import ExpensesRepository, { ExpenseTransaction } from "../Repositories/Expenses.repository";
import ReactPaginate from "react-paginate";
import { v4 as uuid } from "uuid";
import {
    Dados,
    container,
    getDateTimeBrazil,
    iterateFromIndex,
    maskInputToBrazilReal,
    setAccountLocalStorage,
    transformStringInputValueMaskToNumber,
    transformToBRL,
    transformToFixedTwo,
} from "../Utils/Functions";
import Transactions from "../Components/Transactions";
import { TOTAL_EXPENSES_PER_PAGE } from "../Utils/Envs";

export default function Home() {
    const [account, setAccount] = useState<any>("");

    const [suggestions, setSuggestions] = useState<ExpenseTransaction[]>([]);
    const [transactions, setTransactions] = useState<any>([]);
    const [transactionsByDate, setTransactionsByDate] = useState<any>();
    const [pageOffset, setPageOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseDescription, setExpenseDescription] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchFinalDate, setSearchFinalDate] = useState("");
    const [totalExpendSearch, setTotalExpendSearch] = useState<number>(0);
    const [dolar, setDolar] = useState("");
    const [euro, setEuro] = useState("");
    const [bitcoin, setBitcoin] = useState("");
    const [startAmount, setStartAmount] = useState<number>(0);
    const [interestMonthly, setInterestMonthly] = useState<number>(0);
    const [totalMonths, setTotalMonths] = useState<number>(0);
    const [totalCompoundInterest, setTotalCompoundInterest] = useState<number>(0);
    const [totalProfitOnly, setTotalProfitOnly] = useState<number>(0);
    const [noTransactionsFound, setNoTransactionsFound] = useState<boolean>(false);

    useEffect(() => {
        if (startAmount && interestMonthly && totalMonths) {
            const amount = startAmount * Math.pow(1 + interestMonthly / 100, totalMonths);
            setTotalCompoundInterest(Number(amount.toFixed(2)));
            setTotalProfitOnly(Number((amount - startAmount).toFixed(2)));
        }
    }, [startAmount, interestMonthly, totalMonths]);

    function resetTransactions() {
        const account = JSON.parse(window.localStorage.getItem("account") as string);
        setAccount(account);
        setPageCount(Math.ceil(account.transactions.length / TOTAL_EXPENSES_PER_PAGE));
        setTransactions(iterateFromIndex(account.transactions, 0));
        setPageOffset(0);
        setTotalTransactions(account.transactions.length);
        setTotalExpendSearch(0);
    }

    const handleSearchExpenseTransactionDescription = (e: any) => {
        const transactionDescription = e.target.value;

        if (transactionDescription.length === 0) {
            resetTransactions();
        }

        if (transactionDescription.trim() !== "" && transactionDescription.length > 2) {
            const transactionsFound = new ExpensesRepository().searchAllExpensesTransactionsSimilarDescription(
                transactionDescription,
            );

            if (!transactionsFound.length) {
                setNoTransactionsFound(true);
                setTotalExpendSearch(0);
                setSuggestions([]);
                setPageCount(Math.ceil(transactions.length / TOTAL_EXPENSES_PER_PAGE));
                setTransactions(iterateFromIndex(transactions, 0));
                setPageOffset(0);
                setTotalTransactions(transactions.length);
            } else {
                setNoTransactionsFound(false);
                setSuggestions(
                    transactionsFound.map((transaction) => {
                        return {
                            ...transaction,
                        };
                    }),
                );
                setTotalExpendSearch(
                    transactionsFound.reduce((accumulator, transaction) => {
                        return accumulator + transaction.amount;
                    }, 0),
                );
                setPageCount(Math.ceil(suggestions.length / TOTAL_EXPENSES_PER_PAGE));
                setTransactions(iterateFromIndex(suggestions, 0));
                setPageOffset(0);
                setTotalTransactions(suggestions.length);
            }
        }
    };

    const handlePageChange = (event: any) => {
        if (suggestions.length > 9) {
            setTransactions(iterateFromIndex(suggestions, event.selected));
        } else if (transactionsByDate?.length) {
            setTransactions(iterateFromIndex(transactionsByDate, event.selected));
        } else {
            setTransactions(iterateFromIndex(account.transactions, event.selected));
        }
        setPageOffset(event.selected);
    };

    useEffect(() => {
        if (!window.localStorage.getItem("account")) {
            window.localStorage.setItem("account", JSON.stringify(expensesJson));
            const account = JSON.parse(window.localStorage.getItem("account") as string);
            setAccount(account);
            setPageCount(Math.ceil(account.transactions.length / TOTAL_EXPENSES_PER_PAGE));
            setTransactions(iterateFromIndex(account.transactions, 0));
            setPageOffset(0);
            setTotalTransactions(account.transactions.length);
        } else {
            const account = JSON.parse(window.localStorage.getItem("account") as string);
            setAccount(account);
            setPageCount(Math.ceil(account.transactions.length / TOTAL_EXPENSES_PER_PAGE));
            setTransactions(iterateFromIndex(account.transactions, 0));
            setPageOffset(0);
            setTotalTransactions(account.transactions.length);
        }

        const interval = setInterval(async () => {
            const response = await fetch(`https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const json = await response.json();

            setDolar(Number(json.USDBRL.ask).toFixed(2));
            setEuro(Number(json.EURBRL.ask).toFixed(2));
            setBitcoin((json.BTCBRL.ask / 1000).toFixed(3));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleExpenseAmount = (e: any) => {
        setExpenseAmount(e.target.value);
    };

    const handleExpenseDescription = (e: any) => {
        setExpenseDescription(e.target.value);
    };

    const handleExpenseCategory = (e: any) => {
        setExpenseCategory(e.target.value);
    };

    const handleSearchCategory = (e: any) => {
        setSearchCategory(e.target.value);
    };

    function handleNewExpense(event: any) {
        const amountExpensed = transformStringInputValueMaskToNumber(expenseAmount);

        if (amountExpensed <= 0) {
            alert("Enter a valid expense value greater than 0!");
            event.preventDefault();
        }

        let Account = JSON.parse(window.localStorage.getItem("account") as string);

        if (amountExpensed > 0) {
            if (Account) {
                Account.total_expenses += amountExpensed;

                if (expenseCategory === "FOOD") Account.total_expenses_food += amountExpensed;

                if (expenseCategory === "SUBSCRIPTIONS") Account.total_expenses_subscriptions += amountExpensed;

                if (expenseCategory === "SHOP") Account.total_expenses_shop += amountExpensed;

                if (expenseCategory === "CLOTHES") Account.total_expenses_clothes += amountExpensed;

                if (expenseCategory === "ENTERTAINMENT") Account.total_expenses_entertainment += amountExpensed;

                if (expenseCategory === "EDUCATION") Account.total_expenses_education += amountExpensed;

                if (expenseCategory === "TRANSPORT") Account.total_expenses_transport += amountExpensed;

                if (expenseCategory === "HOUSE") Account.total_expenses_house += amountExpensed;

                if (expenseCategory === "SERVICES") Account.total_expenses_services += amountExpensed;

                if (expenseCategory === "GIFTS") Account.total_expenses_gifts += amountExpensed;

                if (expenseCategory === "HEALTH") Account.total_expenses_health += amountExpensed;

                if (expenseCategory === "GOING_OUT") Account.total_expenses_going_out += amountExpensed;

                if (expenseCategory === "WORK") Account.total_expenses_work += amountExpensed;

                if (expenseCategory === "RENT") Account.total_expenses_rent += amountExpensed;

                const newTransaction = {
                    id: uuid(),
                    created_at: getDateTimeBrazil(),
                    category: expenseCategory,
                    description: expenseDescription.toUpperCase(),
                    amount: amountExpensed,
                };

                Account.transactions.unshift(newTransaction);

                window.localStorage.setItem("newTransaction", JSON.stringify(newTransaction));

                window.localStorage.setItem("account", JSON.stringify(Account));

                setAccount(Account);
            }
        }
    }

    const handleSearchByDate = (event: any) => {
        event.preventDefault();

        const transactionsFound = [];

        if (window.localStorage.getItem("account")) {
            if (searchStartDate && searchFinalDate) {
                let account = JSON.parse(window.localStorage.getItem("account") as string);

                if (!account.transactions) {
                    setTransactions([]);
                    setTransactionsByDate([]);
                    setPageCount(0);
                    setPageOffset(0);
                    setTotalTransactions(0);
                }

                for (let i = 0; i < account.transactions.length; i++) {
                    let created_at = account.transactions[i].created_at.slice(0, 10);
                    let dateFormated = `${created_at[3]}${created_at[4]}/${created_at[0]}${created_at[1]}/${created_at[6]}${created_at[7]}${created_at[8]}${created_at[9]}`;
                    let dateFormatedTimestamp = new Date(dateFormated).getTime();

                    if (
                        searchCategory === "ALL" &&
                        dateFormatedTimestamp >= new Date(searchStartDate).getTime() &&
                        dateFormatedTimestamp <= new Date(searchFinalDate).getTime()
                            ? true
                            : account.transactions[i].category === searchCategory &&
                              dateFormatedTimestamp >= new Date(searchStartDate).getTime() &&
                              dateFormatedTimestamp <= new Date(searchFinalDate).getTime()
                    ) {
                        transactionsFound.push(account.transactions[i]);
                    }
                }
            }
        } else {
            setTransactions([]);
            setTransactionsByDate([]);
            setPageCount(0);
            setPageOffset(0);
            setTotalTransactions(0);
        }

        if (transactionsFound.length) {
            setPageCount(Math.ceil(transactionsFound.length / TOTAL_EXPENSES_PER_PAGE));
            setTransactions(iterateFromIndex(transactionsFound, 0));
            setTransactionsByDate(transactionsFound);
            setPageOffset(0);
            setTotalTransactions(transactionsFound.length);
            setNoTransactionsFound(false);
            setTotalExpendSearch(
                transactionsFound.reduce((accumulator, transaction) => {
                    return accumulator + transaction.amount;
                }, 0),
            );
        } else {
            setTotalTransactions(0);
            setTransactions([]);
            setNoTransactionsFound(true);
            setTotalExpendSearch(0);
        }
    };

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = xlsx.read(data, { type: "array" });
            const sheet_name_list = workbook.SheetNames;
            const dados: Dados[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

            setAccountLocalStorage(
                dados,
                setAccount,
                setTransactions,
                setPageCount,
                setPageOffset,
                setTotalTransactions,
            );
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <>
            <Head title="expenses.alexgalhardo.com" description="" />

            <Navbar />

            <div
                className="modal fade"
                id="modalExpense"
                tabIndex={Number("-1")}
                aria-labelledby="modalExpenseLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 fw-bold text-danger" id="modalExpenseLabel">
                                <i className="bi bi-plus"></i>
                                New Expense
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleNewExpense}>
                                <div className="mb-3">
                                    <label className="form-label text-danger fw-bold">Amount:</label>
                                    <input
                                        className="form-control fs-4"
                                        placeholder="R$ 10.00"
                                        onKeyUp={maskInputToBrazilReal}
                                        onChange={handleExpenseAmount}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-danger fw-bold">Description:</label>
                                    <input
                                        type="text"
                                        className="form-control fs-4"
                                        placeholder="Example: Dinner Pizza Dominós"
                                        value={expenseDescription}
                                        onChange={handleExpenseDescription}
                                        required
                                    />
                                </div>

                                <label className="form-label text-danger fw-bold">Category:</label>
                                <select
                                    className="form-select text-danger fw-bold text-danger fw-bold fs-5"
                                    value={expenseCategory}
                                    onChange={handleExpenseCategory}
                                    required
                                >
                                    <option className="text-danger fw-bold" value="FOOD">
                                        FOOD
                                    </option>
                                    <option className="text-danger fw-bold" value="SUBSCRIPTIONS">
                                        SUBSCRIPTION
                                    </option>
                                    <option className="text-danger fw-bold" value="SHOP">
                                        SHOP
                                    </option>
                                    <option className="text-danger fw-bold" value="CLOTHES">
                                        CLOTHES
                                    </option>
                                    <option className="text-danger fw-bold" value="ENTERTAINMENT">
                                        ENTERTAINMENT
                                    </option>
                                    <option className="text-danger fw-bold" value="EDUCATION">
                                        EDUCATION
                                    </option>
                                    <option className="text-danger fw-bold" value="TRANSPORT">
                                        TRANSPORT
                                    </option>
                                    <option className="text-danger fw-bold" value="HOUSE">
                                        HOUSE
                                    </option>
                                    <option className="text-danger fw-bold" value="GIFTS">
                                        GIFTS
                                    </option>
                                    <option className="text-danger fw-bold" value="HEALTH">
                                        HEALTH
                                    </option>
                                    <option className="text-danger fw-bold" value="RENT">
                                        RENT
                                    </option>
                                </select>

                                <br />
                                <button className="btn btn-outline-danger btn-lg w-100 fw-bold fs-4" type="submit">
                                    Confirm Expense
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="modalCompoundInterest"
                tabIndex={Number("-1")}
                aria-labelledby="modalExpenseLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 fw-bold text-secondary" id="modalLabel">
                                Calculate Compount Interest
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">Start Amount:</label>
                                <input
                                    className="form-control fs-4"
                                    placeholder="R$ 10.00"
                                    onKeyUp={maskInputToBrazilReal}
                                    onChange={(e) =>
                                        setStartAmount(
                                            Number(e.target.value.replace("R$ ", "").replace(".", "").replace(",", "")),
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">Interest % monthly:</label>
                                <input
                                    className="form-control fs-4"
                                    min={1}
                                    step={0.1}
                                    max={100}
                                    placeholder="10"
                                    onChange={(e) => setInterestMonthly(Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary fw-bold">Total Months</label>
                                <input
                                    className="form-control fs-4"
                                    min={1}
                                    step={1}
                                    max={100}
                                    placeholder="24"
                                    onChange={(e) => setTotalMonths(Number(e.target.value))}
                                    required
                                />
                            </div>

                            <hr />

                            <label className="form-label text-success fw-bold">Total (Start Amount + Profit)</label>
                            <input
                                className="form-control fw-bold fs-4"
                                value={`R$ ${transformToBRL(totalCompoundInterest)}`}
                                disabled
                            />

                            <label className="form-label text-success fw-bold mt-3">Profit Only</label>
                            <input
                                className="form-control fw-bold fs-4"
                                value={`R$ ${transformToBRL(totalProfitOnly)}`}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={container}>
                <div className="row">
                    <div className="col-lg-5">
                        <div className="card mb-3 rounded-3 bg-light">
                            <div className="card-header py-3 d-flex justify-content-center">
                                <h3 className="my-0 fw-bold text-center text-danger">
                                    R$ {transformToBRL(account.total_expenses)}{" "}
                                </h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-striped">
                                    <tbody>
                                        <tr>
                                            <th>
                                                <i className="bi bi-apple"></i> Food
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_food)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_food / account.total_expenses) * 100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-bookmark-star"></i> Subscriptions
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_subscriptions)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_subscriptions /
                                                              account.total_expenses) *
                                                              100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-shop"></i> Shop
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_shop)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_shop / account.total_expenses) * 100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-universal-access"></i> Clothes
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_clothes)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_clothes / account.total_expenses) *
                                                              100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-controller"></i> Entertainment
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_entertainment)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_entertainment /
                                                              account.total_expenses) *
                                                              100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-book"></i> Education
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_education)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_education / account.total_expenses) *
                                                              100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-car-front-fill"></i> Transport
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_transport)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_transport / account.total_expenses) *
                                                              100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-house-door"></i> House
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_house)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_house / account.total_expenses) * 100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-gift"></i> Gifts
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_gifts)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_gifts / account.total_expenses) * 100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-hospital"></i> Health
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_health)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_health / account.total_expenses) * 100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-lightning"></i> Going Out
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_going_out)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_going_out / account.total_expenses) *
                                                              100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-folder2"></i> Work
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_work)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_work / account.total_expenses) * 100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <i className="bi bi-house-dash"></i> Rent
                                            </th>
                                            <td>R$ {transformToBRL(account.total_expenses_rent)}</td>
                                            <td>
                                                {transformToFixedTwo(
                                                    account.total_expenses
                                                        ? (account.total_expenses_rent / account.total_expenses) * 100
                                                        : 0,
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="row g-3">
                            <div className="d-flex justify-content-between mb-3">
                                <div className="card bg-success">
                                    <div className="card-body text-center">
                                        <h5 className="card-title fw-bold text-white fs-3">USD: R$ {dolar}</h5>
                                    </div>
                                </div>

                                <div className="card bg-primary">
                                    <div className="card-body text-center">
                                        <h5 className="card-title fw-bold text-white fs-3">EUR: R$ {euro}</h5>
                                    </div>
                                </div>

                                <div className="card bg-warning">
                                    <div className="card-body text-center">
                                        <h5 className="card-title fw-bold text-black fs-3">BTC: R$ {bitcoin}</h5>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label
                                    htmlFor="inputFile"
                                    className="col-sm-5 col-form-label fw-bold fs-4 text-white mt-3"
                                >
                                    Upload Organizze Excel
                                </label>
                                <div className="col-sm-7">
                                    <input
                                        type="file"
                                        className="form-control form-control-lg mt-3"
                                        accept=".xlsx, .xls"
                                        id="inputFile"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>

                            <form className="mb-3 d-flex justify-content-between" onSubmit={handleSearchByDate}>
                                <div className="col-lg-3">
                                    <select
                                        className="form-select fw-bold fs-5"
                                        value={searchCategory}
                                        onChange={handleSearchCategory}
                                        required
                                    >
                                        <option className="fw-bold text-warning" value="ALL" selected>
                                            ALL
                                        </option>
                                        <option className="text-danger fw-bold" value="FOOD">
                                            FOOD
                                        </option>
                                        <option className="text-danger fw-bold" value="SUBSCRIPTIONS">
                                            SUBSCRIPTION
                                        </option>
                                        <option className="text-danger fw-bold" value="SHOP">
                                            SHOP
                                        </option>
                                        <option className="text-danger fw-bold" value="CLOTHES">
                                            CLOTHES
                                        </option>
                                        <option className="text-danger fw-bold" value="ENTERTAINMENT">
                                            ENTERTAINMENT
                                        </option>
                                        <option className="text-danger fw-bold" value="EDUCATION">
                                            EDUCATION
                                        </option>
                                        <option className="text-danger fw-bold" value="TRANSPORT">
                                            TRANSPORT
                                        </option>
                                        <option className="text-danger fw-bold" value="HOUSE">
                                            HOUSE
                                        </option>
                                        <option className="text-danger fw-bold" value="SERVICES">
                                            SERVICES
                                        </option>
                                        <option className="text-danger fw-bold" value="GIFTS">
                                            GIFTS
                                        </option>
                                        <option className="text-danger fw-bold" value="HEALTH">
                                            HEALTH
                                        </option>
                                        <option className="text-danger fw-bold" value="GOING">
                                            GOING OUT
                                        </option>
                                        <option className="text-danger fw-bold" value="WORK">
                                            WORK
                                        </option>
                                        <option className="text-danger fw-bold" value="RENT">
                                            RENT
                                        </option>
                                    </select>
                                </div>

                                <div className="col-lg-3">
                                    <input
                                        className="form-control fs-5"
                                        type="date"
                                        value={searchStartDate}
                                        onChange={(e) => setSearchStartDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-lg-3">
                                    <input
                                        className="form-control fs-5"
                                        type="date"
                                        value={searchFinalDate}
                                        onChange={(e) => setSearchFinalDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <button className="btn btn-outline-success fw-bold fs-5" type="submit">
                                    <i className="bi bi-search"></i> Search
                                </button>
                            </form>
                        </div>

                        <br />

                        <form className="d-flex w-100">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="search"
                                    className="fs-4 form-control"
                                    placeholder="Search expense description..."
                                    onChange={handleSearchExpenseTransactionDescription}
                                />
                            </div>
                        </form>

                        <ol className="list-group list-group-flush mt-3">
                            {!noTransactionsFound && (
                                <h3 className="mt-4 fw-bold text-white">Transactions: {totalTransactions}</h3>
                            )}

                            {!noTransactionsFound && totalExpendSearch >= 1 && (
                                <h3 className="mt-4 mb-5 fw-bold text-white">
                                    Expend: R$ {transformToBRL(totalExpendSearch)}
                                </h3>
                            )}

                            {!noTransactionsFound && (
                                <div style={{ overflowX: "hidden" }}>
                                    <ReactPaginate
                                        previousLabel="Previous"
                                        nextLabel="Next"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        pageCount={pageCount}
                                        pageRangeDisplayed={TOTAL_EXPENSES_PER_PAGE}
                                        onPageChange={handlePageChange}
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        forcePage={pageOffset}
                                    />
                                </div>
                            )}

                            {noTransactionsFound && (
                                <div className="alert alert-warning mt-3 text-center fw-bold fs-4" role="alert">
                                    No transactions found...
                                </div>
                            )}

                            {!noTransactionsFound && (
                                <Transactions transactions={transactions} setAccount={setAccount} />
                            )}
                        </ol>
                    </div>
                </div>
            </div>

            <br className="mt-5" />
        </>
    );
}
