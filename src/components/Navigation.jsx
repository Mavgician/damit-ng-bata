'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faBox, faShield } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';

import { Popover } from 'react-tiny-popover';

import { getUserCS } from 'firebase-nextjs/client/auth';
import { LogoutButton } from 'firebase-nextjs/client/components';
import { fetchUserPost } from '@/lib/DataServer';

import useSWR from 'swr';

function ProfilePopup({ user, firestoreUser }) {
  
  const imageUrl = user?.photoURL ?? "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + (user?.displayName ?? user?.email);

  const popupStyle = {
    width: "calc(-40px + min(100vw, 370px))",
    backgroundColor: '#fff',
    border: '1px solid #00000022',
    borderRadius: 8,
    color: "#000",
    padding: 0,
    paddingTop: 10,
    margin: 10,
  };

  const profilePopupImageStyle = {
    borderRadius: 9999,
    height: 30,
    width: 30,
    margin: 5,
    marginLeft: 13,
    marginTop: 8,
  };

  const icon = {
    height: 15, width: 15,
    display: 'inline-flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: 5
  }

  return <div style={popupStyle}>
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
      <img src={imageUrl} alt="profile" height={30} width={30} style={profilePopupImageStyle} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {user?.displayName && <div style={{
          fontSize: 15,
          fontWeight: 500,
          marginLeft: 8,
          marginRight: 13,
          marginBottom: 0,
        }}>{user?.displayName}</div>}
        <div style={{ fontSize: 14, color: "#00000088", marginLeft: 8, marginRight: 13 }}>{user?.email}</div>
      </div>
    </div>
    <hr />
    <div className='text-uppercase text-secondary'>
      {
        firestoreUser.type === 'admin' ?
          <NavLink href='/admin-dashboard' className='px-3 py-2 profilePopoverLink'>
            <div className='profilePopoverMenu'>
              <FontAwesomeIcon style={icon} icon={faShield} />
            </div>
            Admin
          </NavLink> : 
          null
      }
      <NavLink href='/profile' className='px-3 py-2 profilePopoverLink'>
        <div className='profilePopoverMenu'>
          <FontAwesomeIcon style={icon} icon={faBox} />
        </div>
        Orders
      </NavLink>
      <NavLink href='/profile' className='px-3 py-2 profilePopoverLink'>
        <div className='profilePopoverMenu'>
          <FontAwesomeIcon style={icon} icon={faUser} />
        </div>
        Profile
      </NavLink>
      <NavLink href='/settings' className='px-3 py-2 profilePopoverLink'>
        <div className='profilePopoverMenu'>
          <FontAwesomeIcon style={icon} icon={faGear} />
        </div>
        Settings
      </NavLink>
    </div>
    <hr style={{ marginBottom: 0 }} />
    <LogoutButton>
      <div className="profileLogout">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={20} width={20} fill='red'><g><path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6zm13.82 5.42-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z"></path></g></svg>
        Log Out
      </div>
    </LogoutButton>
  </div>
}

function ProfileButtonTrigger({ user, size }) {
  const imageUrl = user?.photoURL ?? "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + (user?.displayName ?? user?.email);
  return (
    <img src={imageUrl} alt="profile" height={size} width={size} className="rounded-circle" style={{ cursor: "pointer" }} />
  );
};

export function Navigationbar({ transparent = false, isFixed = true }) {
  const { data: firestoreUser } = useSWR('api/user/verify', fetchUserPost, { suspense: true })
  const user = getUserCS()

  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar
        expand='md'
        color={transparent ? 'transparent' : 'light'}
        fixed={isFixed ? 'top' : undefined}
        style={transparent ? { boxShadow: 'none' } : undefined}
      >
        <NavbarBrand href='/' className='d-flex align-items-center'>
          <small className='mx-2'>
            <b>DNB</b>
          </small>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ms-auto fw-bold d-flex align-items-center' navbar>
            <NavItem>
              <NavLink href='/products/boys'>Boys</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/products/girls'>Girls</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/cart'>Cart</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/about-us'>About Us</NavLink>
            </NavItem>
            <NavItem>
              {
                user.userLoggedIn ?
                  <Popover isOpen={isPopoverOpen} positions={["bottom", "left", "right", "top"]}
                    onClickOutside={() => setIsPopoverOpen(false)}
                    content={<ProfilePopup user={user.currentUser} />}
                    containerStyle={{ zIndex: '9999' }}
                  >
                    <div>
                      <Button onClick={() => setIsPopoverOpen(!isPopoverOpen)} color='transparent'>
                        <ProfileButtonTrigger user={user.currentUser} firestoreUser={firestoreUser} size={40} />
                      </Button>
                    </div>
                  </Popover>
                  :
                  <NavLink href={'/login'}>
                    <Button color='dark'>
                      Sign Up
                    </Button>
                  </NavLink>
              }
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      {isFixed ? <div style={{ height: 70 }}>&nbsp;</div> : null}
    </>
  );
}