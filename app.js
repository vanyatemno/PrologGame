const swipl = require('swipl');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// connect the source file
swipl.call('consult(["matchstick.pl"])');

const app = express();
app.use(bodyParser.json());
app.use(cors());

function linkedListToList(linkedList) {  
    let list = [];
    while (linkedList.tail != undefined) {
        if (typeof linkedList.head === 'number') {
            list.push(linkedList.head)
        } else {
            list.push(-linkedList.head.args[0])
        }
        
        linkedList = linkedList.tail;
    }

    return list;
}

function getAllSolutions(riddle) {
    const query = new swipl.Query(`solve([${riddle}], Solution)`);
    let ret;
    let res = [];
    while (ret = query.next()) {
        res.push(linkedListToList(ret.Solution))
    };
    query.close();
    return res;
}

app.get('/api/riddle/:length', (req, res) => {
    const riddle = linkedListToList(swipl.call(`gen_riddle(${req.params.length}, Riddle).`).Riddle);
    const answer = getAllSolutions(riddle);
    const response = {
        riddle: riddle,
        answer: answer
    };

    res.status(200).json(response);
})

app.post('/api/solve', (req,res) => {
    const {riddle} = req.body;
    const solutions = getAllSolutions(riddle);

    res.status(200).json(solutions);
})


app.listen(3001, () => {
    console.log("app is running on port 3001")
})



