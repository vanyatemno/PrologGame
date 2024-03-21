import './Operator.css';
import {useEffect, useState} from "react";

function Operator(props) {

    const [isPlus, setPlus] = useState(props.isPlus)

    useEffect(() => {
        if (isPlus) {
            document.querySelector(`#${props.operID} .plus`).classList.value = 'bar plus checked';
        } else {
            document.querySelector(`#${props.operID} .plus`).addEventListener('click', e => {
                if (props.answer[0] == '+') {
                    document.querySelector(`#${props.operID} .plus`).classList.value = 'bar plus checked';
                    props.isSolved(true);
                }
            })
            document.querySelector(`#${props.operID} .plus`).classList.value = 'bar plus';
        }
    }, [isPlus]);

    useEffect(() => {
        setPlus(props.isPlus)
    }, [props.isPlus]);

    return (
        <div className='operator' id={props.operID}>
            <div className="bar minus checked"></div>
            <div className="bar plus"></div>
        </div>
    )
};

export default Operator;