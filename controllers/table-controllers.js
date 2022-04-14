const Table = require("../Models/Table");

const addTable = async (req, res) => {
  console.log(req.body);
  const { tableNumber, tableStatus } = req.body;

  const createdTable = new Table({
    tableNumber: tableNumber,
    tableStatus: tableStatus,
  });

  try {
    createdTable.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Something Went wrong",
        });
        return;
      } else {
        console.log({ message: "table created", createdTable });

        res.json({
          message: "table Created SuccessFull ",

          tableDetails: createdTable,
          success: true,
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      // data: err,
      message: "Creating table Failed",
    });
  }
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
  res.json({ tables, success: true });
};

const deleteTable = async (req, res, next) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    await Table.deleteOne({ _id: id });
    res.json({ success: true, message: "Table deleted successfully" });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Deleting Table failed",
    });
    return;
  }
};

const editTable = async (req, res) => {
  console.log(req.body);

  const { tableNumber, tableStatus, id } = req.body;

  try {
    await Table.updateOne(
      { _id: id },

      {
        $set: {
          tableNumber: tableNumber,
          tableStatus: tableStatus,
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
            message: "Table Updated",
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

module.exports = {
  addTable,
  getTables,
  deleteTable,
  editTable,
};
