const db = require('../../data/db-config');

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  db('schemes')
    .where('scheme_id', req.params.scheme_id)
    .first()
    .then(scheme => {
      if(scheme == null){
        res.status(404).json({ message: `scheme with scheme_id ${req.params.scheme_id} not found` })
        return;
      } else {
        next();
      }
    })
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  if(typeof req.body.scheme_name !== 'string' || req.body.scheme_name.trim() == '' || req.body.scheme_name == null){
    res.status(400).json({ message: "invalid scheme_name" })
    return;
  } else {
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  if(req.body.instructions == null || typeof req.body.instructions !== 'string' || req.body.instructions.trim() == '' || req.body.step_number == null || typeof req.body.step_number !== 'number' || req.body.step_number < 1){
    res.status(400).json({ message: "invalid step" })
    return;
  } else {
    next();
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
