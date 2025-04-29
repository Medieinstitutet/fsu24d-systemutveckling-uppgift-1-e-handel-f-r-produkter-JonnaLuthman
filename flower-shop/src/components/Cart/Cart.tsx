import { Link } from "react-router";

export const Cart = () => {

  function handleChangeQuantity(product: any, arg1: number): void {
    throw new Error("Function not implemented.");
  }

  const totalSum = 0

  const cart = []

  return (
    <div>
      {totalSum === 0 ? (
        <div>
          <p>Your bag is empty</p>
          <Link to={"/products"}>
            <button>Find our products here</button>
          </Link>
        </div>
      ) : (
        <div>
          <h2>Shopping Cart</h2>
          <div>
            {cart.map((cartItem: CartItem) => (
              <ul key={cartItem.product.id}>
                <li>
                  <div>
                    <div>
                      <p>{cartItem.product.name}</p>
                    </div>

                    <div>
                      <p>{cartItem.product.price} sek</p>
                      <button
                        onClick={() =>
                          cartItem.product.id !== null &&
                          handleChangeQuantity(cartItem.product, -1)
                        }
                      >
                        -
                      </button>
                      <p>{cartItem.quantity}</p>
                      <button
                        onClick={() =>
                          cartItem.product.id !== null &&
                          handleChangeQuantity(cartItem.product, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleRemoveFromCart(cartItem.product)}
                      type="button"
                    ></button>
                  </div>
                </li>
              </ul>
            ))}

            <button onClick={handleResetCart}>Empty cart</button>

            <div>
              <p>Total</p>
              <p>
                <span>sek</span> {totalSum}
              </p>
            </div>

            <div>
              <button type="button">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
