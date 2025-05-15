const { Router } = require("express");
const userControllers = require("../controllers/userControllers");
const userSchema = require("../validation/userSchema");
const router = Router();

router.post('/register', userSchema.createUserSchema, userControllers.createNewUser);
router.post('/login', userSchema.loginUserSchema, userControllers.loginUser);
module.exports = router;