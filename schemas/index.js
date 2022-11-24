const mongoose = require('mongoose');

const connect = () => {
    mongoose
        .connect("mongodb+srv://annisana12:sparta@cluster0.t0kg3um.mongodb.net/postW6DB?retryWrites=true&w=majority")
        .catch(err => console.log(err))
};

mongoose.connection.on("error", err => {
    console.error("MongoDB connection error", err);
});

module.exports = connect;