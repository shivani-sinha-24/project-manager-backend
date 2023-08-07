import ListItem from "../models/ListItemModel.js";
import ProjectCard from "../models/toDoCardModel.js";

export default {
  // get ListItem
  async getListItem(req, res) {
    try {
      let listItem = await ListItem.find();
      return res.status(200).json(listItem);
    } catch (err) {
      return res.status(400).send({ message: "Unable to fetch project card lists datails!" })
    }
  },

  // post ListItem
  async createtListItem(req, res) {
    const request = req.body;
    try {
      const exist = await ListItem.findOne({ name: request.name, list_id: request.list_id });
      if (exist) {
        return res.status(200).send({ message: 'This name already exists!' });
      }

      const listItem = await ListItem.create(request);

      const list = await ProjectCard.findOneAndUpdate(
        { _id: request.list_id },
        { $push: { items: listItem._id } },
        { new: true })

      const lists = await ProjectCard.find({})

      return res.status(200).send({
        status_code: 200,
        lists: lists,
        message: 'List item created successfully.',
      });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },

  // update ListItem
  async updatetListItem(req, res) {
    let request = req.body;
    let id = req.body._id;
    const exist = await ListItem.findById(req.body._id);
    if (!exist) {
      return res.status(404).send({ message: "List Not Found !!" })
    }
    await ListItem.findByIdAndUpdate(id, request, { new: true });
    let listItem = await ListItem.find();
    return res.status(200).json(listItem);
    // return res.status(200).send({ status_code: 200, project: request, message: "List updated successfully." });
  },
  // delete ListItem
  async deleteListItem(req, res) {

  },

}