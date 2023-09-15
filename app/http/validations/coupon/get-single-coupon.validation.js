let {param}=require("express-validator");
function getSingleCouponValidation(req, res, next) {
    return [
        param("id")
            .notEmpty()
            .withMessage("id is required")
            .isMongoId().withMessage('provided id must be be valid'),
    ];
}
module.exports=getSingleCouponValidation