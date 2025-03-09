import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const start = (
      <a href="/">
        <img alt="logo" src="https://routenote.com/blog/wp-content/uploads/2016/01/d8465f8c5906f540df63f7ff83e8aae6.640x360x30.gif" height="40" className="mr-2 rounded-full"></img>
      </a>  
  );

  const items: MenuItem[] = [
    {
      label: 'Artist',
      icon: 'pi pi-user',
      command: () =>  navigate('/artist?id=2358')
    },
    {
      label: 'Compare artists',
      icon: 'pi pi-users',
      command: () =>  navigate('/comparison')
    },
    {
      label: 'Explore connections',
      icon: 'pi pi-arrow-right-arrow-left',  
      command: () =>  navigate('/network?id=2358')
    }
  ]

  // Return
  return (
    <div>
      <Menubar model={items} start={start}/>
    </div>
  )
}; 

export default Navbar;