import ProjectCard from "../models/toDoCardModel.js";

export default {

    //College Category create
    async createProjectCard(req, res) {
        let request = req.body;
        let exist = await ProjectCard.findOne({ "name": request.name });
        if (exist) {
            return res.status(200).send({ message: 'This name is already exists!' });
        }
        try {
            let projectCard = await ProjectCard.create(request);
            let projects = await ProjectCard.find({})
            return res.status(200).send({ status_code: 200, projectCard: projects, message: "Project Card created successfully." });
        } catch (err) {
            return res.status(400).send({ message: "Something Went Wrong!" })
        }
    },


    // Get Colleges Category
    async getProjectCard(req, res) {
        try {
            let projectCards= await ProjectCard.find();
            return res.status(200).json(projectCards);
        } catch (err) {
            return res.status(400).send({ message: "Unable to fetch project cards datails!" })
        }
    },


    // Update College
    async updateProjectCards(req, res) {
        try {
            let request = req.body;
            if (!request) {
                return res.status(400).send({ message: "All Input Field Is Required" });
            }
            let _id = req.body.id;
            const project = await ProjectCard.findById(_id);
            if (!project) {
                return res.status(404).send({ message: "Project Cards Not Found !!" })
            }
            await ProjectCard.findByIdAndUpdate(_id, request, { new: true })
            return res.status(200).send({ status_code: 200, project: request, message: "Project Card updated successfully." })
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },


    // Delete College:
    async deleteProjectCards(req, res) {
        try {
            let id = req.query.id
            const project = await ProjectCard.findByIdAndRemove(id)
            if (!project) {
                return res.status(404).send({ message: "Project Card not found" })
            }
            return res.status(200).send({ status_code: 200, id: id, message: "Project Card deleted successfully." })
        } catch (err) {
            return res.status(400).send(err)
        }
    }


}