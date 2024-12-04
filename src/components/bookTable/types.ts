export interface Book {
    id: number
    title: string
    author: Author
    quantity: number
    genre: string | null
}

export interface Author {
    id: number
    name: string
    surname: string
}