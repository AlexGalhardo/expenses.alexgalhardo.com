export default function Navbar() {
    return (
        <>
            <div className="fixed-top bg-dark mb-5 shadow-sm">
                <nav className="container col-lg-10 navbar navbar-expand-lg fixed p-2">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            <span className="fs-3 fw-bold text-white">expenses.alexgalhardo.com</span>
                        </a>

                        <button
                            className="navbar-toggler bg-light"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

                            <div className="me-3">
                                <button
                                    className="button fw-bold fs-5 btn btn-outline-secondary bg-secondary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalCompoundInterest"
                                    type="submit"
                                >
                                    Calculate Compound Interest
                                </button>
                            </div>

                            <div className="pull-right">
                                <button
                                    className="button fw-bold fs-5 btn btn-outline-danger bg-danger"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalExpense"
                                    type="submit"
                                >
                                    + EXPENSE
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
