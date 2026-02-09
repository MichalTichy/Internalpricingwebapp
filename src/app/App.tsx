import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Orders, Order } from './pages/Orders';
import { Pricing } from './pages/Pricing';
import { Data } from './pages/Data';
import { Settings } from './pages/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'pricing' | 'data' | 'settings'>('orders');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentOrder(null);
    setActiveTab('orders');
  };

  const handleSelectOrder = (order: Order) => {
    setCurrentOrder(order);
    setActiveTab('pricing');
  };

  const handleCreateOrder = () => {
    setCurrentOrder(null); // New order means clean slate (or we can initialize a new object)
    setActiveTab('pricing');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === 'orders' && (
        <Orders 
          onSelectOrder={handleSelectOrder} 
          onCreateOrder={handleCreateOrder}
        />
      )}
      
      {activeTab === 'pricing' && (
        <Pricing initialOrder={currentOrder} />
      )}
      
      {activeTab === 'data' && (
        <Data />
      )}
      
      {activeTab === 'settings' && (
        <Settings />
      )}
    </Layout>
  );
}

export default App;
