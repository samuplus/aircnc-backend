// index, show, store, update, destroy
    // sessions listing
    // list only one session
    // store creates a session
    // update modifies a session
    // destroy deletes a session

const User = require('../models/User');


module.exports = {
    async store(req, res) {
        const { email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email });
        }
        
        return res.json(user);
    }
};