const express = require("express");

const router = express.Router();

const fs = require("fs");
const path = require("path");


router.get("/", async (req, res) => {

    const filePath = path.join(
        __dirname,
        "../data/staff.json"
    );


    if (!fs.existsSync(filePath)) {

        return res.json([]);

    }


    const staff = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );


    const results = staff.map(member => {

        const user =
            req.client.users.cache.get(member.userId);


        return {

            id: member.userId,

            name:
                user
                ? user.username
                : "Unknown",

            avatar:
                user
                ? user.displayAvatarURL({
                    extension: "png",
                    size: 256
                })
                : "",

            role: member.role

        };

    });


    res.json(results);

});


module.exports = router;