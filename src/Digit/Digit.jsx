import './Digit.css';
import {useEffect, useState} from "react";

function Digit(props) {

    const [bars, setBars] = useState([]);
    const [displayedDigit, setDisplayedDigit] = useState(props.digit);

    function searchForArray(haystack, needle){
        var i, j, current;
        for(i = 0; i < haystack.length; ++i){
            if(needle.length === haystack[i].length){
                current = haystack[i];
                for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
                if(j === needle.length)
                    return i;
            }
        }
        return -1;
    }

    const displayArrs = [
        [1, 1, 1, 0, 1, 1, 1],  // 0
        [0, 0, 1, 0, 0, 1, 0],  // 1
        [1, 0, 1, 1, 1, 0, 1],  // 2
        [1, 0, 1, 1, 0, 1, 1],  // 3
        [0, 1, 1, 1, 0, 1, 0],  // 4
        [1, 1, 0, 1, 0, 1, 1],  // 5
        [1, 1, 0, 1, 1, 1, 1],  // 6
        [1, 0, 1, 0, 0, 1, 0],  // 7
        [1, 1, 1, 1, 1, 1, 1],  // 8
        [1, 1, 1, 1, 0, 1, 1]   // 9
    ];


    // sets the event listeners
    useEffect(() => {
        if (bars.length > 0) {
            let allBars = document.querySelectorAll(`#${props.digitID} .bar`);
            allBars.forEach(x => x.classList.value = 'bar');

            for (let i = 0; i < 7; i++) {
                if (bars[i] == 0) {
                    allBars[i].addEventListener('click', (e) => {
                        let copy = [...bars];
                        copy[i] = 1;

                        if (searchForArray(displayArrs, copy) != -1) {
                            if (props.solutions.includes(searchForArray(displayArrs, copy))) {
                                props.isSolved(true)
                                allBars[i].classList.value = 'bar checked'
                            } else {
                                allBars[i].classList.value = 'bar wrong-bar';
                                setTimeout(() => {
                                    allBars[i].classList.value = 'bar';
                                }, 1000)
                            }
                        } else {
                            allBars[i].classList.value = 'bar wrong-bar';
                            setTimeout(() => {
                                allBars[i].classList.value = 'bar';
                            }, 1000)
                        }
                    })
                }
            }
        }


    }, [bars]);

    // effect to set the bars value
    useEffect(() => {
        setBars(displayArrs[props.digit]);
    }, [displayedDigit]);

    useEffect(() => {
        setDisplayedDigit(props.digit);
    }, [props.digit]);

    // effect to display the number
    useEffect(() => {
        let elemetns = document.querySelectorAll(`#${props.digitID} .bar`);
        if (elemetns.length > 0) {
            for (let i = 0; i < 7; i++) {
                if (bars[i]) {
                    elemetns[i].classList.value = "bar checked"
                } else {

                    elemetns[i].classList.value = "bar";
                }
            }
        }
    }, [bars]);


    return (
        <div className="digit" id={props.digitID}>
            <div></div>
            <div className='bar' id='top'></div>
            <div></div>

            <div className="bar" id='top-left'></div>
            <div></div>
            <div className="bar" id='top-right'></div>

            <div></div>
            <div className="bar" id='middle'></div>
            <div></div>

            <div className="bar" id='bottom-left'></div>
            <div></div>
            <div className="bar" id='bottom-right'></div>

            <div></div>
            <div className="bar" id='bottom'></div>
            <div></div>
        </div>
    );
}

export default Digit;