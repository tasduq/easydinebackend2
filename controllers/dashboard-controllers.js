const User = require("../Models/User");
const Table = require("../Models/Table");
const Menu = require("../Models/Menu");
const Order = require("../Models/Orders");

const countOrders = async (req, res) => {
  console.log("hello g");
  let orders;
  try {
    orders = await Order.countDocuments({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching orders",
    });
    return;
  }
  console.log(orders);
  res.json({ orders: orders });
};

const countUsers = async (req, res) => {
  console.log("hello g");
  let users;
  try {
    users = await User.countDocuments({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching users",
    });
    return;
  }
  console.log(users);
  res.json({ users: users });
};

const todayOrders = async (req, res) => {
  console.log("hello g");
  let orders;
  try {
    orders = await Order.find({ orderDate: Date.now });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching orders",
    });
    return;
  }
  console.log(orders);
  res.json({ orders: orders });
};

const getTables = async (req, res) => {
  let tables;
  try {
    tables = await Table.find({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching tables",
    });
    return;
  }
  let free = tables.filter((table) => {
    return table.tableStatus === "free" || table.tableStatus === "Free";
  });

  let occupied = tables.length - free;
  res.json({ tables, success: true, free: free.length, occupied });
};

const getOrdersTotal = async (req, res) => {
  let orders;
  try {
    orders = await Order.find({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching orders",
    });
    return;
  }
  let ordersTotal = 0;
  orders.map((order) => {
    ordersTotal = ordersTotal + order.orderAmount;
  });
  res.json({ ordersTotal, success: true });
};

module.exports = {
  countOrders,
  countUsers,
  todayOrders,
  getTables,
  getOrdersTotal,
};
