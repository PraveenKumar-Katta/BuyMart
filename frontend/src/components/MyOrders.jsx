import React from "react";
import { useSelector } from "react-redux";

const MyOrders = () => {
  let user = JSON.parse(localStorage.getItem("userInfo"));
  let { orders } = useSelector((state) => state.orders);
  const myOrderProducts = orders.flatMap((o) =>
    o.products
      .filter((p) => p.vendor === user.id)
      .map((p) => ({
        ...p,
        customer: o.user,
      }))
  );
  console.log(myOrderProducts);

  return (
    <div>
      <h1>Orders</h1>
      <div></div>
    </div>
  );
};

export default MyOrders;
