import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

import { Button } from 'primereact/button';
import { memo, Fragment } from 'react';

const Navbar = memo(function Navbar() {

  const start = (
      <div className="text-4xl">
        <a href="/">
          <img alt="logo" src="https://routenote.com/blog/wp-content/uploads/2016/01/d8465f8c5906f540df63f7ff83e8aae6.640x360x30.gif" height="40" className="mr-2 rounded-full"></img>
        </a>
          {/* <span className="inline-block align-middle">Maestri</span> */}
      </div>
  );
  
  const end=<Button severity='secondary'>About</Button>;

//   const headerRenderer = (item: MenuItem) => (
//     <a className="flex align-items-center p-menuitem-link disabled:pointer-events-none">
//         <span className="text-lg">{item.label}</span>
//     </a>
// );

  const items: MenuItem[] = [
    // {
    //   label: 'Maestri',
    //   template: headerRenderer
    // },
    {
      label: 'Artist',
      icon: 'pi pi-star',
      url: '/artist'
    },
    {
      label: 'Compare artists',
      icon: 'pi pi-user',
      url: '/compare'
    },
    {
      label: 'Explore influences',
      icon: 'pi pi-users',  
      url: '/network'
    },
    {
      label: 'Explore the world',
      icon: 'pi pi-map',
      url: '/mapview'
    }
  ]


  // Return
  return (
    <div>
      <Menubar model={items} start={start} end={end}/>
    </div>
  )
}); 

export default Navbar;