import { Button, Layout, Menu, theme} from 'antd';
const { Header, Sider, Content, Footer } = Layout;
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../shared/supabaseClient';
import TopicsList from './components/TopicsList';
import PlaceMap from './map';
import {
  CustomerServiceOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import UsersList from './usersInfo';


const AdminPage: React.FC = () => {
  const [selectedMenuItemKey, setSelectedMenuItemKey] = useState('1');

  
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function renderContent(){
    if (selectedMenuItemKey == '1') {
      return <TopicsList/>;
    }
    else if (selectedMenuItemKey == '2'){
      return <PlaceMap/>;
    }
    else if (selectedMenuItemKey == '3'){
      return <UsersList/>;
    }
    
  }
  


  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);
      if (!session) {
        navigate('/login');
      }
    };
    checkSession();
  }, []);

  async function logout() {
    supabase.auth.signOut();
    navigate('/login');
  }

  

  return (
    <Layout style={{ height: '200vh' }}>
      <Sider style={{ background: colorBgContainer }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              label: 'Интересы',
              icon: <CustomerServiceOutlined/>,
              onClick:() => setSelectedMenuItemKey('1'),
            },
            {
              key: '2',
              label: 'Любимые места',
              icon: <EnvironmentOutlined />,
              onClick:() => setSelectedMenuItemKey('2'),
            },
            {
              key: '3',
              label: 'Пользователи',
              icon: <UserOutlined />,
              onClick:() => setSelectedMenuItemKey('3'),
            },
          ]}
          
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              padding: '15px',
              columnGap: '15px',
            }}
          >
          <header style = {{left: '1000px', margin: '24px 16px', padding: 0, color: "gray"}}>
            Random Coffee Administration
          </header>
            <Button onClick={() => window.open('https://vk.com/shamanka_010')}>
              Сайт разработчика
            </Button>
            <Button type="primary" color="danger" onClick={() => logout()}>
              Выйти
            </Button>
            
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
           ©{new Date().getFullYear()} Created by PMiFi group 3
          </Footer>
      </Layout>
    </Layout>
  );
}


export default AdminPage;
