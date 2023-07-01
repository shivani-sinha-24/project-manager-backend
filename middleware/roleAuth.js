
export default {

    async roleSuperAdmin(req, res, next) {
        if (req.user.role == "superadmin") {
        next();
        } else {
        return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleAdmin(req, res, next) {
        if (req.user.role == "admin") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleEditor(req, res, next) {
        if (req.user.role == "editor") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleCaller(req, res, next) {
        if (req.user.role == "caller") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleCyberPartner(req, res, next) {
        if (req.user.role == "cyberpartner") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleEditorSadmin(req, res, next) {
        if (req.user.role == "superadmin"|| req.user.role == "editor") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleAdminSadmin(req, res, next) {
        if (req.user.role == "superadmin"|| req.user.role == "admin") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleCallerSadmin(req, res, next) {
        if (req.user.role == "superadmin"|| req.user.role == "caller") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },

    async roleCyberSadmin(req, res, next) {
        if (req.user.role == "superadmin"|| req.user.role == "cyberpartner") {
        next();
        } else {
            return res.status(401).send({message:"unauthorized user"});
        }
    },



};
