import "./styles/main.scss"
import { useState } from "react";

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
  </>;
}

export default App;