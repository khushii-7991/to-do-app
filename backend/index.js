const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const User = require('./models/User');
const app = express();

const PORT = 3000;
app.use(express.json());

mongoose.connect(`mongodb://localhost:27017/testdb`)
    .then(() => {
        console.log(`mongoose connected`);

    })

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const response = await User.create({
        username: username,
        password: password,
        todos: [],
    })
    res.json(response)
})
app.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({
        username: username,
    })
    if (user) {
        if (user.password == password) {
            const token = jwt.sign({
                username
            },
                "SECRET_key"
            )
            res.cookie("token", token)
            console.log('successsss');
            res.json({
                msg: "ho gyaaaaa",
                token: token
            })
        }
        else {
            console.log('invalid password');
            res.json({
                msg: "invalid password"
            })
        }
    } else {
        console.log('invalid username');
        res.json({
            msg: "invalid username"
        })
    }
})
app.post('/create-todo', async (req, res) => {
    const username = req.body.username;
    const todo = req.body.todo;
    if(!todo){
        res.json({
            msg:"likho toh phle kachu"
        })
        return;
    }
    const user = await User.findOne({ username: username })

    if (user) {
        const response =await User.updateOne(
            { username: username },
            { $push: { todos: todo } }
        )
        res.json({
            msg: "i want to love youu everydayyy"
        })
    } else {
        res.json({
            msg: "username is not found"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})