import { useState, useEffect } from "react";

function request(props) {

    return (
        <div className='requestBox'>
            <div className='requestBoxHeader'></div>
            <div className="requestStudentProfile">
                <img alt="placeholder" />
                <div className="requestStudentInfo">
                    <p>{props.studentName}</p>
                    <p>{props.studentGrade}</p>
                </div>
            </div>
            <div className='requestDescription'>{props.info}</div>
            <div className='requestActions'>
                <button className='acceptRqBtn'>accept</button>
            </div>
        </div>
    );
}

export default request;
