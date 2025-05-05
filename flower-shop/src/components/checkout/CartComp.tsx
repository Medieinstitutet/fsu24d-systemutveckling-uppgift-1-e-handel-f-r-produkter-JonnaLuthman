import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../../hooks/useCart.js";
import { CartItem } from "../../types/CartItem.js";
import { getFromLocalStorage } from "../../utils/localStorage.js";
import { removeCartItem } from "../../services/cartService.js";
import { Paypal } from "./Paypal.js";
import { calculateCartTotal } from "../../utils/calculateCartTotal.js";

export const CartComp = () => {
  const { handleFetchCart, handleUpdateCartItem } = useCart();
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<boolean>(false);
  const [totalSum, setTotalSum] = useState<number>(0);

  useEffect(() => {
    const id = getFromLocalStorage("cartId");
    if (id) setCartId(id);
  }, []);

  useEffect(() => {
    if (!cartId) return;
    const getCart = async () => {
      const data = await handleFetchCart(cartId);
      setCart(data.cartItems);
    };
    getCart();
  }, [cartId]);

  useEffect(() => {
    if (cart) {
      setTotalSum(calculateCartTotal(cart))
    }
  }, [cart]);

  const increaseProductQuantity = async (
    productId: string,
    currentQuantity: number
  ) => {
    if (!cartId) return;

    await handleUpdateCartItem(cartId, {
      productId,
      quantity: currentQuantity + 1,
    });

    setCart(
      (prev) =>
        prev?.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ) || null
    );
  };

  const decreaseProductQuantity = async (
    productId: string,
    currentQuantity: number
  ) => {
    if (!cartId) return;

    if (currentQuantity <= 1) {
      return;
    }

    await handleUpdateCartItem(cartId, {
      productId,
      quantity: currentQuantity - 1,
    });

    setCart(
      (prev) =>
        prev?.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ) || null
    );
  };

  const handleRemoveFromCart = async (productId: string) => {
    if (!cartId) return;
    const data = await removeCartItem(cartId, productId);
    setCart(data.cartItems);
  };

  // ADD reset cart
  // const handleResetCart = async () => {}

  return (
    <div>
      {cart?.length === 0 ? (
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
            {cart?.map((cartItem: CartItem) => (
              <ul key={cartItem._id}>
                <li>
                  <div>
                    <div>
                      <p>{cartItem.productId}</p>
                    </div>

                    <div>
                      <p>{cartItem.price} sek</p>
                      <button
                        onClick={() =>
                          decreaseProductQuantity(
                            cartItem.productId,
                            cartItem.quantity
                          )
                        }
                      >
                        -
                      </button>
                      <p>{cartItem.quantity}</p>
                      <button
                        onClick={() =>
                          increaseProductQuantity(
                            cartItem.productId,
                            cartItem.quantity
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleRemoveFromCart(cartItem.productId)}
                      type="button"
                    >
                      Remove from cart
                    </button>
                  </div>
                </li>
              </ul>
            ))}
            {/* <button onClick={handleResetCart}>Empty cart</button> */}
            <div>
              <p>Total</p>
              <p>
                <span>sek</span> {totalSum}
              </p>
            </div>

            <div>
              {checkout ? (
                <Paypal cart={cart} />
              ) : (
                <button
                  onClick={() => {
                    setCheckout(true);
                  }}
                >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
