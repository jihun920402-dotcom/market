import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null); 
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // 상품 등록 관련 상태
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null); // 이미지 파일 상태 추가

  const fetchItems = () => {
    axios.get('http://localhost:8080/api/items').then(res => setItems(res.data));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/auth/login', loginData)
      .then(res => {
        setUser(res.data);
        setShowLogin(false);
      })
      .catch(() => alert("로그인 정보를 확인해주세요."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert("로그인 후 이용 가능합니다.");
    if (!name || !price || !address) return alert("모든 항목을 입력해주세요.");

    // 파일을 보낼 때는 FormData 객체를 생성해야 합니다.
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("seller", user.username);
    formData.append("address", address);
    if (image) {
      formData.append("image", image); // 파일 추가
    }

    axios.post('http://localhost:8080/api/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' } // 파일 전송을 위한 헤더 설정
    }).then(() => {
      setName(''); setPrice(''); setAddress(''); setImage(null);
      alert("매물이 등록되었습니다!");
      fetchItems();
    }).catch(err => console.error("등록 중 오류 발생:", err));
  };

  const handleDelete = (id) => {
    if(window.confirm("매물을 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8080/api/items/${id}`).then(() => fetchItems());
    }
  };

  return (
    <div style={styles.appWrapper}>
      {/* NAVIGATION BAR */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <h2 style={styles.logo} onClick={() => window.location.reload()}>RE:MARKET</h2>
          <div style={styles.navLinks}>
            {user ? (
              <div style={styles.userInfo}>
                <span style={styles.userBadge}>{user.role}</span>
                <strong style={{color: '#fff'}}>{user.username}</strong>
                <button onClick={() => setUser(null)} style={styles.logoutBtn}>Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(!showLogin)} style={styles.loginTrigger}>Sign In</button>
            )}
          </div>
        </div>
      </nav>

      <div style={styles.mainContainer}>
        {/* LOGIN FORM */}
        {!user && showLogin && (
          <div style={styles.loginBox}>
            <form onSubmit={handleLogin} style={styles.loginForm}>
              <input placeholder="ID" onChange={e => setLoginData({...loginData, username: e.target.value})} style={styles.miniInput} />
              <input type="password" placeholder="PW" onChange={e => setLoginData({...loginData, password: e.target.value})} style={styles.miniInput} />
              <button type="submit" style={styles.actionBtn}>Login</button>
            </form>
            <button onClick={() => axios.post('http://localhost:8080/api/auth/setup').then(res => {alert(res.data); fetchItems();})} style={styles.setupBtn}>시스템 초기화 및 예시 생성</button>
          </div>
        )}

        {/* HERO / REGISTER SECTION */}
        <section style={styles.heroSection}>
          <div style={styles.sectionHeader}>
            <h1 style={styles.sectionTitle}>Discover Unique Items</h1>
            <p style={styles.sectionSub}>세련된 감각의 중고 거래 플랫폼</p>
          </div>

          {user && (
            <div style={styles.registerCard}>
              <h4 style={{marginBottom: '15px', color: '#1e293b'}}>내 상품 등록</h4>
              <form onSubmit={handleSubmit} style={styles.registerForm}>
                <div style={styles.formGrid}>
                  <input placeholder="상품명" value={name} onChange={e => setName(e.target.value)} style={styles.formInput} />
                  <input type="number" placeholder="판매 가격 (원)" value={price} onChange={e => setPrice(e.target.value)} style={styles.formInput} />
                  <input placeholder="거래 희망 지역 (서울/대구 등)" value={address} onChange={e => setAddress(e.target.value)} style={styles.formInput} />
                  <div style={styles.fileBox}>
                    <label style={styles.fileLabel}>이미지 선택</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={styles.fileInput} />
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn}>Sell Now</button>
              </form>
            </div>
          )}
        </section>

        {/* PRODUCT GRID */}
        <section style={styles.listSection}>
          <h3 style={styles.listTitle}>최근 등록된 상품</h3>
          <div style={styles.grid}>
            {items.map(item => (
              <div key={item.id} style={styles.itemCard}>
                <div style={styles.cardImage}>
                  {item.imageName ? (
                    <img 
                      src={`http://localhost:8080/images/${item.imageName}`} 
                      alt="item" 
                      style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                    />
                  ) : (
                    <span style={{color: '#cbd5e1'}}>IMAGE</span>
                  )}
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.cardLocation}>{item.address}</div>
                  <h4 style={styles.cardName}>{item.name}</h4>
                  <div style={styles.cardPrice}>{item.price?.toLocaleString()} 원</div>
                  <div style={styles.cardFooter}>
                    <span style={styles.cardSeller}>@{item.seller}</span>
                    {user && (item.seller === user.username || user.role === 'ADMIN') && (
                      <button onClick={() => handleDelete(item.id)} style={styles.deleteLink}>삭제</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  appWrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' },
  nav: { backgroundColor: '#1e293b', padding: '15px 0', marginBottom: '40px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  navContent: { maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  logo: { color: '#fff', margin: 0, fontSize: '24px', letterSpacing: '2px', fontWeight: '800', cursor: 'pointer' },
  loginTrigger: { backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  userBadge: { backgroundColor: '#475569', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px' },
  logoutBtn: { background: 'none', border: '1px solid #475569', color: '#cbd5e1', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' },
  mainContainer: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
  loginBox: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', marginBottom: '20px', textAlign: 'center' },
  miniInput: { padding: '8px', marginRight: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' },
  actionBtn: { padding: '8px 20px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  setupBtn: { display: 'block', margin: '15px auto 0', background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' },
  heroSection: { marginBottom: '50px' },
  sectionHeader: { textAlign: 'center', marginBottom: '30px' },
  sectionTitle: { fontSize: '36px', color: '#0f172a', marginBottom: '10px' },
  sectionSub: { color: '#64748b', fontSize: '18px' },
  registerCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  registerForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', alignItems: 'end' },
  formInput: { padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' },
  fileBox: { display: 'flex', flexDirection: 'column', gap: '5px' },
  fileLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600' },
  fileInput: { fontSize: '12px' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  listSection: { marginTop: '40px' },
  listTitle: { fontSize: '22px', color: '#1e293b', marginBottom: '20px', borderLeft: '4px solid #6366f1', paddingLeft: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '25px' },
  itemCard: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', transition: 'transform 0.2s' },
  cardImage: { height: '200px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  cardContent: { padding: '15px' },
  cardLocation: { fontSize: '12px', color: '#6366f1', fontWeight: '600', marginBottom: '5px' },
  cardName: { fontSize: '17px', margin: '0 0 10px 0', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardPrice: { fontSize: '19px', fontWeight: '800', color: '#0f172a', marginBottom: '15px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' },
  cardSeller: { fontSize: '12px', color: '#94a3b8' },
  deleteLink: { fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }
};

export default App;