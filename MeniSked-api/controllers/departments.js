const getDepts = (req, res, db) => {
  db.select("*")
    .from("departments")
    .then((depts) => {
      res.json(depts);
    })
    .catch((err) => res.status(400).json(err + "unable to get departments"));
};

module.exports = {
  getDepts,
};
