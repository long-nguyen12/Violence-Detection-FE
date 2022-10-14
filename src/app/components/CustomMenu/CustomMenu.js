import {Menu} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import {checkLoaded, formatUnique} from '@app/common/functionCommons';
import {checkPermission} from '@app/rbac/checkPermission';
import {ConstantsRoutes} from '@app/router/ConstantsRoutes';
import {URL} from '@url';

import * as app from '@app/store/ducks/app.duck';

import './CustomMenu.scss';

function CustomMenu({ location, siderCollapsed, isBroken, myInfo, locationPathCode, ...props }) {
  const keyRef = useRef([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [pathnameFormat, setPathnameFormat] = useState(null);

  const { role } = myInfo;

  useEffect(() => {
    let { pathname } = location;

    function findPathname(pathname, key, value) {
      let pathReturn = pathname;
      if (key.includes('_ID') && key.indexOf('_ID') === key.length - 3) {
        const valueTemp = value.slice(0, value.length - 3);
        if (pathReturn.includes(valueTemp)) {
          pathReturn = value.format(':id');
        }
      }
      return pathReturn;
    }

    Object.entries(URL).forEach(([urlKey, urlValue]) => {
      if (typeof urlValue === 'string') {
        pathname = findPathname(pathname, urlKey, urlValue);
      }
      if (typeof urlValue === 'object') {
        Object.entries(urlValue).forEach(([menuKey, menuValue]) => {
            pathname = findPathname(pathname, menuKey, menuValue);
          },
        );
      }
    });
    props.setLocationPathCode(pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (siderCollapsed) {
      keyRef.current = openKeys;
      setOpenKeys([]);
    } else {
      setOpenKeys(keyRef.current);
    }
  }, [siderCollapsed]);

  useEffect(() => {
    let keys = [...openKeys, ...keyRef.current];
    ConstantsRoutes.forEach((menu) => {
      if (!menu.hide && menu.menuName && Array.isArray(menu.children)) {
        menu.children.forEach((child) => {
          if (!child.hide && pathnameFormat && [child.key, child.path].includes(pathnameFormat)) {
            keys = formatUnique([...keys, 'path' + (menu.key || menu.path)]);
          }
        });
      }
    });

    if (checkLoaded()) {
      if (siderCollapsed) {
        keyRef.current = keys;
      } else {
        setOpenKeys(keys);
      }
    } else {
      window.onload = function() {
        setOpenKeys(keys);
      };
    }
  }, [pathnameFormat]);

  function handleCheckPermission(path) {
    return checkPermission(role, path);
  }

  function handleActiveMenuForComponentDetail(menu) {
    if (menu.path !== pathnameFormat) {
      if (menu.path === locationPathCode) {
        setPathnameFormat(menu.path);
      }

      if (Array.isArray(menu.children)) {
        menu.children.forEach(child => {
          if (child.path === locationPathCode) {
            setPathnameFormat(menu.path);
          }
        });
      }
    }
  }

  function renderItem(menu) {
    handleActiveMenuForComponentDetail(menu);
    if (menu.hide || !menu.menuName) return;
    let hasPermission = handleCheckPermission(menu.path);
    if (!hasPermission) return;
    return <Menu.Item key={menu.path} icon={menu.icon}>
      <Link to={menu.path}>{menu.menuName}</Link>
    </Menu.Item>;
  }

  function handleTitleClick(value) {
    const { key } = value;
    if (openKeys.includes(key)) {
      setOpenKeys(openKeys.filter(openKey => openKey !== key));
    } else {
      setOpenKeys([...openKeys, key]);
    }
  }

  function renderSubItem(menu) {
    if (menu.hide) return;
    let hasPermission = handleCheckPermission(menu.path);
    if (menu.key) {
      let subMenuHasPermission = 0;
      menu.children.forEach(sub => {
        if (!sub.hide && handleCheckPermission(sub.path)) {
          subMenuHasPermission += 1;
        }
      });
      if (!subMenuHasPermission) {
        hasPermission = false;
      }
    }

    return <Menu.SubMenu
      key={'path' + menu.key}
      title={menu.menuName}
      icon={menu.icon}
      onTitleClick={handleTitleClick}
      disabled={!hasPermission}
    >
      {hasPermission && menu.children.map((child) => {
        if (child.path) {
          return renderItem(child);
        }
        if (child.key && Array.isArray(child.children)) {
          return renderSubItem(child);
        }
      })}
    </Menu.SubMenu>;
  }

  const menuItem = ConstantsRoutes.map((menu) => {
    if (menu.path) {
      return renderItem(menu);
    }
    if (menu.key && Array.isArray(menu.children)) {
      return renderSubItem(menu);
    }
  });

  return <div style={{ height: '100%', overflow: 'hidden' }}>
    <div className="custom-scrollbar aside-menu">
      <Menu
        mode="inline" className="main-menu"
        {...siderCollapsed ? {} : { openKeys }}
        selectedKeys={[pathnameFormat]}
        expandIcon={({ isOpen }) => {
          if (!siderCollapsed)
            return <div className="expand-icon">
              <i className={`fa fa-chevron-right ${isOpen ? 'fa-rotate-90' : ''}`} aria-hidden="true"/>
            </div>;
          return null;
        }}>
        {menuItem}
      </Menu>
    </div>
  </div>;

}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken, locationPathCode } = store.app;
  const { myInfo } = store.user;
  return { siderCollapsed, isBroken, locationPathCode, myInfo };
}

export default connect(mapStateToProps, app.actions)(withRouter(CustomMenu));
