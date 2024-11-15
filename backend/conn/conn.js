const mongoose = require("mongoose");

const conn = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log("connected to Database");
    } catch (error) {
        console.log(error);
    }
};
conn();
