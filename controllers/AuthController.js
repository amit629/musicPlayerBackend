const express = require('express');
const { UserModel } = require('../mongoose/models/User');
const router = express.Router();

router.post('/api/auth/privlage', async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.json({
                isError:false,
                isAdmin: false
            });
        }

        const user = await UserModel.findOne({ Email: data.email });
        let ret = false;
        if (user && (user.Role === "admin" || user.Role === "artist")) {
            ret = true;
        }

        console.log(ret);
        return res.json({
            isError:false,
            isAdmin: ret
        });
    } catch (error) {
        console.error(error);
        return res.json({ isError: true,message:'Internal Server Error' });
    }
});

module.exports = {router};