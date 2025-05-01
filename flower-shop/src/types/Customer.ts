export type Customer = {
    _id: number
    first_name: string;
    last_name: string;
    email: string;
    street_address: string;
    zip_code: string;
    city: string;
}

export type CustomerCreate = Omit<Customer, "_id" | "created_at">

export type CustomerPublic = Omit<CustomerCreate, "password">;