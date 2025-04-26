export type Product = {
    _id: string,
    title: string,
    stock: number,
    description: string,
    price: number
}


export type ProductCreate = Omit<Product, "_id">