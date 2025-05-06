import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../../hooks/useCart.ts";
import { CartItemWithDetails } from "../../types/CartItem.ts";
import { getFromLocalStorage } from "../../utils/localStorage.ts";
import { removeCartItem } from "../../services/cartService.js";
import { calculateCartTotal } from "../../utils/calculateCartTotal.ts";
import { Cart } from "../../types/Cart.ts";
import "../../styles/cartSummary.css";

interface Props {
  onCartReady: (items: CartItemWithDetails[]) => void;
}

export const CartSummary = ({ onCartReady }: Props) => {
  const { handleFetchCart, handleUpdateCartItem } = useCart();
  const [cart, setCart] = useState<CartItemWithDetails[] | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [totalSum, setTotalSum] = useState<number>(0);

  useEffect(() => {
    const id = getFromLocalStorage("cartId");
    if (id) setCartId(id);
  }, []);

  useEffect(() => {
    if (!cartId) return;
    const getCart = async () => {
      const data: Cart = await handleFetchCart(cartId);
      const cartItems: CartItemWithDetails[] = data.cartItems;
      console.log("cartItems", cartItems);
      setCart(cartItems);
    };
    getCart();
  }, [cartId]);

  useEffect(() => {
    if (cart) {
      onCartReady(cart);
      setTotalSum(calculateCartTotal(cart));
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
          item.product._id === productId
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
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ) || null
    );
  };

  const handleRemoveFromCart = async (productId: string) => {
    if (!cartId) return;
    const data = await removeCartItem(cartId, productId);
    console.log("handleRemoveData", data);
    setCart(data.cartItems);
  };

  // TODO - ADD reset cart
  // const handleResetCart = async () => {}

  return (
    <div className="cart-summary">
      {cart?.length === 0 ? (
        <div className="empty-cart">
          <p>Your bag is empty</p>
          <Link to={"/products"}>
            <button className="btn">Find our products here</button>
          </Link>
        </div>
      ) : (
        <div>
          <h2>Shopping Cart</h2>
          <div>
            {cart?.map((cartItem: CartItemWithDetails) => (
              <ul key={cartItem.product._id} className="cart-item-list">
                <li className="cart-item">
                  <div className="cart-item-content">
                    <div>
                      <p className="item-title">{cartItem.product.title}</p>
                    </div>

                    <div className="item-controls">
                      <p>{cartItem.price} sek</p>
                      <button
                        onClick={() =>
                          decreaseProductQuantity(
                            cartItem.product._id,
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
                            cartItem.product._id,
                            cartItem.quantity
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="remove-button">
                    <button
                      onClick={() => handleRemoveFromCart(cartItem.product._id)}
                      type="button"
                    >
                      Remove from cart
                    </button>
                  </div>
                </li>
              </ul>
            ))}

            <div className="cart-total">
              <p>Total</p>
              <p>
                <strong>{totalSum} sek</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
