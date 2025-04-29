export class BaseOrder {
  constructor(items = []) {
    this.items = items;
  }

  addItem(productId, price, quantity = 1) {
    const existingItem = this.items.find((item) =>
      item.productId.equals(productId)
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ productId, price, quantity });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => !item.productId.equals(productId));
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.productId.equals(productId));
    if (item) {
      item.quantity = quantity;
    }
  }

  calculateTotalPrice() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
