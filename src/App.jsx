import React, { useState, useEffect, createContext, useContext } from 'react';


const ThemeContext = createContext();
const AuthContext = createContext();
const CartContext = createCont
function PhoneMarketApp() {

  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showLogin, setShowLogin] = useState(false);


  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isDarkMode]);


  const login = (email, password) => {
    setUser({ id: 1, name: 'Foydalanuvchi', email });
    setShowLogin(false);
  };

  const logout = () => {
    setUser(null);
  };

  
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme: () => setIsDarkMode(!isDarkMode) }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount, cartTotal }}>
          <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* H */}
            <Header 
              onLoginClick={() => setShowLogin(true)}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />

        
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={login} />}

      
            <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
              {currentPage === 'home' && <HomePage />}
              {currentPage === 'products' && <ProductsPage />}
              {currentPage === 'cart' && <CartPage />}
              {currentPage === 'profile' && <ProfilePage />}
            </div>

            {/* FOOTER */}
            <Footer />
          </div>
        </CartContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}


function Header({ onLoginClick, currentPage, setCurrentPage }) {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Bosh Sahifa', icon: '🏠' },
    { id: 'products', label: 'Telefonlar', icon: '📱' },
    { id: 'cart', label: `Savatcha (${cartCount})`, icon: '🛒' },
    { id: 'profile', label: 'Profil', icon: '👤' },
  ];

  return (
    <header style={{
      backgroundColor: isDarkMode ? '#1e293b' : '#3b82f6',
      color: 'white',
      padding: '15px 20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
      
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '10px',
            borderRadius: '12px',
            fontSize: '24px'
          }}>
            📱
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>PhoneMarket</h1>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Premium telefonlar bozori</p>
          </div>
        </div>

       
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 15px 10px 40px',
                borderRadius: '25px',
                border: 'none',
                width: '300px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                outline: 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}>🔍</span>
          </div>

         
          <nav style={{ display: 'flex', gap: '15px' }}>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                style={{
                  background: currentPage === item.id ? 'rgba(255,255,255,0.3)' : 'transparent',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  transition: 'all 0.3s'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>


          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

      
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 'bold'
                }}
              >
                👤 {user.name}
                <span style={{ fontSize: '12px' }}>▼</span>
              </button>
              
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '10px',
                  backgroundColor: isDarkMode ? '#1e293b' : 'white',
                  color: isDarkMode ? 'white' : 'black',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  minWidth: '200px',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{user.name}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>{user.email}</p>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: 'none',
                    background: 'none',
                    color: 'inherit',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    ⚙️ Sozlamalar
                  </button>
                  <button 
                    onClick={logout}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: 'none',
                      background: 'none',
                      color: '#ef4444',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    🚪 Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Kirish / Ro'yxatdan o'tish
            </button>
          )}

        
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ☰
          </button>
        </div>
      </div>

      
      {showMobileMenu && (
        <div style={{
          marginTop: '15px',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '10px'
        }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setShowMobileMenu(false);
              }}
              style={{
                width: '100%',
                background: currentPage === item.id ? 'rgba(255,255,255,0.3)' : 'transparent',
                border: 'none',
                color: 'white',
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '16px',
                marginBottom: '5px'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}


function LoginModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          {isLogin ? 'Hisobga kirish' : 'Ro\'yxatdan o\'tish'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ismingiz</label>
              <input
                type="text"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Parol</label>
            <input
              type="password"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {isLogin ? 'Hisobingiz yo\'qmi?' : 'Allaqachon hisobingiz bormi?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isLogin ? 'Ro\'yxatdan o\'ting' : 'Kirish'}
          </button>
        </p>
      </div>
    </div>
  );
}


function HomePage() {
  const { isDarkMode } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);

  const featuredProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 1299, brand: 'Apple', image: '📱', rating: 4.8, discount: 10 },
    { id: 2, name: 'Samsung S24 Ultra', price: 1199, brand: 'Samsung', image: '📱', rating: 4.7, discount: 15 },
    { id: 3, name: 'Xiaomi 14 Pro', price: 899, brand: 'Xiaomi', image: '📱', rating: 4.5, discount: 5 },
    { id: 4, name: 'Google Pixel 8 Pro', price: 999, brand: 'Google', image: '📱', rating: 4.6, discount: 0 },
  ];

  return (
    <div>
     
      <div style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 40px',
        borderRadius: '20px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Zamonaviy Telefonlar Dunyosi</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px', opacity: 0.9 }}>
          Eng yangi va sifatli telefonlar faqat bizda. 100% kafolat va tez yetkazib berish
        </p>
        <button style={{
          background: 'white',
          color: '#667eea',
          border: 'none',
          padding: '15px 40px',
          borderRadius: '30px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Hoziroq xarid qiling →
        </button>
      </div>


      <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Tavsiya etilganlar</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '50px'
      }}>
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
        ))}
      </div>


      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{
          background: isDarkMode ? '#1e293b' : '#f8fafc',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>🚚</div>
          <h3 style={{ marginBottom: '10px' }}>Tez Yetkazib Berish</h3>
          <p style={{ opacity: 0.7 }}>24 soat ichida Toshkent bo'ylab bepul yetkazib berish</p>
        </div>
        <div style={{
          background: isDarkMode ? '#1e293b' : '#f8fafc',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>✅</div>
          <h3 style={{ marginBottom: '10px' }}>100% Kafolat</h3>
          <p style={{ opacity: 0.7 }}>2 yilgacha rasmiy kafolat va texnik xizmat</p>
        </div>
        <div style={{
          background: isDarkMode ? '#1e293b' : '#f8fafc',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>💳</div>
          <h3 style={{ marginBottom: '10px' }}>Oson To'lov</h3>
          <p style={{ opacity: 0.7 }}>Bo'lib-bo'lib to'lash va bank kartalari qabul qilish</p>
        </div>
      </div>
    </div>
  );
}


function ProductCard({ product, onAddToCart }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        background: isDarkMode ? '#1e293b' : 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.15)' 
          : '0 5px 15px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
        transform: isHovered ? 'translateY(-10px)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
  
      {product.discount > 0 && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          -{product.discount}%
        </div>
      )}


      <div style={{
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '80px',
        marginBottom: '20px'
      }}>
        {product.image}
      </div>


      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{
            background: isDarkMode ? '#334155' : '#e2e8f0',
            padding: '5px 10px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {product.brand}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#fbbf24' }}>★</span>
            <span>{product.rating}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: 'bold' }}>
          {product.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
              ${product.price}
            </div>
            {product.discount > 0 && (
              <div style={{ fontSize: '14px', textDecoration: 'line-through', opacity: 0.6 }}>
                ${(product.price * 100 / (100 - product.discount)).toFixed(0)}
              </div>
            )}
          </div>

          <button
            onClick={onAddToCart}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🛒 Savatchaga
          </button>
        </div>
      </div>
    </div>
  );
}


function ProductsPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const { addToCart } = useContext(CartContext);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const products = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 1299, brand: 'Apple', specs: '256GB, Gold', rating: 4.8 },
    { id: 2, name: 'Samsung S24 Ultra', price: 1199, brand: 'Samsung', specs: '512GB, Black', rating: 4.7 },
    { id: 3, name: 'Xiaomi 14 Pro', price: 899, brand: 'Xiaomi', specs: '256GB, Blue', rating: 4.5 },
    { id: 4, name: 'Google Pixel 8 Pro', price: 999, brand: 'Google', specs: '128GB, White', rating: 4.6 },
    { id: 5, name: 'OnePlus 12', price: 849, brand: 'OnePlus', specs: '256GB, Green', rating: 4.4 },
    { id: 6, name: 'iPhone 14 Pro', price: 1099, brand: 'Apple', specs: '256GB, Silver', rating: 4.7 },
    { id: 7, name: 'Samsung Z Fold 5', price: 1799, brand: 'Samsung', specs: '512GB, Phantom Black', rating: 4.3 },
    { id: 8, name: 'Huawei P60 Pro', price: 799, brand: 'Huawei', specs: '256GB, Rococo Pearl', rating: 4.2 },
  ];

  const brands = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google', 'OnePlus', 'Huawei'];

  const filteredProducts = selectedBrand === 'all' 
    ? products 
    : products.filter(p => p.brand === selectedBrand);

  return (
    <div>
    
      <div style={{
        background: isDarkMode ? '#1e293b' : '#f8fafc',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Brend:</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand === 'All' ? 'all' : brand)}
                style={{
                  background: selectedBrand === (brand === 'All' ? 'all' : brand) 
                    ? '#3b82f6' 
                    : isDarkMode ? '#334155' : '#e2e8f0',
                  color: selectedBrand === (brand === 'All' ? 'all' : brand) ? 'white' : 'inherit',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Saralash:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 15px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              background: isDarkMode ? '#334155' : 'white',
              color: 'inherit'
            }}
          >
            <option value="popular">Mashhurlik bo'yicha</option>
            <option value="price-low">Arzon narxdan</option>
            <option value="price-high">Qimmat narxdan</option>
            <option value="rating">Reyting bo'yicha</option>
          </select>
        </div>
      </div>


      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px'
      }}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
        ))}
      </div>
    </div>
  );
}


function CartPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const { cartItems, removeFromCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
        <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Savatchangiz bo'sh</h2>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.7 }}>
          Hali hech qanday mahsulot qo'shmagansiz
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          border: 'none',
          padding: '15px 40px',
          borderRadius: '25px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Mahsulotlar sahifasiga o'tish →
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>Savatcha ({cartItems.length} mahsulot)</h1>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
    
        <div style={{ flex: 3, minWidth: '300px' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              gap: '20px',
              padding: '20px',
              background: isDarkMode ? '#1e293b' : 'white',
              borderRadius: '15px',
              marginBottom: '15px',
              border: '1px solid',
              borderColor: isDarkMode ? '#334155' : '#e2e8f0'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '50px',
                background: isDarkMode ? '#334155' : '#f8fafc',
                borderRadius: '10px'
              }}>
                📱
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <p style={{ marginBottom: '10px', opacity: 0.7 }}>{item.specs || '256GB, Gold'}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    ${item.price} × {item.quantity} = ${item.price * item.quantity}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isDarkMode ? '#334155' : '#e2e8f0',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}>
                      -
                    </button>
                    <span style={{ fontSize: '18px', minWidth: '30px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: 'none',
                      background: '#3b82f6',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

       
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{
            background: isDarkMode ? '#1e293b' : 'white',
            padding: '25px',
            borderRadius: '15px',
            border: '1px solid',
            borderColor: isDarkMode ? '#334155' : '#e2e8f0',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Buyurtma haqida</h3>
            
            <div style={{ marginBottom: '20px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '2px solid',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>
                <span>Jami:</span>
                <span>${cartTotal}</span>
              </div>
            </div>

            {user ? (
              <>
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}>
                  💳 Buyurtma berish
                </button>
                
                <div style={{
                  background: isDarkMode ? '#0f172a' : '#f1f5f9',
                  padding: '15px',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Yetkazib berish:</p>
                  <p style={{ marginBottom: '5px' }}>📍 Manzil: {user.name}</p>
                  <p style={{ marginBottom: '5px' }}>📧 Email: {user.email}</p>
                  <p style={{ marginBottom: '0' }}>🚚 Yetkazish: 1-2 ish kuni</p>
                </div>
              </>
            ) : (
              <div style={{
                background: isDarkMode ? '#0f172a' : '#fef3c7',
                padding: '15px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Buyurtma berish uchun ro'yxatdan o'ting</p>
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  Kirish / Ro'yxatdan o'tish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function ProfilePage() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔒</div>
        <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Profilga kirish kerak</h2>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.7 }}>
          Profilingizni ko'rish uchun tizimga kiring
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            👤
          </div>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>{user.name}</h1>
            <p style={{ fontSize: '18px', opacity: 0.9 }}>{user.email}</p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
       
        <div style={{
          background: isDarkMode ? '#1e293b' : 'white',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid',
          borderColor: isDarkMode ? '#334155' : '#e2e8f0'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📦 Buyurtmalarim
          </h3>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
            <p>Hozircha buyurtmalar yo'q</p>
          </div>
        </div>

    
        <div style={{
          background: isDarkMode ? '#1e293b' : 'white',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid',
          borderColor: isDarkMode ? '#334155' : '#e2e8f0'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ⚙️ Sozlamalar
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button style={{
              textAlign: 'left',
              padding: '15px',
              background: isDarkMode ? '#334155' : '#f8fafc',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              ✏️ Profil ma'lumotlarini o'zgartirish
            </button>
            <button style={{
              textAlign: 'left',
              padding: '15px',
              background: isDarkMode ? '#334155' : '#f8fafc',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🔒 Parolni o'zgartirish
            </button>
            <button style={{
              textAlign: 'left',
              padding: '15px',
              background: isDarkMode ? '#334155' : '#f8fafc',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🏠 Yetkazib berish manzillarini boshqarish
            </button>
          </div>
        </div>

       
        <div style={{
          background: isDarkMode ? '#1e293b' : 'white',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid',
          borderColor: isDarkMode ? '#334155' : '#e2e8f0'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📊 Statistika
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>0</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Buyurtmalar</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>$0</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Sarflangan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function Footer() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <footer style={{
      backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
      color: 'white',
      padding: '40px 20px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '10px',
              borderRadius: '12px',
              fontSize: '24px'
            }}>
              📱
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>PhoneMarket</h2>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>Eng yaxshi telefonlar</p>
            </div>
          </div>
          <p style={{ opacity: 0.8 }}>
            Biz bilan eng so'nggi texnologiyalar va eng yaxshi narxlarni toping. 100% ishonch va sifat kafolati.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Tez havolalar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              → Bosh sahifa
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              → Telefonlar
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              → Aksessuarlar
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              → Biz haqimizda
            </a>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Aloqa</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 khva shahar, najmiddin kubro kochasi
            </p>
            <p style={{ margin: 0, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              📞 +998 90 990 09 90
            </p>
            <p style={{ margin: 0, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✉️ info@phonemarket.uz
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Ijtimoiy tarmoqlar</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{
              background: 'linear-gradient(135deg, #1877F2 0%, #0d63cb 100%)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}>
              f
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #1DA1F2 0%, #0d8ddb 100%)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}>
              𝕏
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #E4405F 0%, #d32a4a 100%)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}>
              📸
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #25D366 0%, #1da851 100%)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}>
              💬
            </button>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '40px',
        paddingTop: '20px',
        textAlign: 'center',
        opacity: 0.7
      }}>
        <p>© 2024 PhoneMarket. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
}


export default PhoneMarketApp;
