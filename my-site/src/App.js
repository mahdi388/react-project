import "./styles/main.scss"
import { useState } from "react";
import ad1 from "./images/ad1.jpg"

function App() {
  const [user,setUser]=useState(null)
  return <>
    <header>
      <nav>
        <ul>
          <li>search rooms</li>
          <li>search food</li>
          {user && <li>reservation | 0$</li>}
        </ul>
        <ul>
          {user ? <li>log out</li>:<><li>sing in</li><li>sign up</li></>}
        </ul>
      </nav>
    </header>
    <main>
    </main>
      Lorem ipsum dolor sit amet consectetur, <br/>
      adipisicing elit. Temporibus tenetur <br/>
      vitae mollitia expedita voluptate nam <br/>
      deleniti esse porro, quam nisi asperiores <br/>
      voluptas itaque, vero impedit sunt cum <br/>
      nemo suscipit laudantium.<br/>
      Lorem ipsum dolor sit amet consectetur, <br/>
      adipisicing elit. Temporibus tenetur <br/>
      vitae mollitia expedita voluptate nam <br/>
      deleniti esse porro, quam nisi asperiores <br/>
      voluptas itaque, vero impedit sunt cum <br/>
      nemo suscipit laudantium.<br/>
      Lorem ipsum dolor sit amet consectetur, <br/>
      adipisicing elit. Temporibus tenetur <br/>
      vitae mollitia expedita voluptate nam <br/>
      deleniti esse porro, quam nisi asperiores <br/>
      voluptas itaque, vero impedit sunt cum <br/>
      nemo suscipit laudantium.<br/>
      Lorem ipsum dolor sit amet consectetur, <br/>
      adipisicing elit. Temporibus tenetur <br/>
      vitae mollitia expedita voluptate nam <br/>
      deleniti esse porro, quam nisi asperiores <br/>
      deleniti esse porro, quam nisi asperiores <br/>
    <footer>
      <div className="concat-us">
        <div>Contact us</div>
        <ul>
          <li>Address: Hamedan Iran</li>
          <li>Emali: aria@hotel.com</li>
          <li>Phone: 09181111111</li>
        </ul>
      </div>
      <div className="adds">
        <div>
          <img src={ad1} alt="add"/>
          <div>Lorem, ipsum.</div>
        </div>
        <div>
          <img src={ad1} alt="add"/>
          <div>Lorem, ipsum.</div>
        </div>
      </div>
    </footer>
  </>;
}

export default App;