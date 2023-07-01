import ProjectAssign from "../models/projectAssignModal.js";

export default {

    //College Category create
    async createProjectCard(req, res) {
        let request = req.body;
        let exist = await ProjectAssign.findOne({ "name": request.name });
        if (exist) {
            return res.status(200).send({ message: 'This name is already exists!' });
        }
        try {
            let projectAssign = await ProjectAssign.create(request);
            return res.status(200).send({ status_code: 200, projectAssign: projectAssign, message: "Project Assign successfully." });
        } catch (err) {
            return res.status(400).send({ message: "Something Went Wrong!" })
        }
    },


    // Get Colleges Category
    async getProjectAssign(req, res) {
        try {
            let projectAssigns= await ProjectAssign.find();
            return res.status(200).json(projectAssigns);
        } catch (err) {
            return res.status(400).send({ message: "Unable to fetch project assigns cards datails!" })
        }
    },


    // Update College
    async updateProjectAssigns(req, res) {
        try {
            let request = req.body;
            if (!request) {
                return res.status(400).send({ message: "All Input Field Is Required" });
            }
            let _id = req.body.id;
            const project = await ProjectAssign.findById(_id);
            if (!project) {
                return res.status(404).send({ message: "Project Assigns Not Found !!" })
            }
            await ProjectAssign.findByIdAndUpdate(_id, request, { new: true })
            return res.status(200).send({ status_code: 200, project: request, message: "Project Assigns updated successfully." })
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },


    // Delete College:
    async deleteProjectAssigns(req, res) {
        try {
            let id = req.query.id
            const project = await ProjectAssign.findByIdAndRemove(id);
            if (!project) {
                return res.status(404).send({ message: "Project Card not found" })
            }
            return res.status(200).send({ status_code: 200, id: id, message: "Project Card deleted successfully." })
        } catch (err) {
            return res.status(400).send(err)
        }
    }


}