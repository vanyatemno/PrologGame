import './App.css'
import React, {useEffect, useState} from "react";
import axios from "axios";
import Operator from "./Operator/Operator";
import Digit from "./Digit/Digit";
import Equal from "./Equal/Equal";

function App() {

    // play
    const [riddle, setRiddle] = useState(null);
    const [isRiddleSolved, setRiddleSolved] = useState(true);
    const [diff, setDiff] = useState(3);
    const [isSolved, setIsSolved] = useState(false);
    // solve
    const [solutions, setSolutions] = useState([]);

    // effect to set new riddle
    useEffect(() => {

        if (isRiddleSolved) {
            axios.get(`http://localhost:3001/api/riddle/${diff}`)
                .then(res => {
                    setRiddle(res.data);
                    console.log(res.data)
                });
            setRiddleSolved(false);
        }

    }, [isRiddleSolved]);

    function splitNumbers(inputList) {
        let resultList = [];

        inputList.forEach(number => {
            let numberStr = Math.abs(number).toString();
            let numberList = [];

            if (number < 0) {
                numberList.push("-");
            } else {
                numberList.push("+");
            }

            for (let i = 0; i < numberStr.length; i++) {
                numberList.push(parseInt(numberStr.charAt(i)));
            }

            resultList.push(numberList);
        });

        return resultList;
    }

    // function which checks if string contains only numbers and signs +, - and =
    function containsOnlyNumbersAndSigns(inputString) {
        const regex = /^[0-9+\-=\s]*$/;
        return regex.test(inputString);
    }

    function numbersToEquation(numbers) {
        let res = numbers.map((x, index, arr) => {
            if ((index == 0 && x > 0) || (index == arr.length - 1 && x > 0)) {
                return x;
            } else if (index > 0 && x >= 0) {
                return '+' + x;
            } else {
                return x;
            }
        })
        res.splice(numbers.length - 1, 0, '=');

        return res;
    }

    function parseStringToNumbers(inputString) {
        const regex = /-?\d+/g;
        return inputString.match(regex);
    }

    return (
        <div className='app'>
            <h1>matchstick puzzle</h1>
            <label className="toggle-button">
                <input type="checkbox" onClick={(e) => {
                    if (e.target.checked) {
                        document.getElementsByClassName('switch')[0].style = 'transform: translateX(-100vw);';
                    } else {
                        document.getElementsByClassName('switch')[0].style = '';
                    }
                }}/>
                <span className="knob"></span>
            </label>



            <div className="switch">
                <div className={isSolved ? 'mjav solved' : 'mjav'}>
                    <div>
                        {
                            (() => {
                                if (riddle != null) {

                                    return splitNumbers(riddle.riddle).flat()
                                        .map((elem, index, arr) => {
                                            if (!(index == 0 && elem == '+')) {
                                                if (elem == '+' || elem == '-') {
                                                    if (index >= arr.length - 3) {
                                                        return [
                                                            <Equal></Equal>,
                                                            <Operator
                                                                isPlus={(elem == '+')}
                                                                isSolved={setIsSolved}
                                                                operID={'g' + index}
                                                                answer={(() => {
                                                                    return riddle.answer.map(arr => splitNumbers(arr))
                                                                        .map(x => x.flat())
                                                                        .map(x => x[index])
                                                                })()}
                                                                // key={index}
                                                            />
                                                        ]
                                                    } else {
                                                        return <Operator
                                                            isPlus={(elem == '+')}
                                                            isSolved={setIsSolved}
                                                            operID={'g' + index}
                                                            answer={(() => {
                                                                return riddle.answer.map(arr => splitNumbers(arr))
                                                                    .map(x => x.flat())
                                                                    .map(x => x[index])
                                                            })()}
                                                            // key={index}
                                                        />
                                                    }

                                                } else {
                                                    return <Digit
                                                        // key={index}
                                                        digit={elem}
                                                        isSolved={setIsSolved}
                                                        digitID={'g' + index}
                                                        solutions={(() => {
                                                            return riddle.answer.map(arr => splitNumbers(arr))
                                                                .map(x => x.flat())
                                                                .map(x => x[index])
                                                        })()}
                                                    />
                                                }
                                            }
                                        })
                                }
                            })()












                        }
                    </div>

                    <button onClick={() => {
                        setRiddleSolved(true);
                        setIsSolved(false)
                    }}>new riddle</button>

                    <div id='difficultyChanger'>
                        <span>difficulty: </span>
                        <input type="number" min={3} max={5} defaultValue={3} onChange={(e) => {
                            let val = e.target.value;
                            if (val <= 5 && val >= 3) {
                                setDiff(val);
                            } else {
                                e.target.value = 3;
                            }
                        }}/>
                    </div>

                </div>

                <div className="solve">
                    <div className="inner-solve">
                        <div>
                            <span>Input riddle: </span>
                            <input type="text" defaultValue='1 - 3 - 9 = -5' id='inputRiddle'/>
                            <button onClick={() => {
                                let input = document.getElementById('inputRiddle').value.replaceAll(" ", '');
                                if (containsOnlyNumbersAndSigns(input)) {
                                    const data = parseStringToNumbers(input)
                                    axios.post('http://localhost:3001/api/solve', {
                                        "riddle": data
                                    })
                                        .then(res => {
                                            setSolutions(res.data)
                                            console.log(res.data, 'resdata')
                                        })
                                }
                            }}>Solve</button>
                        </div>

                        <ul>
                            {solutions.length ? solutions.map(x => {return <li>{numbersToEquation(x)}</li>}) : 'No solutions'}
                        </ul>

                    </div>
                </div>
            </div>

        </div>
    )
};

export default App;