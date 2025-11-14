import { useState, useEffect } from "react";

function request() {

    return (
        <div className = 'outerRqBox'>
            <div className='requestName'>John's math homework</div>
            <div className = 'info'></div>
            <div className = 'actions'>
                <button className = 'acceptRqBtn'>accept</button>
                <button className = 'denyRqBtn'>deny</button>
            </div>

        </div>
    );
}

export default request;
