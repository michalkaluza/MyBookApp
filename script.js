// Book class: represents a book

class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

// UI class: handle UI tasks

class UI {
    static displayBooks() {

        // array with books in localStorage
        const storedBooks = []

        const books = Store.getBooks()

        books.forEach((book) => {
            UI.addBookToList(book)
        })
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list")
        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`
        list.appendChild(row)
        
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
        
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
            UI.showAlert("Book removed!", "info")
        }
    }

    static showAlert(message, className) {
        const alert = document.createElement("div")
        alert.className = `alert alert-${className} col-md-6 mx-auto`
        alert.textContent = message
        const container = document.querySelector(".container")
        const form = document.querySelector("#book-form")
        if (!(container.contains(document.querySelector(`.alert-${className}`)))) {
            container.insertBefore(alert, form)
        }
        setTimeout(() => alert.remove(), 3000)
    }
}

// Store class: handles storage

class Store {
    static getBooks() {
        let books
        if (localStorage.getItem("books") === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        // console.log(books)
        return books

    }

    static addBook(book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
        
    }

    static removeBook(isbn){
        const books = Store.getBooks()
        books.forEach((book, index)=>{
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem("books", JSON.stringify(books))
    }

}


// Event: display books

document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: add a book

document.querySelector('#book-form').addEventListener('submit', (e) => {
    // get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    // Validation
    if (title != "" && author != "" && isbn != "") {
        // create new book
        const book = new Book(title, author, isbn)

        UI.showAlert("Book added!", "success")
        UI.addBookToList(book)
        Store.addBook(book)
        UI.clearFields()
        
    } else {
        UI.showAlert("Please, fill in all fields in the form", "danger")
    }

})

// Event: remove a book

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)
    
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})

document.qs