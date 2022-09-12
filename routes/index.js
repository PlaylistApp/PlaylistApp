const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/playlists", (req, res, next) => {
  res.render("playlists");
});

module.exports = router;