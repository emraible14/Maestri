import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { useNavigate } from "react-router-dom";
import {useState} from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

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

  const end = (
    <div>
      <Button label="About us" severity="secondary" onClick={() => setVisible(true)} />
      <Dialog header="We are Maestri" visible={visible} className='w-2/3' onHide={() => {if (!visible) return; setVisible(false); }}>
          <p className="m-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div className="grid grid-cols-5">
            <Card style={{padding: 5}} title="Emma Raible" subTitle="Cool girlie" header={<img src='public/crop-emma.jpg'/>}/>
            <Card style={{padding: 5}} title="Daniel Balanica" subTitle="Cool guyyy" header={<img src='public/crop-daniel.jpg'/>}/>
            <Card style={{padding: 5}} title="Meya Vikner" subTitle="Cool girlie" header={<img src='public/crop-meya.jpg'/>}/>
            <Card style={{padding: 5}} title="Isak Larsson" subTitle="Cool Guyyy" header={<img src='public/crop-isak.jpg'/>}/>
            <Card style={{padding: 5}} title="Ludwig Estling" subTitle="Cool Guyyy" header={<img src='public/ludwig.png'/>}/>
          </div>
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