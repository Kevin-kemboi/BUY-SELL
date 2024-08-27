import { Outlet } from "react-router-dom"
import RootNavbar from "../components/RootNavbar"

const RootLayout = () => {
  return (
    <div className='min-h-screen w-full bg-dark-4'>
      <RootNavbar/>
      <Outlet/>
    </div>
  )
}

export default RootLayout