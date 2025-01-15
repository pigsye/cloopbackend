import "./topbar.scss"

export default function Topbar({user}) {
    return (
        <>
            <div className="topbar">
                <div className="user-info">
                    <p> {user.name} </p>
                </div>
            </div>
            <div className="faketopbar"></div>
        </>
    )
}