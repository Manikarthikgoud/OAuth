import React, { useState } from 'react'
import { Layout, Menu, theme } from "antd"
import { Navigate, NavLink, Route, Routes } from "react-router-dom"
import LandingPage from './LandingPage';
import Profile from './Profile';
import Counter from './Counter';

export default function LayoutComponent({ AuthContext }) {
  function getItem(label, key, icon, children) {
    return { key, icon, children, label, };
  }

  const items = [
    getItem(
      <NavLink to={`/dashboard`}>
        Dashboard
      </NavLink>,
      'dashboard'
    ),
    getItem(
      <NavLink to={`/profile`}>
        Profile
      </NavLink>,
      'profile'
    ),
    getItem(
      <NavLink to={`/counter`}>
        Counter
      </NavLink>,
      'counter'
    ),
  ];

  const { Header, Content, Footer, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer }, } = theme.useToken();
  const mainPathSplit = window.location.pathname.split('/');

  return (
    <div>
      <Layout style={{ minHeight: '100vh', }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="">
            <h1 style={{ color: '#fff', textAlign: 'center' }}>OAuth</h1>
          </div>
          <Menu theme="dark" defaultSelectedKeys={mainPathSplit && mainPathSplit[1] ? mainPathSplit[1] : 'dashboard'} mode="inline" items={items} />
        </Sider>
        <Layout>
          {/* <Header style={{ padding: 0, background: colorBgContainer, }} /> */}
          <Content style={{ margin: '0 16px', }}>
            <Routes>
              <Route index path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<LandingPage AuthContext={AuthContext} />} />
              <Route path="/profile" element={<Profile AuthContext={AuthContext} />} />
              <Route path="/counter" element={<Counter AuthContext={AuthContext} />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center', background: colorBgContainer, padding: 15 }}>
            Teleparadigm ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}