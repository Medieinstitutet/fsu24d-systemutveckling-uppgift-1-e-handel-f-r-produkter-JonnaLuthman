import { createBrowserRouter } from "react-router";
import { Homepage } from "./pages/Homepage";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Admin } from "./pages/Admin/Admin";
import { Checkout } from "./pages/Checkout/Checkout";
import { OrderConfirmation } from "./pages/Checkout/OrderConfirmation";
import { Products } from "./pages/Products";
import { AdminOrders } from "./pages/Admin/AdminOrders";
import { CheckoutPayment } from "./pages/Checkout/CheckoutPayment";
import { ContactUs } from "./pages/ContactUs";
import AdminProducts from "./pages/Admin/AdminProducts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/admin/orders",
        element: <AdminOrders />,
      },
      {
        path: "/admin/products",
        element: <AdminProducts />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/order-confirmation",
        element: <OrderConfirmation />,
      },
    ],
  },
]);
