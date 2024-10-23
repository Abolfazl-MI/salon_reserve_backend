const { body } = require("express-validator");

function deleteSalonFeaturesValidation() {
  return [
    body("features_id").custom((features_id, ctx) => {
      if (!features_id) throw "features id is required";
      if (!Array.isArray(JSON.parse(features_id)))
        throw "features should be list of id";
      let id_pattern = /^[0-9a-fA-F]{24}$/;
      let features_id_parsed = JSON.parse(features_id);
      let is_valid = features_id_parsed.every((item) => id_pattern.test(item));
      if (!is_valid) {
        throw "invalid features id format";
      }
      return true;
    }),
  ];
}
module.exports={
    deleteSalonFeaturesValidation
}