const {Group, User } = require('../models');

exports.createGroupWithUsers = async (req, res) => {
    const { name, members } = req.body;
    console.log("memebers ", members);
    try {
        const group = await Group.create({ name });
        const groupMembers = await User.findAll({ where: {id: members}});
        console.log("group Members", groupMembers);
        await group.addUsers(groupMembers);
        res.json(group);
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: 'Server error'});
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{
                model: User,
                through: { attributes: [] },
                where: { id: req.user.id },
                attributes: ['name']
            }]
        });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ msg: 'Server error'});
    }
};

exports.addUserToGroup = async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.body.userId
    try {
        const group = await Group.findOne({where: { id: groupId }});
        if (!group)
            return res.status(400).json({ msg: 'Group Not Found' });
        const user = await User.findOne({where: { id: userId }});
        if (!user)
            return res.status(400).json({ msg: 'User Not Found' });
        await group.addUsers(user);
        return res.status(200).json({ msg: 'User Added Sucessfully '+ userId });
    } catch (err) {
        res.status(500).json({ msg: 'Server error'});
    }  
}