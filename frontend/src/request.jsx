import { useState, useEffect } from "react";

function request(props) {

    return (
        <div className='requestBox'>
            <div className='requestName'>{props.requestName}</div>
            <div className='info'>{props.info}</div>
            <div className='actions'>
                <button className='acceptRqBtn'>accept</button>
                <button className='denyRqBtn'>deny</button>
            </div>
        </div>
    );
}

export default request;
