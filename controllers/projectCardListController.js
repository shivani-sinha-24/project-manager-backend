import ProjectCardList from "../models/toDoCardListModal.js";

export default {

    //College Category create
    async createProjectCardList(req, res) {
        let request = req.body;
        let exist = await ProjectCardList.findOne({ "name": request.name });
        if (exist) {
            return res.status(200).send({ message: 'This name is already exists!' });
        }
        try {
            let projectCardList = await ProjectCardList.create(request);
            return res.status(200).send({ status_code: 200, projectCardList: projectCardList, message: "Project card list created successfully." });
        } catch (err) {
            return res.status(400).send({ message: "Something Went Wrong!" })
        }
    },


    // Get Colleges Category
    async getProjectCardList(req, res) {
        try {
            let projectCardsList= await ProjectCardList.find();
            return res.status(200).json(projectCardsList);
        } catch (err) {
            return res.status(400).send({ message: "Unable to fetch project card lists datails!" })
        }
    },


    // Update College
    async updateProjectCardList(req, res) {
        try {
            let request = req.body;
            if (!request) {
                return res.status(400).send({ message: "All Input Field Is Required" });
            }
            let _id = req.body.id;
            const project = await ProjectCardList.findById(_id);
            if (!project) {
                return res.status(404).send({ message: "Project Cards List Not Found !!" })
            }
            await ProjectCard.findByIdAndUpdate(_id, request, { new: true })
            return res.status(200).send({ status_code: 200, project: request, message: "Project card list updated successfully." })
        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }

    },


    // Delete College:
    async deleteProjectCardList(req, res) {
        try {
            let id = req.query.id
            const project = await ProjectCardList.findByIdAndRemove(id)
            if (!project) {
                return res.status(404).send({ message: "Project card list not found" })
            }
            return res.status(200).send({ status_code: 200, id: id, message: "Project Card list deleted successfully." })
        } catch (err) {
            return res.status(400).send(err)
        }
    }


}