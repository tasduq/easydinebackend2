const Order = require("../Models/Orders");
const Review = require("../Models/review");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KJeACGTujXHwRwSV9pNlKV0qkDrHpHZj4BoIG78RPBapUJljxxdFAGwNmbTX8jvXScdwjMsommcNZpptG5WeMw100VqpzeYzP"
);

const getOrders = async (req, res) => {
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
  orders = orders.reverse();
  res.json({ orders, success: true });
};

const getUserOrders = async (req, res) => {
  const { id } = req.body;

  console.log(id);
  let orders;
  try {
    orders = await Order.find({ userId: id });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching orders",
    });
    return;
  }
  orders = orders.reverse();
  res.json({ orders, success: true });
};

const updateOrderStatus = async (req, res) => {
  console.log(req.body);
  const { orderStatus, id } = req.body;

  try {
    await Order.updateOne(
      { _id: id },

      {
        $set: {
          orderStatus,
        },
      },
      function (err) {
        console.log(err);
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "Order Status Updated",
          });
          return;
        }
      }
    ).clone();

    console.log("done");
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const submitReview = (req, res) => {
  console.log(req.body);
  const { name, review, star } = req.body;

  const createdReview = new Review({
    name,
    review,
    star,
  });

  try {
    createdReview.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Something Went wrong",
        });
        return;
      } else {
        res.json({
          success: true,

          message: "Review published",
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Something Went wrong in catch",
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    console.log(reviews);
    res.json({ success: true, reviews: reviews });
  } catch (err) {
    console.log(err);
    res.json({ success: false, data: err, message: "Error getting Reviews" });
  }
};

const placeOrderWithUser = async (req, res) => {
  //   console.log(req.body);
  const { token, orderTotal, user, tableNumber, itemsInBucket } = req.body;
  try {
    console.log(orderTotal, "I am paymen data");

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    console.log(customer, "I am customer");
    const payment = await stripe.charges.create(
      {
        customer: customer.id,
        amount: orderTotal * 100,
        currency: "usd",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      let orders;
      try {
        orders = await Order.countDocuments({});
      } catch (err) {
        console.log(err);
        // res.json({
        //   success: false,
        //   data: err,
        //   message: "Error fectching Ads",
        // });
        return;
      }
      console.log(orders);

      const createdOrder = new Order({
        orderNumber: orders + 1,
        orderTable: tableNumber,
        orderStatus: 10,
        orderAmount: orderTotal,
        paymentStatus: true,
        orderItems: itemsInBucket,
        userId: user.id,
        userData: user,
        paymentDetails: token,
      });

      try {
        createdOrder.save((err) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              data: err,
              message: "Something Went wrong",
            });
            return;
          } else {
            console.log({ message: "order created", createdOrder });

            res.json({
              message: "Order Created SuccessFull and Payment SuccessFull",

              orderDetails: createdOrder,
              success: true,
            });
          }
        });
      } catch (err) {
        res.json({
          success: false,
          // data: err,
          message: "Creating Order Failed",
        });
      }

      // res.json({ success: true, message: "Payment SuccessFull" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (err) {
    res.json({ success: false, message: "Someting Went Wrong" });
    console.log(err);
  }
};

const placeOrderWithoutUser = async (req, res) => {
  console.log("In WOTHPUT USER");
  //   console.log(req.body);
  const { token, orderTotal, tableNumber, itemsInBucket } = req.body;
  try {
    console.log(orderTotal, "I am paymen data");

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    console.log(customer, "I am customer");
    const payment = await stripe.charges.create(
      {
        customer: customer.id,
        amount: orderTotal * 100,
        currency: "usd",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      let orders;
      try {
        orders = await Order.countDocuments({});
      } catch (err) {
        console.log(err);
        // res.json({
        //   success: false,
        //   data: err,
        //   message: "Error fectching Ads",
        // });
        return;
      }
      console.log(orders);

      const createdOrder = new Order({
        orderNumber: orders + 1,
        orderTable: tableNumber,
        orderStatus: 10,
        orderAmount: orderTotal,
        paymentStatus: true,
        orderItems: itemsInBucket,

        userData: { email: token.email },
        paymentDetails: token,
      });

      try {
        createdOrder.save((err) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              data: err,
              message: "Something Went wrong",
            });
            return;
          } else {
            console.log({ message: "order created", createdOrder });

            res.json({
              message: "Order Created SuccessFull and Payment SuccessFull",

              orderDetails: createdOrder,
              success: true,
            });
          }
        });
      } catch (err) {
        res.json({
          success: false,
          // data: err,
          message: "Creating Order Failed",
        });
      }

      // res.json({ success: true, message: "Payment SuccessFull" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (err) {
    res.json({ success: false, message: "Someting Went Wrong" });
    console.log(err);
  }
};
module.exports = {
  placeOrderWithUser,
  placeOrderWithoutUser,
  getOrders,
  updateOrderStatus,
  getUserOrders,
  submitReview,
  getReviews,
};
