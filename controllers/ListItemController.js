import ListItem from "../models/ListItemModel.js";
import ProjectCard from "../models/toDoCardModel.js";

export default {
    // get ListItem
    async getListItem (req,res){
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
          const exist = await ListItem.findOne({ name: request.name,list_id:request.list_id });
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
    async updatetListItem (req,res){

        console.log(req.body);
        const request = req?.body
        const {name,_id,projects,due_date,status,description,priority,assignee,tasks_date,comments,sub_task} = req.body;
        if(name){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{name},{ new: true })
        }
        if(projects){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{projects},{ new: true })
        }    // needed to be corrected as it's an array
        if(due_date){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{due_date},{ new: true })
        }
        if(tasks_date){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{tasks_date},{ new: true })
        }
        if(status){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{status},{ new: true })
        }
        if(description){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{description},{ new: true })
        }
        if(assignee){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{assignee},{ new: true })
        }
        if(priority){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{priority},{ new: true })
        }
        if(sub_task){
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{ $push: { sub_task: sub_task[0] } },{ new: true })
        }
        if(comments){
          // console.log('comments :',comments);
          const listItem = await ListItem.findOneAndUpdate({_id:_id},{comments},{ new: true })
        }

        const listItems = await ListItem.find({})
        const lists = await ProjectCard.find({})
        res.status(200).send({listItems:listItems,lists:lists})
        
    },

    // delete ListItem
    async deleteListItem (req,res){
        
    },

}