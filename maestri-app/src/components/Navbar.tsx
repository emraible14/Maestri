import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from "react-router-dom";
import {useState} from 'react';
import About from "../views/About.tsx";

function Navbar() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const start = (
      <a onClick={() =>  navigate('/')}>
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

  const end = (
    <div>
      <Button label="About us" severity="secondary" onClick={() => setVisible(true)} />
      <Dialog header="The Maestri Project" visible={visible} className='w-2/3' onHide={() => {if (!visible) return; setVisible(false); }} draggable={false}>
          {About()}
      </Dialog>
    </div>
    
  )


  
  // Return
  return (
    <div>
      <Menubar model={items} start={start} end={end}/>
    </div>
  )
}; 

export default Navbar;