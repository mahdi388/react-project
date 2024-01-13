import '../styles/home.scss'
import image from '../images/aria_hotel.jpg'

function Main() {
    return <main className="main" >
        <aside className="welcome">
            <h1>Welcome to Aria hotel!</h1>
        </aside>
        <aside className="gallery">
            <div>
                <div className="title">
                    A different experience in Aria Hotel
                </div>
                <div className="desciption">
                    Experience wonderful memories and unforgettable moments by staying at Aria Hotel.
                </div>
            </div>
            <img src={image} alt="aria hotel"/>
        </aside>

    </main>;
}

export default Main;