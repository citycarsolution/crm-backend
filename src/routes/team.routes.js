const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/team.controller");

router.get("/", auth, ctrl.getTeam);
router.post("/", auth, ctrl.addMember);
router.put("/:id", auth, ctrl.updateMember);
router.patch("/:id/status", auth, ctrl.changeStatus);
router.post("/:id/force-logout", auth, ctrl.forceLogout);
router.delete("/:id", auth, ctrl.deleteMember);

// employee self profile
router.get("/me/profile", auth, ctrl.me);

module.exports = router;
