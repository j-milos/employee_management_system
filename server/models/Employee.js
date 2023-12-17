const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  position: String,
  birth: Date,
  userId: String,
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema);

module.exports = EmployeeModel;
