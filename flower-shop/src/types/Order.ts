import { OrderItem } from "./OrderItem"

export type Order = {
    _id: string,
    customer_id: string,
    total_price: number,
    payment_status: string,
    order_status: string,
    created_at: string
    order_items: OrderItem[]
}

export type OrderCreate = Omit<Order, "_id">