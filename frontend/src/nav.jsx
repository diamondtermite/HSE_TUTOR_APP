import { useEffect, useState} from "react"

function Nav() {
    const [shown, setShown] = useState(true);
    if (!shown) {
        return null;
    }
    return (

        <div className="nav-bar">
            <img src="/assets/nav-image.png" alt="huh" onClick={() => console.log("hello!")}/>
            <img src="/assets/nav-image.png" alt="Navigation image" onClick={console.log("hello!")}/>

        </div>

    )

}

export default Nav;