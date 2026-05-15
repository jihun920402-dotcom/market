import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8081';

const CATEGORY_LABELS = { ELECTRONICS: '전자기기', FURNITURE: '가구', CLOTHING: '의류', OTHER: '기타' };
const CATEGORY_COLOR  = { ELECTRONICS: '#3B82F6', FURNITURE: '#F59E0B', CLOTHING: '#EC4899', OTHER: '#6B7280' };

// ─── SVG 아이콘 ────────────────────────────────────────────────────────────
const IC = {
  Search: ({size=16, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  X: ({size=16, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  MapPin: ({size=13, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  User: ({size=13, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Heart: ({size=15, filled=false, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Trash: ({size=14, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
  ),
  Pencil: ({size=14, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Upload: ({size=28, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Image: ({size=40, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>
    </svg>
  ),
  Check: ({size=14, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  Tag: ({size=11, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.3-7.3a1 1 0 0 0 0-1.41Z"/><circle cx="7" cy="7" r="1" fill={color}/>
    </svg>
  ),
  ChevronDown: ({size=14, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  AlertCircle: ({size=16, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill={color}/>
    </svg>
  ),
  CheckCircle: ({size=16, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  ShoppingBag: ({size=48, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  LogOut: ({size=14, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ToggleRight: ({size=16, color='currentColor'}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill={color}/>
    </svg>
  ),
  Spinner: ({size=16}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation:'spin 0.7s linear infinite', display:'inline-block' }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
};

// ─── 전역 CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Pretendard', sans-serif; }

  @keyframes fadeInUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn    { from{opacity:0;transform:scale(0.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes shimmer    { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes heartPop   { 0%{transform:scale(1)} 35%{transform:scale(1.55)} 65%{transform:scale(0.9)} 100%{transform:scale(1)} }
  @keyframes toastSlide { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
  @keyframes toastFade  { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(60px)} }
  @keyframes spin       { to{transform:rotate(360deg)} }

  .card-lift { transition: transform 0.2s cubic-bezier(.25,.8,.25,1), box-shadow 0.2s cubic-bezier(.25,.8,.25,1); }
  .card-lift:hover { transform: translateY(-5px) !important; box-shadow: 0 20px 40px -8px rgba(15,23,42,0.14) !important; }

  .btn { transition: background 0.15s, opacity 0.15s, transform 0.12s; }
  .btn:hover { opacity: 0.88; }
  .btn:active { transform: scale(0.97); }

  .skeleton {
    background: linear-gradient(90deg, #E8EDF2 25%, #F3F6F9 50%, #E8EDF2 75%);
    background-size: 600px 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    border-radius: 6px;
  }
  .modal-enter   { animation: scaleIn  0.22s cubic-bezier(.34,1.56,.64,1); }
  .overlay-enter { animation: fadeIn   0.18s ease; }
  .toast-in      { animation: toastSlide 0.26s ease; }
  .toast-out     { animation: toastFade  0.28s ease forwards; }
  .heart-pop     { animation: heartPop 0.36s ease; }
  .card-enter    { animation: fadeInUp 0.36s ease both; }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #6366F1 !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  input::placeholder, textarea::placeholder { color: #A8B4C0; }

  .drop-active { border-color: #6366F1 !important; background: #F5F4FF !important; }

  /* 커스텀 셀렉트 */
  select { -webkit-appearance: none; appearance: none; cursor: pointer; }
`;

// ─── Toast ────────────────────────────────────────────────────────────────
const TOAST_CONFIG = {
  success: { bg:'#F0FDF4', border:'#22C55E', icon: <IC.CheckCircle size={16} color="#22C55E"/> },
  error:   { bg:'#FEF2F2', border:'#EF4444', icon: <IC.AlertCircle size={16} color="#EF4444"/> },
  warning: { bg:'#FFFBEB', border:'#F59E0B', icon: <IC.AlertCircle size={16} color="#F59E0B"/> },
  info:    { bg:'#EFF6FF', border:'#3B82F6', icon: <IC.AlertCircle size={16} color="#3B82F6"/> },
};

function ToastList({ toasts, dismiss }) {
  return (
    <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, display:'flex', flexDirection:'column', gap:'8px', pointerEvents:'none' }}>
      {toasts.map(t => {
        const cfg = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
        return (
          <div key={t.id} className={t.leaving ? 'toast-out' : 'toast-in'}
            onClick={() => dismiss(t.id)}
            style={{ display:'flex', alignItems:'flex-start', gap:'10px', background:cfg.bg,
              padding:'12px 16px', borderRadius:'12px', border:`1px solid ${cfg.border}`,
              boxShadow:'0 4px 16px rgba(0,0,0,0.1)', maxWidth:'340px',
              cursor:'pointer', pointerEvents:'all' }}>
            <span style={{ flexShrink:0, paddingTop:'1px' }}>{cfg.icon}</span>
            <span style={{ fontSize:'13px', color:'#1e293b', lineHeight:'1.45', fontWeight:'500' }}>{t.message}</span>
            <span style={{ marginLeft:'auto', paddingLeft:'8px', flexShrink:0, color:'#94A3B8' }}><IC.X size={13}/></span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background:'#fff', borderRadius:'14px', overflow:'hidden', border:'1px solid #F1F5F9' }}>
      <div className="skeleton" style={{ height:'196px', borderRadius:'0' }} />
      <div style={{ padding:'14px', display:'flex', flexDirection:'column', gap:'9px' }}>
        <div className="skeleton" style={{ height:'12px', width:'40%' }} />
        <div className="skeleton" style={{ height:'16px', width:'75%' }} />
        <div className="skeleton" style={{ height:'20px', width:'38%' }} />
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <div className="skeleton" style={{ height:'12px', width:'30%' }} />
          <div className="skeleton" style={{ height:'12px', width:'20%' }} />
        </div>
      </div>
    </div>
  );
}

// ─── 카테고리 Dot ─────────────────────────────────────────────────────────
function CategoryDot({ category, size=7 }) {
  return <span style={{ display:'inline-block', width:size, height:size, borderRadius:'50%', background: CATEGORY_COLOR[category]||'#6B7280', flexShrink:0 }} />;
}

// ─── 메인 ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Toast
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type, leaving: false }]);
    setTimeout(() => {
      setToasts(p => p.map(t => t.id === id ? { ...t, leaving: true } : t));
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 300);
    }, 3200);
  }, []);
  const dismissToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  // 인증
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab]   = useState('login');
  const [loginData, setLoginData]       = useState({ username:'', password:'' });
  const [registerData, setRegisterData] = useState({ username:'', password:'', passwordConfirm:'' });

  // 상품 목록
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput]     = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder]           = useState('latest');

  useEffect(() => {
    const t = setTimeout(() => setSearchKeyword(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // 등록 폼
  const [regName, setRegName]       = useState('');
  const [regPrice, setRegPrice]     = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regDesc, setRegDesc]       = useState('');
  const [regCategory, setRegCategory] = useState('OTHER');
  const [regImage, setRegImage]     = useState(null);
  const [regPreview, setRegPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 모달
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode]         = useState(false);
  const [editData, setEditData]         = useState({});
  const [editImage, setEditImage]       = useState(null);
  const [editPreview, setEditPreview]   = useState(null);

  // 찜
  const [wishedIds, setWishedIds] = useState(new Set());
  const [heartAnim, setHeartAnim] = useState(null);

  // 상품 조회
  const fetchItems = useCallback(() => {
    setLoading(true);
    const params = { sort: sortOrder };
    if (searchKeyword)  params.keyword  = searchKeyword;
    if (filterCategory) params.category = filterCategory;
    axios.get(`${BASE_URL}/api/items`, { params })
      .then(res => setItems(res.data))
      .catch(() => toast('상품 목록을 불러오지 못했습니다.', 'error'))
      .finally(() => setLoading(false));
  }, [searchKeyword, filterCategory, sortOrder]); // eslint-disable-line

  useEffect(() => { fetchItems(); }, [fetchItems]);

  useEffect(() => {
    if (user) axios.get(`${BASE_URL}/api/wishes/user/${user.id}`).then(r => setWishedIds(new Set(r.data)));
    else      setWishedIds(new Set());
  }, [user]);

  // 이미지 유틸
  const applyImage = (file, setImg, setPreview) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast('이미지 파일만 업로드 가능합니다.', 'error');
    if (file.size > 10 * 1024 * 1024)   return toast('10MB 이하 파일만 업로드 가능합니다.', 'warning');
    setImg(file); setPreview(URL.createObjectURL(file));
  };
  const clearImage = (setImg, setPreview) => { setImg(null); setPreview(null); };

  // 드래그 앤 드롭
  const onDrop = e => {
    e.preventDefault(); setIsDragging(false);
    applyImage(e.dataTransfer.files[0], setRegImage, setRegPreview);
  };

  // 인증
  const handleLogin = e => {
    e.preventDefault();
    axios.post(`${BASE_URL}/api/auth/login`, loginData)
      .then(res => {
        setUser(res.data); localStorage.setItem('user', JSON.stringify(res.data));
        setShowAuth(false); setLoginData({ username:'', password:'' });
        toast(`${res.data.username}님, 환영합니다!`, 'success');
      })
      .catch(err => toast(err.response?.data?.message || '로그인 정보를 확인해주세요.', 'error'));
  };

  const handleRegister = e => {
    e.preventDefault();
    if (registerData.password !== registerData.passwordConfirm) return toast('비밀번호가 일치하지 않습니다.', 'error');
    axios.post(`${BASE_URL}/api/auth/register`, { username: registerData.username, password: registerData.password })
      .then(res => {
        setUser(res.data); localStorage.setItem('user', JSON.stringify(res.data));
        setShowAuth(false); setRegisterData({ username:'', password:'', passwordConfirm:'' });
        toast('회원가입이 완료되었습니다!', 'success');
      })
      .catch(err => toast(err.response?.data?.message || '회원가입에 실패했습니다.', 'error'));
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('user'); toast('로그아웃되었습니다.', 'info'); };

  // 상품 등록
  const handleSubmit = e => {
    e.preventDefault();
    if (!user) return toast('로그인 후 이용 가능합니다.', 'warning');
    if (!regName || !regPrice || !regAddress) return toast('상품명, 가격, 지역은 필수입니다.', 'warning');
    const fd = new FormData();
    fd.append('name', regName); fd.append('price', regPrice); fd.append('seller', user.username);
    fd.append('address', regAddress); fd.append('description', regDesc); fd.append('category', regCategory);
    if (regImage) fd.append('image', regImage);
    setSubmitting(true);
    axios.post(`${BASE_URL}/api/items`, fd, { headers:{'Content-Type':'multipart/form-data'} })
      .then(() => {
        setRegName(''); setRegPrice(''); setRegAddress(''); setRegDesc(''); setRegCategory('OTHER');
        clearImage(setRegImage, setRegPreview);
        toast('상품이 등록되었습니다!', 'success'); fetchItems();
      })
      .catch(() => toast('등록 중 오류가 발생했습니다.', 'error'))
      .finally(() => setSubmitting(false));
  };

  // 삭제
  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('삭제하시겠습니까?')) return;
    axios.delete(`${BASE_URL}/api/items/${id}`).then(() => {
      fetchItems(); if (selectedItem?.id === id) setSelectedItem(null);
      toast('삭제되었습니다.', 'info');
    });
  };

  // 모달
  const openModal = item => {
    setSelectedItem(item); setEditMode(false);
    setEditData({ name:item.name, price:item.price, address:item.address, description:item.description||'', category:item.category||'OTHER' });
    clearImage(setEditImage, setEditPreview);
  };

  const handleEditSave = () => {
    const fd = new FormData();
    Object.entries(editData).forEach(([k,v]) => { if(v!=null) fd.append(k,v); });
    if (editImage) fd.append('image', editImage);
    axios.put(`${BASE_URL}/api/items/${selectedItem.id}`, fd, { headers:{'Content-Type':'multipart/form-data'} })
      .then(res => { setSelectedItem(res.data); setEditMode(false); fetchItems(); toast('수정되었습니다.', 'success'); })
      .catch(() => toast('수정 중 오류가 발생했습니다.', 'error'));
  };

  const handleStatusToggle = e => {
    e.stopPropagation();
    const next = selectedItem.status === 'SELLING' ? 'SOLD' : 'SELLING';
    const fd = new FormData(); fd.append('status', next);
    axios.put(`${BASE_URL}/api/items/${selectedItem.id}`, fd, { headers:{'Content-Type':'multipart/form-data'} })
      .then(res => { setSelectedItem(res.data); fetchItems(); toast(next==='SOLD'?'판매완료로 변경되었습니다.':'판매중으로 변경되었습니다.','success'); });
  };

  // 찜
  const handleWish = (e, id) => {
    e.stopPropagation();
    if (!user) return toast('로그인 후 이용 가능합니다.', 'warning');
    setHeartAnim(id); setTimeout(() => setHeartAnim(null), 400);
    axios.post(`${BASE_URL}/api/wishes/${id}`, { userId: user.id })
      .then(res => {
        const s = new Set(wishedIds);
        res.data.wished ? s.add(id) : s.delete(id);
        setWishedIds(s); fetchItems();
        if (selectedItem?.id === id) setSelectedItem(p => ({...p, wishCount: res.data.wishCount}));
      });
  };

  // 활성 필터
  const activeFilters = [
    ...(searchKeyword   ? [{ label:searchKeyword,                   clear:()=>{ setSearchInput(''); setSearchKeyword(''); } }] : []),
    ...(filterCategory  ? [{ label:CATEGORY_LABELS[filterCategory], clear:()=>setFilterCategory('') }] : []),
    ...(sortOrder!=='latest' ? [{ label:sortOrder==='price_asc'?'가격 낮은순':'가격 높은순', clear:()=>setSortOrder('latest') }] : []),
  ];
  const clearAll = () => { setSearchInput(''); setSearchKeyword(''); setFilterCategory(''); setSortOrder('latest'); };

  // ── 공통 인풋 스타일
  const inputStyle = { width:'100%', padding:'10px 14px', border:'1px solid #E2E8F0', borderRadius:'9px', fontSize:'14px', color:'#1E293B', background:'#fff', transition:'border-color 0.15s, box-shadow 0.15s' };
  const selectWrap = (children, style={}) => (
    <div style={{ position:'relative', ...style }}>
      {children}
      <span style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#94A3B8' }}>
        <IC.ChevronDown size={14}/>
      </span>
    </div>
  );

  return (
    <div style={{ background:'#F8FAFC', minHeight:'100vh', paddingBottom:'60px' }}>
      <ToastList toasts={toasts} dismiss={dismissToast} />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav style={{ background:'#0F172A', borderBottom:'1px solid #1E293B', position:'sticky', top:0, zIndex:200 }}>
        <div style={{ maxWidth:'1120px', margin:'0 auto', padding:'0 24px', height:'58px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span onClick={() => window.location.reload()}
            style={{ color:'#fff', fontSize:'18px', fontWeight:'800', letterSpacing:'2.5px', cursor:'pointer', userSelect:'none' }}>
            RE:MARKET
          </span>
          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ background:'#1E293B', color:'#94A3B8', fontSize:'10px', padding:'3px 9px', borderRadius:'20px', fontWeight:'600', letterSpacing:'0.5px' }}>
                {user.role}
              </span>
              <span style={{ color:'#E2E8F0', fontSize:'14px', fontWeight:'500' }}>{user.username}</span>
              <button onClick={handleLogout} className="btn"
                style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'1px solid #334155', color:'#94A3B8', padding:'6px 14px', borderRadius:'7px', cursor:'pointer', fontSize:'13px' }}>
                <IC.LogOut size={13}/> 로그아웃
              </button>
            </div>
          ) : (
            <button onClick={() => { setShowAuth(v=>!v); setAuthTab('login'); }} className="btn"
              style={{ background:'#6366F1', color:'#fff', border:'none', padding:'8px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>
              로그인
            </button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth:'1120px', margin:'0 auto', padding:'0 24px' }}>

        {/* ── AUTH PANEL ───────────────────────────────────────── */}
        {!user && showAuth && (
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:'16px', padding:'28px', marginTop:'24px', maxWidth:'400px' }}>
            {/* 탭 */}
            <div style={{ display:'flex', gap:'0', marginBottom:'22px', borderBottom:'1px solid #F1F5F9' }}>
              {[['login','로그인'],['register','회원가입']].map(([k,l]) => (
                <button key={k} onClick={()=>setAuthTab(k)} className="btn"
                  style={{ flex:1, background:'none', border:'none', borderBottom:`2px solid ${authTab===k?'#6366F1':'transparent'}`, color:authTab===k?'#6366F1':'#94A3B8', fontWeight:authTab===k?'700':'400', padding:'10px', cursor:'pointer', fontSize:'14px', marginBottom:'-1px', transition:'all 0.15s' }}>
                  {l}
                </button>
              ))}
            </div>

            {authTab === 'login' ? (
              <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <input placeholder="아이디" value={loginData.username}
                  onChange={e=>setLoginData({...loginData,username:e.target.value})} style={inputStyle} />
                <input type="password" placeholder="비밀번호" value={loginData.password}
                  onChange={e=>setLoginData({...loginData,password:e.target.value})} style={inputStyle} />
                <button type="submit" className="btn"
                  style={{ background:'#1E293B', color:'#fff', border:'none', borderRadius:'9px', padding:'11px', cursor:'pointer', fontWeight:'600', fontSize:'14px', marginTop:'4px' }}>
                  로그인
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <input placeholder="아이디" value={registerData.username}
                  onChange={e=>setRegisterData({...registerData,username:e.target.value})} style={inputStyle} />
                <input type="password" placeholder="비밀번호" value={registerData.password}
                  onChange={e=>setRegisterData({...registerData,password:e.target.value})} style={inputStyle} />
                <input type="password" placeholder="비밀번호 확인" value={registerData.passwordConfirm}
                  onChange={e=>setRegisterData({...registerData,passwordConfirm:e.target.value})} style={inputStyle} />
                <button type="submit" className="btn"
                  style={{ background:'#6366F1', color:'#fff', border:'none', borderRadius:'9px', padding:'11px', cursor:'pointer', fontWeight:'600', fontSize:'14px', marginTop:'4px' }}>
                  회원가입
                </button>
              </form>
            )}
            <button style={{ background:'none', border:'none', color:'#CBD5E1', fontSize:'12px', cursor:'pointer', marginTop:'16px', display:'block', width:'100%', textAlign:'center' }}
              onClick={() => axios.post(`${BASE_URL}/api/auth/setup`).then(r=>{ toast(r.data,'success'); fetchItems(); })}>
              예시 데이터 생성
            </button>
          </div>
        )}

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div style={{ paddingTop:'48px', marginBottom:'40px' }}>
          <h1 style={{ fontSize:'36px', fontWeight:'800', color:'#0F172A', letterSpacing:'-0.5px', marginBottom:'6px' }}>
            Discover Unique Items
          </h1>
          <p style={{ color:'#64748B', fontSize:'16px' }}>신뢰할 수 있는 중고 거래 플랫폼</p>
        </div>

        {/* ── 상품 등록 폼 ─────────────────────────────────────── */}
        {user && (
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:'16px', padding:'28px', marginBottom:'40px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
              <div style={{ width:'3px', height:'18px', background:'#6366F1', borderRadius:'2px' }}/>
              <h4 style={{ fontSize:'15px', fontWeight:'700', color:'#0F172A' }}>상품 등록</h4>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'10px' }}>
                <input placeholder="상품명 *" value={regName} onChange={e=>setRegName(e.target.value)} style={inputStyle} />
                <input type="number" placeholder="가격 (원) *" value={regPrice} onChange={e=>setRegPrice(e.target.value)} style={inputStyle} />
                <input placeholder="거래 지역 *" value={regAddress} onChange={e=>setRegAddress(e.target.value)} style={inputStyle} />
                {selectWrap(
                  <select value={regCategory} onChange={e=>setRegCategory(e.target.value)}
                    style={{ ...inputStyle, paddingRight:'34px' }}>
                    {Object.entries(CATEGORY_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                )}
              </div>

              <div style={{ position:'relative' }}>
                <textarea placeholder="상품 설명 (선택, 최대 500자)" value={regDesc}
                  onChange={e=>e.target.value.length<=500&&setRegDesc(e.target.value)}
                  style={{ ...inputStyle, resize:'vertical', minHeight:'72px' }} rows={2} />
                <span style={{ position:'absolute', bottom:'10px', right:'12px', fontSize:'11px', color:'#94A3B8' }}>
                  {regDesc.length}/500
                </span>
              </div>

              {/* 드래그 앤 드롭 */}
              <div
                onDragEnter={e=>{e.preventDefault();setIsDragging(true)}}
                onDragLeave={e=>{e.preventDefault();setIsDragging(false)}}
                onDragOver={e=>e.preventDefault()}
                onDrop={onDrop}
                className={isDragging ? 'drop-active' : ''}
                style={{ border:`2px dashed ${isDragging?'#6366F1':'#E2E8F0'}`, borderRadius:'12px', padding:'20px',
                  background:isDragging?'#F5F4FF':'#FAFAFA', transition:'all 0.18s', cursor:'pointer' }}>
                {regPreview ? (
                  <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                    <img src={regPreview} alt="preview"
                      style={{ width:'60px', height:'60px', objectFit:'cover', borderRadius:'8px', border:'1px solid #E2E8F0' }} />
                    <div>
                      <p style={{ fontSize:'13px', fontWeight:'600', color:'#334155', marginBottom:'4px' }}>{regImage?.name}</p>
                      <p style={{ fontSize:'12px', color:'#94A3B8', marginBottom:'8px' }}>{(regImage?.size/1024).toFixed(0)} KB</p>
                      <button type="button" onClick={()=>clearImage(setRegImage,setRegPreview)}
                        style={{ display:'flex', alignItems:'center', gap:'4px', background:'none', border:'1px solid #FECACA', color:'#EF4444', borderRadius:'6px', padding:'3px 10px', cursor:'pointer', fontSize:'12px' }}>
                        <IC.X size={11} color="#EF4444"/> 제거
                      </button>
                    </div>
                  </div>
                ) : (
                  <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', cursor:'pointer', width:'100%' }}>
                    <IC.Upload size={26} color="#94A3B8"/>
                    <span style={{ fontSize:'14px', color:'#64748B', fontWeight:'500' }}>이미지를 드래그하거나 클릭하여 선택</span>
                    <span style={{ fontSize:'12px', color:'#94A3B8' }}>PNG, JPG, WEBP · 최대 10MB</span>
                    <input type="file" accept="image/*" onChange={e=>applyImage(e.target.files[0],setRegImage,setRegPreview)} style={{ display:'none' }} />
                  </label>
                )}
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button type="submit" disabled={submitting} className="btn"
                  style={{ display:'flex', alignItems:'center', gap:'8px', background:'#6366F1', color:'#fff', border:'none', borderRadius:'9px', padding:'11px 24px', cursor:'pointer', fontWeight:'600', fontSize:'14px', opacity:submitting?0.65:1 }}>
                  {submitting ? <><IC.Spinner size={15}/> 등록 중...</> : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── 검색 / 필터 ──────────────────────────────────────── */}
        <div style={{ marginBottom:'20px' }}>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {/* 검색창 */}
            <div style={{ flex:1, minWidth:'200px', position:'relative', display:'flex', alignItems:'center' }}>
              <span style={{ position:'absolute', left:'13px', color:'#94A3B8', pointerEvents:'none', display:'flex' }}>
                <IC.Search size={15}/>
              </span>
              <input placeholder="상품명으로 검색" value={searchInput} onChange={e=>setSearchInput(e.target.value)}
                style={{ ...inputStyle, paddingLeft:'38px', paddingRight: searchInput?'36px':'14px' }} />
              {searchInput && (
                <button onClick={()=>{setSearchInput('');setSearchKeyword('');}} className="btn"
                  style={{ position:'absolute', right:'11px', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex', padding:'2px' }}>
                  <IC.X size={14}/>
                </button>
              )}
            </div>
            {/* 카테고리 */}
            {selectWrap(
              <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}
                style={{ ...inputStyle, paddingRight:'34px', minWidth:'130px' }}>
                <option value="">전체 카테고리</option>
                {Object.entries(CATEGORY_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            )}
            {/* 정렬 */}
            {selectWrap(
              <select value={sortOrder} onChange={e=>setSortOrder(e.target.value)}
                style={{ ...inputStyle, paddingRight:'34px', minWidth:'120px' }}>
                <option value="latest">최신순</option>
                <option value="price_asc">가격 낮은순</option>
                <option value="price_desc">가격 높은순</option>
              </select>
            )}
          </div>

          {/* 활성 필터 칩 */}
          {activeFilters.length > 0 && (
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center', marginTop:'12px' }}>
              {activeFilters.map((f,i) => (
                <button key={i} onClick={f.clear} className="btn"
                  style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 12px', background:'#EEF2FF', color:'#4F46E5', border:'1px solid #C7D2FE', borderRadius:'20px', fontSize:'12px', cursor:'pointer', fontWeight:'600' }}>
                  {f.label} <IC.X size={11} color="#4F46E5"/>
                </button>
              ))}
              <button onClick={clearAll} className="btn"
                style={{ padding:'5px 12px', background:'none', color:'#94A3B8', border:'1px solid #E2E8F0', borderRadius:'20px', fontSize:'12px', cursor:'pointer' }}>
                초기화
              </button>
            </div>
          )}
        </div>

        {/* ── 타이틀 ───────────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'baseline', gap:'8px', marginBottom:'18px' }}>
          <h2 style={{ fontSize:'18px', fontWeight:'700', color:'#0F172A' }}>상품 목록</h2>
          {!loading && items.length > 0 && (
            <span style={{ fontSize:'13px', color:'#94A3B8', fontWeight:'400' }}>{items.length}개</span>
          )}
        </div>

        {/* ── 그리드 ───────────────────────────────────────────── */}
        {loading ? (
          <div style={gridStyle}>{Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}</div>

        ) : items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
            <IC.ShoppingBag size={52} color="#CBD5E1"/>
            <p style={{ fontSize:'17px', fontWeight:'700', color:'#334155' }}>상품이 없습니다</p>
            <p style={{ fontSize:'14px', color:'#94A3B8' }}>
              {activeFilters.length>0 ? '다른 검색어나 필터를 사용해보세요.' : '첫 번째 상품을 등록해보세요.'}
            </p>
            {activeFilters.length>0 && (
              <button onClick={clearAll} className="btn"
                style={{ marginTop:'4px', padding:'10px 22px', background:'#6366F1', color:'#fff', border:'none', borderRadius:'9px', cursor:'pointer', fontSize:'14px', fontWeight:'600' }}>
                필터 초기화
              </button>
            )}
          </div>

        ) : (
          <div style={gridStyle}>
            {items.map((item, idx) => (
              <div key={item.id} className="card-lift card-enter"
                style={{ background:'#fff', borderRadius:'14px', overflow:'hidden', border:'1px solid #F1F5F9', position:'relative', animationDelay:`${idx*0.04}s` }}
                onClick={() => openModal(item)}>

                {/* 이미지 */}
                <div style={{ height:'196px', background:'#F8FAFC', position:'relative', overflow:'hidden' }}>
                  {item.imageName ? (
                    <img src={`${BASE_URL}/images/${item.imageName}`} alt={item.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.3s' }} loading="lazy" />
                  ) : (
                    <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                      <IC.Image size={36} color="#CBD5E1"/>
                      <span style={{ fontSize:'11px', color:'#CBD5E1' }}>이미지 없음</span>
                    </div>
                  )}
                  {item.status === 'SOLD' && (
                    <div style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.55)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ color:'#fff', fontWeight:'800', fontSize:'15px', letterSpacing:'1.5px', border:'2px solid rgba(255,255,255,0.6)', padding:'5px 14px', borderRadius:'6px' }}>
                        SOLD
                      </span>
                    </div>
                  )}
                </div>

                {/* 카드 내용 */}
                <div style={{ padding:'14px' }}>
                  {/* 카테고리 */}
                  <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'7px' }}>
                    <CategoryDot category={item.category}/>
                    <span style={{ fontSize:'11px', color:'#64748B', fontWeight:'500' }}>
                      {CATEGORY_LABELS[item.category]||'기타'}
                    </span>
                  </div>
                  {/* 상품명 */}
                  <p style={{ fontSize:'15px', fontWeight:'600', color:'#0F172A', marginBottom:'5px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {item.name}
                  </p>
                  {/* 가격 */}
                  <p style={{ fontSize:'17px', fontWeight:'800', color:'#0F172A', marginBottom:'10px' }}>
                    {item.price?.toLocaleString()}<span style={{ fontSize:'13px', fontWeight:'500', color:'#64748B', marginLeft:'2px' }}>원</span>
                  </p>
                  {/* 푸터 */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'10px', borderTop:'1px solid #F1F5F9' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'4px', color:'#94A3B8' }}>
                      <IC.MapPin size={12} color="#94A3B8"/>
                      <span style={{ fontSize:'12px' }}>{item.address}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <button onClick={e=>handleWish(e,item.id)}
                        className={heartAnim===item.id ? 'heart-pop' : ''}
                        style={{ display:'flex', alignItems:'center', gap:'4px', background:'none', border:'none', cursor:'pointer', fontSize:'12px', color: wishedIds.has(item.id)?'#E11D48':'#94A3B8', fontWeight:'600', padding:'2px' }}>
                        <IC.Heart size={14} filled={wishedIds.has(item.id)} color={wishedIds.has(item.id)?'#E11D48':'#94A3B8'}/>
                        {item.wishCount||0}
                      </button>
                      {user && (item.seller===user.username || user.role==='ADMIN') && (
                        <button onClick={e=>handleDelete(e,item.id)} className="btn"
                          style={{ display:'flex', alignItems:'center', background:'none', border:'none', cursor:'pointer', color:'#CBD5E1', padding:'2px' }}>
                          <IC.Trash size={13} color="#CBD5E1"/>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 상세 / 수정 모달 ──────────────────────────────────────── */}
      {selectedItem && (
        <div className="overlay-enter"
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', backdropFilter:'blur(2px)' }}
          onClick={() => setSelectedItem(null)}>
          <div className="modal-enter"
            style={{ background:'#fff', borderRadius:'20px', width:'100%', maxWidth:'820px', maxHeight:'88vh', overflowY:'auto', position:'relative' }}
            onClick={e=>e.stopPropagation()}>

            {/* 닫기 */}
            <button onClick={()=>setSelectedItem(null)} className="btn"
              style={{ position:'absolute', top:'14px', right:'14px', zIndex:1, width:'32px', height:'32px', borderRadius:'50%', background:'rgba(0,0,0,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#475569' }}>
              <IC.X size={15}/>
            </button>

            <div style={{ display:'flex' }}>
              {/* 이미지 패널 */}
              <div style={{ width:'44%', minHeight:'320px', flexShrink:0, background:'#F1F5F9', borderRadius:'20px 0 0 20px', overflow:'hidden', position:'relative' }}>
                {selectedItem.imageName ? (
                  <img src={`${BASE_URL}/images/${selectedItem.imageName}`} alt={selectedItem.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                ) : (
                  <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <IC.Image size={52} color="#CBD5E1"/>
                  </div>
                )}
                {selectedItem.status==='SOLD' && (
                  <div style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.55)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ color:'#fff', fontWeight:'800', fontSize:'18px', letterSpacing:'2px', border:'2px solid rgba(255,255,255,0.6)', padding:'6px 18px', borderRadius:'6px' }}>SOLD</span>
                  </div>
                )}
              </div>

              {/* 정보 패널 */}
              <div style={{ flex:1, padding:'30px', display:'flex', flexDirection:'column' }}>
                {!editMode ? (
                  <>
                    {/* 배지들 */}
                    <div style={{ display:'flex', gap:'7px', flexWrap:'wrap', marginBottom:'14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'5px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:'20px', padding:'4px 11px' }}>
                        <CategoryDot category={selectedItem.category}/>
                        <span style={{ fontSize:'12px', color:'#64748B', fontWeight:'500' }}>{CATEGORY_LABELS[selectedItem.category]||'기타'}</span>
                      </div>
                      <div style={{ background: selectedItem.status==='SOLD'?'#FEF2F2':'#F0FDF4', border:`1px solid ${selectedItem.status==='SOLD'?'#FECACA':'#BBF7D0'}`, borderRadius:'20px', padding:'4px 11px' }}>
                        <span style={{ fontSize:'12px', fontWeight:'600', color:selectedItem.status==='SOLD'?'#EF4444':'#16A34A' }}>
                          {selectedItem.status==='SOLD'?'판매완료':'판매중'}
                        </span>
                      </div>
                    </div>

                    <h2 style={{ fontSize:'22px', fontWeight:'800', color:'#0F172A', marginBottom:'8px', lineHeight:'1.3' }}>{selectedItem.name}</h2>
                    <p style={{ fontSize:'26px', fontWeight:'800', color:'#6366F1', marginBottom:'18px' }}>
                      {selectedItem.price?.toLocaleString()}<span style={{ fontSize:'15px', fontWeight:'500', color:'#94A3B8', marginLeft:'3px' }}>원</span>
                    </p>

                    <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'7px', color:'#64748B', fontSize:'13px' }}>
                        <IC.MapPin size={14} color="#94A3B8"/>{selectedItem.address}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'7px', color:'#64748B', fontSize:'13px' }}>
                        <IC.User size={14} color="#94A3B8"/>@{selectedItem.seller}
                      </div>
                    </div>

                    {selectedItem.description && (
                      <p style={{ fontSize:'14px', color:'#475569', lineHeight:'1.75', background:'#F8FAFC', border:'1px solid #F1F5F9', padding:'12px 14px', borderRadius:'10px', marginBottom:'16px', whiteSpace:'pre-wrap' }}>
                        {selectedItem.description}
                      </p>
                    )}

                    {/* 액션 */}
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'auto' }}>
                      <button onClick={e=>handleWish(e,selectedItem.id)}
                        className={(heartAnim===selectedItem.id?'heart-pop ':'')+' btn'}
                        style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 18px',
                          border:`1px solid ${wishedIds.has(selectedItem.id)?'#FECDD3':'#E2E8F0'}`,
                          background:wishedIds.has(selectedItem.id)?'#FFF1F2':'#fff',
                          color:wishedIds.has(selectedItem.id)?'#E11D48':'#64748B',
                          borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>
                        <IC.Heart size={15} filled={wishedIds.has(selectedItem.id)} color={wishedIds.has(selectedItem.id)?'#E11D48':'#94A3B8'}/>
                        찜하기 ({selectedItem.wishCount||0})
                      </button>

                      {user && (selectedItem.seller===user.username || user.role==='ADMIN') && (
                        <>
                          <button onClick={()=>setEditMode(true)} className="btn"
                            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 16px', background:'#6366F1', color:'#fff', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>
                            <IC.Pencil size={13} color="#fff"/> 수정
                          </button>
                          <button onClick={handleStatusToggle} className="btn"
                            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 16px', background:'#F8FAFC', color:'#475569', border:'1px solid #E2E8F0', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>
                            <IC.ToggleRight size={15} color="#6366F1"/>
                            {selectedItem.status==='SELLING'?'판매완료 처리':'판매중으로 변경'}
                          </button>
                          <button onClick={e=>handleDelete(e,selectedItem.id)} className="btn"
                            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 16px', background:'#FEF2F2', color:'#EF4444', border:'1px solid #FECACA', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>
                            <IC.Trash size={13} color="#EF4444"/> 삭제
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#0F172A', marginBottom:'18px', display:'flex', alignItems:'center', gap:'7px' }}>
                      <IC.Pencil size={15} color="#6366F1"/> 상품 수정
                    </h3>
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                      <input value={editData.name}    onChange={e=>setEditData({...editData,name:e.target.value})}    style={inputStyle} placeholder="상품명" />
                      <input type="number" value={editData.price} onChange={e=>setEditData({...editData,price:e.target.value})} style={inputStyle} placeholder="가격" />
                      <input value={editData.address} onChange={e=>setEditData({...editData,address:e.target.value})} style={inputStyle} placeholder="지역" />
                      {selectWrap(
                        <select value={editData.category} onChange={e=>setEditData({...editData,category:e.target.value})}
                          style={{ ...inputStyle, paddingRight:'34px' }}>
                          {Object.entries(CATEGORY_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                        </select>
                      )}
                      <textarea value={editData.description} onChange={e=>setEditData({...editData,description:e.target.value})}
                        style={{ ...inputStyle, resize:'vertical', minHeight:'72px' }} placeholder="상품 설명" rows={3} />
                      <div style={{ border:'2px dashed #E2E8F0', borderRadius:'10px', padding:'12px 14px' }}>
                        {editPreview ? (
                          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <img src={editPreview} alt="preview" style={{ width:'52px', height:'52px', objectFit:'cover', borderRadius:'7px', border:'1px solid #E2E8F0' }} />
                            <button type="button" onClick={()=>clearImage(setEditImage,setEditPreview)}
                              style={{ display:'flex', alignItems:'center', gap:'4px', background:'none', border:'1px solid #FECACA', color:'#EF4444', borderRadius:'6px', padding:'3px 10px', cursor:'pointer', fontSize:'12px' }}>
                              <IC.X size={11} color="#EF4444"/> 제거
                            </button>
                          </div>
                        ) : (
                          <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', color:'#64748B', fontSize:'13px' }}>
                            <IC.Upload size={16} color="#94A3B8"/> 이미지 변경 (선택)
                            <input type="file" accept="image/*" onChange={e=>applyImage(e.target.files[0],setEditImage,setEditPreview)} style={{ display:'none' }} />
                          </label>
                        )}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
                      <button onClick={handleEditSave} className="btn"
                        style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', background:'#6366F1', color:'#fff', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
                        <IC.Check size={14} color="#fff"/> 저장
                      </button>
                      <button onClick={()=>{ setEditMode(false); clearImage(setEditImage,setEditPreview); }} className="btn"
                        style={{ padding:'10px 20px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:'9px', cursor:'pointer', fontSize:'14px' }}>
                        취소
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const gridStyle = { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'18px' };
