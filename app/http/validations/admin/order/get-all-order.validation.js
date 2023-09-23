const { query } = require("express-validator");

function adminGetAllOrderValidation() {
  return [
    query("status")
      .optional()
      .exists()
      .custom((status, ctx) => {
        let whiteStatuses = ["pending", "canceled", "completed"];
        if (!whiteStatuses.includes(status))
          throw "provided status is not exists";
        return true;
      }),
  ];
}

module.exports = {
  adminGetAllOrderValidation,
};
