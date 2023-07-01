import Project from "../models/projectModal.js";

export default {

    //College Category create
    async createProject(req, res) {
        let request = req.body;
        let exist = await Project.findOne({ "name": request.name });
        if (exist) {
            return res.status(200).send({ message: 'This name is already exists!' });
        }
        try {
            request.image = req?.files['image'][0]?.filename;
            let project = await Project.create(request);
            return res.status(200).send({ status_code: 200, project: project, message: "Project created successfully." });
        } catch (err) {
            return res.status(400).send({ message: "Something Went Wrong!" })
        }
    },


    // Get Colleges Category
    async getProject(req, res) {
        try {
            let projects = await Project.find();
            return res.status(200).json(projects);
        } catch (err) {
            console.log(err, "error");
            return res.status(400).send({ message: "Unable to fetch projects datails!" })
        }
    },


    // Update College
    async updateProject(req, res) {
        try {
            let request = req.body;
            if (!request) {
                return res.status(400).send({ message: "All Input Field Is Required" });
            }
            let _id = req.body.id;
            const project = await Project.findById(_id);
            if (!project) {
                return res.status(404).send({ message: "Project Not Found !!" })
            }
            let image = req.files && req?.files['image'] ? req?.files['image'][0] : null;
            request.image = req?.files['image'][0]?.filename;
            await Project.findByIdAndUpdate(_id, request, { new: true })
            return res.status(200).send({ status_code: 200, project: request, message: "Project updated successfully." })
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },


    // Delete College:
    async deleteProject(req, res) {
        try {
            let id = req.query.id
            const project = await Project.findByIdAndRemove(id)
            if (!project) {
                return res.status(404).send({ message: "Project not found" })
            }
            return res.status(200).send({ status_code: 200, id: id, message: "Project deleted successfully." })
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
    }


}