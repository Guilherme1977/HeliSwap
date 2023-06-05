import { NavLink } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import Icon from './Icon';

const navigation = [
  {
    link: '/heliverse',
    name: 'heli',
    color: 'gray',
    text: 'HeliVerse',
  },
  {
    link: '/lockdrop',
    name: 'heli',
    color: 'gray',
    text: 'Lockdrop',
  },
  {
    link: '/claimdrop',
    name: 'claim',
    color: 'gray',
    text: 'Claimdrops',
  },
  {
    link: '/single-sided-staking',
    name: 'sss',
    color: 'gray',
    text: 'Single Sided Staking',
  },
  {
    link: '/',
    name: 'swap',
    color: 'gray',
    text: 'Swap',
  },
  {
    link: '/pools',
    name: 'pools',
    color: 'gray',
    text: 'Pools',
  },
  {
    link: '/farms',
    name: 'farms',
    color: 'gray',
    text: 'Farms',
  },
  {
    link: '/buy-crypto',
    name: 'c14',
    color: 'gray',
    text: 'Buy Crypto with Fiat',
  },
  {
    link: '/analytics',
    name: 'analytics',
    color: 'gray',
    text: 'Analytics',
  },
];

const Navigation = () => {
  const getClasses = (isActive: boolean, index: number) => {
    const classes = ['link-menu'];
    if (index) {
      classes.push('mt-md-4');
    }
    if (isActive) {
      classes.push('is-active');
    }
    return classes;
  };

  return (
    <div className="d-md-flex flex-md-column">
      {navigation.map((item, index) => {
        return (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) => getClasses(isActive, index).join(' ')}
          >
            <Tippy placement="right" className="d-none d-md-block d-xxxl-none" content={item.text}>
              <span className="icon-menu">
                <Icon color={item.color} name={item.name} />
              </span>
            </Tippy>
            <span className="ms-4 d-none d-xxxl-inline-block">{item.text}</span>
          </NavLink>
        );
      })}
      <a
        className="link-menu mt-md-4"
        target="_blank"
        rel="noreferrer"
        href="https://app.hashport.network/"
      >
        <Tippy
          placement="right"
          className="d-none d-md-block d-xxxl-none"
          content="Hashport Bridge"
        >
          <span className="icon-menu">
            <Icon color="gray" name="hashport" />
          </span>
        </Tippy>
        <span className="ms-4 d-none d-xxxl-inline-block">Hashport Bridge</span>
      </a>
    </div>
  );
};

export default Navigation;
