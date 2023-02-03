import Header from "./components/Header"
import Sidebar from "./components/Sidebar"

export function Combiner(main) {
  return (
    <div>
      <Header/>
      <br></br><br></br>
      {main}
    </div>
  )
}

export function SidebarCombiner(left) {
  return (
    <div className="w3-row">
      <br></br><br></br><br></br>
      {left}
      <Sidebar/>
    </div>
  )
}

export function ContentFormat(content) {
  return (
    <div className="w3-content" style={{maxWidth: "1150px"}}>{content}</div>
  )
}
