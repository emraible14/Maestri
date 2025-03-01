import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

function Navbar() {

  const start = (
      <a href="/">
        <img alt="logo" src="https://routenote.com/blog/wp-content/uploads/2016/01/d8465f8c5906f540df63f7ff83e8aae6.640x360x30.gif" height="40" className="mr-2 rounded-full"></img>
      </a>  
  );

  const items: MenuItem[] = [
    {
      label: 'Artist',
      icon: 'pi pi-star',
      url: '/artist?id=123'
    },
    {
      label: 'Compare artists',
      icon: 'pi pi-user',
      url: '/comparison'
    },
    {
      label: 'Explore connections',
      icon: 'pi pi-users',  
      url: '/network'
    },
    // {
    //   label: 'Explore the world',
    //   icon: 'pi pi-map',
    //   url: '/mapview'
    // }
  ]


  // Return
  return (
    <div>
      <Menubar model={items} start={start}/>
    </div>
  )
}; 

export default Navbar;