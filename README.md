<div align="center">
 <h1 align="center"><a href="https://expenses.alexgalhardo.com/" target="_blank">expenses.alexgalhardo.com</a></h1>
</div>

## Introduction

* A simple expenses tracker build with ReactJS, uploading Excel files from [https://www.organizze.com.br/](https://www.organizze.com.br/) to my expenses statistics.

## Technologies

* [Git](https://git-scm.com/)
* [Vite v5](https://vitejs.dev/)
* [Boostrap v5](https://getbootstrap.com/)
* [ReactJS v18 + TypeScript](https://react.dev/)
* [NodeJS v20](https://nodejs.org/en)
* [VSCode](https://code.visualstudio.com/)
* Deploy: <https://vercel.com/>
* Pagination, Text Search, API Request, Excel Import, Filter by Date, Compound Interest

## Setup

* Clone this repository

<!---->

```
git clone https://github.com/AlexGalhardo/expenses.alexgalhardo.com
```

* Enter repository

<!---->

```
cd expenses.alexgalhardo.com/
```

* Install dependencies

<!---->

```
npm install
```

* Setup enviroment variables

<!---->

```
cp .env.example .env
```

* Start local server

<!---->

```
npm run dev
```

* Go to: <http://localhost:5173/>

## Creating Excel and Uploading
- Run command:
```
bun create:excel
```
- Upload **expenses-excel.xls** created in root path

## Build for deploy

* Create build

<!---->

```
npm run build
```

* Preview production build

<!---->

```
npm run preview
```

* Open production build local server (build + preview)

<!---->

```
npm run start
```

* Go to: <http://localhost:4173/>

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
