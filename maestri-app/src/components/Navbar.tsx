import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

import { Button } from 'primereact/button';
import { memo, Fragment } from 'react';

const Navbar = memo(function Navbar() {

  const start = (
    <Fragment>
      <div className="flex flex-row gap-2">
          <a href="/">
            <img alt="logo" src="https://routenote.com/blog/wp-content/uploads/2016/01/d8465f8c5906f540df63f7ff83e8aae6.640x360x30.gif" height="40" className="mr-2 rounded-full"></img>
          </a>
          {/* <span className="text-3xl"> Maestri</span> */}
      </div>
    </Fragment>
  );
  
  const end=<Button severity='secondary'>About</Button>;

  const items: MenuItem[] = [
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