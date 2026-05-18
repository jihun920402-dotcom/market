import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8081';
const MINT = '#00C2A8';
const NAVY = '#0F2B4A';

const CATEGORY_LABELS = { ELECTRONICS: '전자기기', FURNITURE: '가구', CLOTHING: '의류', OTHER: '기타' };
const CATEGORY_ICONS  = { ELECTRONICS: '💻', FURNITURE: '🪑', CLOTHING: '👕', OTHER: '📦' };

const IC = {
  Search: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  X: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  MapPin: ({size=13,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Heart: ({size=15,filled=false,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Trash: ({size=14,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Pencil: ({size=14,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Upload: ({size=28,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Image: ({size=40,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>,
  Check: ({size=14,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  ChevronDown: ({size=14,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  AlertCircle: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill={color}/></svg>,
  CheckCircle: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  ShoppingBag: ({size=48,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  LogOut: ({size=14,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ToggleRight: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill={color}/></svg>,
  Plus: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  Spinner: ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin 0.7s linear infinite',display:'inline-block'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Moon: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun: ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
};

const buildCSS = (dark) => `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background: ${dark ? '#0D1B2A' : '#F4F6F9'}; }

  @keyframes fadeInUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn    { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes shimmer    { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes heartPop   { 0%{transform:scale(1)} 35%{transform:scale(1.6)} 65%{transform:scale(0.9)} 100%{transform:scale(1)} }
  @keyframes toastSlide { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
  @keyframes toastFade  { from{opacity:1} to{opacity:0;transform:translateX(60px)} }
  @keyframes spin       { to{transform:rotate(360deg)} }

  .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,${dark ? '0.4' : '0.12'}) !important; }
  .card-hover:hover .card-img-scale { transform: scale(1.05); }
  .card-img-scale { transition: transform 0.35s ease; width: 100%; height: 100%; object-fit: cover; display: block; }

  .card-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(15,43,74,0.93) 0%, rgba(15,43,74,0.55) 60%, transparent 100%);
    padding: 16px 12px 10px;
    transform: translateY(100%); opacity: 0;
    transition: transform 0.28s ease, opacity 0.28s ease;
  }
  .card-hover:hover .card-overlay { opacity: 1; transform: translateY(0); }

  .img-sold { filter: grayscale(100%); }

  .btn { transition: background 0.13s, opacity 0.13s, transform 0.1s; border: none; cursor: pointer; }
  .btn:hover { opacity: 0.88; }
  .btn:active { transform: scale(0.97); }

  .skeleton {
    background: linear-gradient(90deg, ${dark ? '#1A2F4A 25%, #1E3A5F 50%, #1A2F4A 75%' : '#ECEEF2 25%, #F5F6F8 50%, #ECEEF2 75%'});
    background-size: 600px 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: 8px;
  }

  .modal-enter   { animation: scaleIn 0.2s cubic-bezier(.34,1.56,.64,1); }
  .overlay-enter { animation: fadeIn 0.15s ease; }
  .toast-in      { animation: toastSlide 0.24s ease; }
  .toast-out     { animation: toastFade 0.24s ease forwards; }
  .heart-pop     { animation: heartPop 0.34s ease; }
  .card-enter    { animation: fadeInUp 0.3s ease both; }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: ${MINT} !important;
    box-shadow: 0 0 0 3px rgba(0,194,168,0.18);
  }
  input::placeholder, textarea::placeholder { color: #6B7280; }

  .tab-btn {
    padding: 9px 18px; border-radius: 24px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; border: 2px solid transparent;
    background: ${dark ? '#132236' : '#F0F2F5'}; color: ${dark ? '#94A3B8' : '#6B7280'};
    white-space: nowrap; flex-shrink: 0;
  }
  .tab-btn:hover { background: ${dark ? '#1A3A52' : '#D6F5F1'}; color: ${MINT}; }
  .tab-btn.active { background: ${MINT}; color: #fff; border-color: ${MINT}; }

  .sort-btn {
    padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.13s;
    border: 1.5px solid ${dark ? '#1E3A5F' : '#E5E7EB'};
    background: ${dark ? '#132236' : '#fff'}; color: ${dark ? '#94A3B8' : '#6B7280'};
  }
  .sort-btn.active { background: ${MINT}; color: #fff; border-color: ${MINT}; }
  .sort-btn:hover:not(.active) { border-color: ${MINT}; color: ${MINT}; }

  select { -webkit-appearance: none; appearance: none; cursor: pointer; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${dark ? '#1E3A5F' : '#D1D5DB'}; border-radius: 3px; }
  .tab-bar-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; }
  .tab-bar-scroll::-webkit-scrollbar { height: 0; }
`;

const TOAST_CONFIG = {
  success: { bg:'#F0FDF4', border:'#22C55E', icon: <IC.CheckCircle size={16} color="#22C55E"/> },
  error:   { bg:'#FEF2F2', border:'#EF4444', icon: <IC.AlertCircle size={16} color="#EF4444"/> },
  warning: { bg:'#FFFBEB', border:'#F59E0B', icon: <IC.AlertCircle size={16} color="#F59E0B"/> },
  info:    { bg:'#EFF6FF', border:'#3B82F6', icon: <IC.AlertCircle size={16} color="#3B82F6"/> },
};

function ToastList({ toasts, dismiss }) {
  return (
    <div style={{position:'fixed',top:'20px',right:'20px',zIndex:9999,display:'flex',flexDirection:'column',gap:'8px',pointerEvents:'none'}}>
      {toasts.map(t => {
        const cfg = TOAST_CONFIG[t.type]||TOAST_CONFIG.info;
        return (
          <div key={t.id} className={t.leaving?'toast-out':'toast-in'} onClick={()=>dismiss(t.id)}
            style={{display:'flex',alignItems:'flex-start',gap:'10px',background:cfg.bg,padding:'12px 16px',borderRadius:'12px',border:`1px solid ${cfg.border}`,boxShadow:'0 4px 16px rgba(0,0,0,0.10)',maxWidth:'320px',cursor:'pointer',pointerEvents:'all'}}>
            <span style={{flexShrink:0,paddingTop:'1px'}}>{cfg.icon}</span>
            <span style={{fontSize:'13px',color:'#1e293b',lineHeight:'1.45',fontWeight:'500'}}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonCard({ dark }) {
  const bg = dark ? '#132236' : '#fff';
  const bdr = dark ? '#1A2F4A' : '#F0F0F0';
  return (
    <div style={{background:bg,borderRadius:'16px',overflow:'hidden',border:`1px solid ${bdr}`}}>
      <div style={{position:'relative',paddingBottom:'100%'}}>
        <div className="skeleton" style={{position:'absolute',inset:0,borderRadius:'0'}}/>
      </div>
      <div style={{padding:'12px 14px 14px',display:'flex',flexDirection:'column',gap:'7px'}}>
        <div className="skeleton" style={{height:'11px',width:'30%'}}/>
        <div className="skeleton" style={{height:'14px',width:'65%'}}/>
        <div className="skeleton" style={{height:'20px',width:'40%'}}/>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <div className="skeleton" style={{height:'11px',width:'35%'}}/>
          <div className="skeleton" style={{height:'11px',width:'12%'}}/>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = buildCSS(dark);
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [dark]);

  const C = {
    bg:        dark ? '#0D1B2A' : '#F4F6F9',
    cardBg:    dark ? '#132236' : '#fff',
    navBg:     dark ? '#0A1628' : '#fff',
    navBdr:    dark ? '#1A2F4A' : '#F0F0F0',
    text:      dark ? '#F1F5F9' : NAVY,
    textSub:   dark ? '#CBD5E1' : '#374151',
    textMuted: dark ? '#64748B' : '#9CA3AF',
    border:    dark ? '#1E3A5F' : '#E5E7EB',
    inputBg:   dark ? '#132236' : '#fff',
    inputBdr:  dark ? '#1E3A5F' : '#E5E7EB',
    cardBdr:   dark ? '#1A2F4A' : '#F0F0F0',
    metaBg:    dark ? '#1A2F4A' : '#F9FAFB',
  };

  const inputStyle = {
    width:'100%', padding:'10px 14px', fontSize:'14px',
    border:`1px solid ${C.inputBdr}`, borderRadius:'10px',
    color:C.text, background:C.inputBg,
    transition:'border-color 0.15s, box-shadow 0.15s',
  };

  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type='info') => {
    const id = Date.now()+Math.random();
    setToasts(p=>[...p,{id,message,type,leaving:false}]);
    setTimeout(()=>{
      setToasts(p=>p.map(t=>t.id===id?{...t,leaving:true}:t));
      setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),280);
    },3200);
  },[]);
  const dismissToast = useCallback(id=>setToasts(p=>p.filter(t=>t.id!==id)),[]);

  const [user,setUser] = useState(()=>{ try{return JSON.parse(localStorage.getItem('user'));}catch{return null;} });
  const [showAuth,setShowAuth] = useState(false);
  const [authTab,setAuthTab] = useState('login');
  const [loginData,setLoginData] = useState({username:'',password:''});
  const [registerData,setRegisterData] = useState({username:'',password:'',passwordConfirm:''});

  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [searchInput,setSearchInput] = useState('');
  const [searchKeyword,setSearchKeyword] = useState('');
  const [filterCategory,setFilterCategory] = useState('');
  const [sortOrder,setSortOrder] = useState('latest');

  useEffect(()=>{ const t=setTimeout(()=>setSearchKeyword(searchInput),300); return()=>clearTimeout(t); },[searchInput]);

  const [showRegForm,setShowRegForm] = useState(false);
  const [regName,setRegName] = useState('');
  const [regPrice,setRegPrice] = useState('');
  const [regAddress,setRegAddress] = useState('');
  const [regDesc,setRegDesc] = useState('');
  const [regCategory,setRegCategory] = useState('OTHER');
  const [regImage,setRegImage] = useState(null);
  const [regPreview,setRegPreview] = useState(null);
  const [isDragging,setIsDragging] = useState(false);
  const [submitting,setSubmitting] = useState(false);

  const [selectedItem,setSelectedItem] = useState(null);
  const [editMode,setEditMode] = useState(false);
  const [editData,setEditData] = useState({});
  const [editImage,setEditImage] = useState(null);
  const [editPreview,setEditPreview] = useState(null);

  const [wishedIds,setWishedIds] = useState(new Set());
  const [heartAnim,setHeartAnim] = useState(null);

  const fetchItems = useCallback(()=>{
    setLoading(true);
    const params={sort:sortOrder};
    if(searchKeyword) params.keyword=searchKeyword;
    if(filterCategory) params.category=filterCategory;
    axios.get(`${BASE_URL}/api/items`,{params})
      .then(res=>setItems(res.data))
      .catch(()=>toast('상품 목록을 불러오지 못했습니다.','error'))
      .finally(()=>setLoading(false));
  },[searchKeyword,filterCategory,sortOrder]); // eslint-disable-line

  useEffect(()=>{fetchItems();},[fetchItems]);
  useEffect(()=>{
    if(user) axios.get(`${BASE_URL}/api/wishes/user/${user.id}`).then(r=>setWishedIds(new Set(r.data)));
    else setWishedIds(new Set());
  },[user]);

  const applyImage=(file,setImg,setPreview)=>{
    if(!file) return;
    if(!file.type.startsWith('image/')) return toast('이미지 파일만 업로드 가능합니다.','error');
    if(file.size>10*1024*1024) return toast('10MB 이하 파일만 가능합니다.','warning');
    setImg(file); setPreview(URL.createObjectURL(file));
  };
  const clearImage=(setImg,setPreview)=>{setImg(null);setPreview(null);};
  const onDrop=e=>{e.preventDefault();setIsDragging(false);applyImage(e.dataTransfer.files[0],setRegImage,setRegPreview);};

  const handleLogin=e=>{
    e.preventDefault();
    axios.post(`${BASE_URL}/api/auth/login`,loginData)
      .then(res=>{setUser(res.data);localStorage.setItem('user',JSON.stringify(res.data));setShowAuth(false);setLoginData({username:'',password:''});toast(`${res.data.username}님, 환영합니다!`,'success');})
      .catch(err=>toast(err.response?.data?.message||'로그인 정보를 확인해주세요.','error'));
  };
  const handleRegister=e=>{
    e.preventDefault();
    if(registerData.password!==registerData.passwordConfirm) return toast('비밀번호가 일치하지 않습니다.','error');
    axios.post(`${BASE_URL}/api/auth/register`,{username:registerData.username,password:registerData.password})
      .then(res=>{setUser(res.data);localStorage.setItem('user',JSON.stringify(res.data));setShowAuth(false);setRegisterData({username:'',password:'',passwordConfirm:''});toast('회원가입 완료!','success');})
      .catch(err=>toast(err.response?.data?.message||'회원가입에 실패했습니다.','error'));
  };
  const handleLogout=()=>{setUser(null);localStorage.removeItem('user');toast('로그아웃되었습니다.','info');};

  const handleSubmit=e=>{
    e.preventDefault();
    if(!user) return toast('로그인 후 이용 가능합니다.','warning');
    if(!regName||!regPrice||!regAddress) return toast('상품명, 가격, 지역은 필수입니다.','warning');
    const fd=new FormData();
    fd.append('name',regName);fd.append('price',regPrice);fd.append('seller',user.username);
    fd.append('address',regAddress);fd.append('description',regDesc);fd.append('category',regCategory);
    if(regImage) fd.append('image',regImage);
    setSubmitting(true);
    axios.post(`${BASE_URL}/api/items`,fd,{headers:{'Content-Type':'multipart/form-data'}})
      .then(()=>{setRegName('');setRegPrice('');setRegAddress('');setRegDesc('');setRegCategory('OTHER');clearImage(setRegImage,setRegPreview);setShowRegForm(false);toast('상품이 등록되었습니다!','success');fetchItems();})
      .catch(()=>toast('등록 중 오류가 발생했습니다.','error'))
      .finally(()=>setSubmitting(false));
  };

  const handleDelete=(e,id)=>{
    e.stopPropagation();
    if(!window.confirm('삭제하시겠습니까?')) return;
    axios.delete(`${BASE_URL}/api/items/${id}`).then(()=>{fetchItems();if(selectedItem?.id===id)setSelectedItem(null);toast('삭제되었습니다.','info');});
  };

  const openModal=item=>{
    setSelectedItem(item);setEditMode(false);
    setEditData({name:item.name,price:item.price,address:item.address,description:item.description||'',category:item.category||'OTHER'});
    clearImage(setEditImage,setEditPreview);
  };

  const handleEditSave=()=>{
    const fd=new FormData();
    Object.entries(editData).forEach(([k,v])=>{if(v!=null)fd.append(k,v);});
    if(editImage) fd.append('image',editImage);
    axios.put(`${BASE_URL}/api/items/${selectedItem.id}`,fd,{headers:{'Content-Type':'multipart/form-data'}})
      .then(res=>{setSelectedItem(res.data);setEditMode(false);fetchItems();toast('수정되었습니다.','success');})
      .catch(()=>toast('수정 중 오류가 발생했습니다.','error'));
  };

  const handleStatusToggle=e=>{
    e.stopPropagation();
    const next=selectedItem.status==='SELLING'?'SOLD':'SELLING';
    const fd=new FormData();fd.append('status',next);
    axios.put(`${BASE_URL}/api/items/${selectedItem.id}`,fd,{headers:{'Content-Type':'multipart/form-data'}})
      .then(res=>{setSelectedItem(res.data);fetchItems();toast(next==='SOLD'?'판매완료로 변경!':'판매중으로 변경!','success');});
  };

  const handleWish=(e,id)=>{
    e.stopPropagation();
    if(!user) return toast('로그인 후 이용 가능합니다.','warning');
    setHeartAnim(id);setTimeout(()=>setHeartAnim(null),400);
    axios.post(`${BASE_URL}/api/wishes/${id}`,{userId:user.id})
      .then(res=>{const s=new Set(wishedIds);res.data.wished?s.add(id):s.delete(id);setWishedIds(s);fetchItems();if(selectedItem?.id===id)setSelectedItem(p=>({...p,wishCount:res.data.wishCount}));});
  };

  const canManage=(item)=>user&&(item.seller===user.username||user.role==='ADMIN');

  return (
    <div style={{background:C.bg,minHeight:'100vh'}}>
      <ToastList toasts={toasts} dismiss={dismissToast}/>

      {/* NAV */}
      <nav style={{background:C.navBg,borderBottom:`1px solid ${C.navBdr}`,position:'sticky',top:0,zIndex:200,boxShadow:dark?'none':'0 1px 8px rgba(0,0,0,0.05)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 24px',height:'60px',display:'flex',alignItems:'center',gap:'16px'}}>

          {/* 로고 */}
          <div onClick={()=>window.location.reload()} style={{display:'flex',alignItems:'center',gap:'9px',cursor:'pointer',flexShrink:0,minWidth:'150px'}}>
            <div style={{width:'32px',height:'32px',background:`linear-gradient(135deg,${NAVY},#1A4A7A)`,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>♻️</div>
            <span style={{fontSize:'18px',fontWeight:'900',letterSpacing:'-0.5px',color:C.text}}>
              RE<span style={{color:MINT}}>:</span>MARKET
            </span>
          </div>

          {/* 검색창 (중앙) */}
          <div style={{flex:1,position:'relative',display:'flex',alignItems:'center'}}>
            <span style={{position:'absolute',left:'16px',color:C.textMuted,pointerEvents:'none',display:'flex'}}><IC.Search size={16}/></span>
            <input placeholder="어떤 물건을 찾고 계세요?" value={searchInput} onChange={e=>setSearchInput(e.target.value)}
              style={{...inputStyle,paddingLeft:'46px',paddingRight:searchInput?'40px':'16px',borderRadius:'28px',boxShadow:dark?'none':'0 1px 4px rgba(0,0,0,0.06)'}}/>
            {searchInput&&(
              <button onClick={()=>{setSearchInput('');setSearchKeyword('');}} className="btn"
                style={{position:'absolute',right:'14px',background:'none',border:'none',cursor:'pointer',color:C.textMuted,display:'flex',padding:'2px'}}>
                <IC.X size={14}/>
              </button>
            )}
          </div>

          {/* 우측 컨트롤 */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',flexShrink:0,minWidth:'150px',justifyContent:'flex-end'}}>
            <button onClick={()=>setDark(d=>!d)} className="btn"
              style={{width:'36px',height:'36px',borderRadius:'50%',background:dark?'#1A2F4A':'#F3F4F6',border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {dark?<IC.Sun size={16} color="#F59E0B"/>:<IC.Moon size={16} color={NAVY}/>}
            </button>
            {user ? (
              <>
                <button onClick={()=>setShowRegForm(v=>!v)} className="btn"
                  style={{display:'flex',alignItems:'center',gap:'6px',background:MINT,color:'#fff',borderRadius:'10px',padding:'8px 16px',fontWeight:'700',fontSize:'13px'}}>
                  <IC.Plus size={15} color="#fff"/> 판매하기
                </button>
                <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                  <div style={{width:'30px',height:'30px',borderRadius:'50%',background:`linear-gradient(135deg,${NAVY},#1A4A7A)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px',fontWeight:'700'}}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <span style={{fontSize:'13px',fontWeight:'600',color:C.text}}>{user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn"
                  style={{display:'flex',alignItems:'center',gap:'5px',background:'none',border:`1px solid ${C.border}`,color:C.textMuted,padding:'7px 12px',borderRadius:'9px',fontSize:'13px'}}>
                  <IC.LogOut size={13}/> 로그아웃
                </button>
              </>
            ) : (
              <>
                <button onClick={()=>{setShowAuth(v=>!v);setAuthTab('login');}} className="btn"
                  style={{background:'none',border:`1px solid ${C.border}`,color:C.textSub,padding:'8px 18px',borderRadius:'10px',fontWeight:'600',fontSize:'13px'}}>
                  로그인
                </button>
                <button onClick={()=>{setShowAuth(v=>!v);setAuthTab('register');}} className="btn"
                  style={{background:MINT,color:'#fff',padding:'8px 18px',borderRadius:'10px',fontWeight:'700',fontSize:'13px'}}>
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* AUTH 드롭다운 */}
      {!user&&showAuth&&(
        <div style={{position:'fixed',top:'70px',right:'24px',zIndex:300,background:C.cardBg,border:`1px solid ${C.cardBdr}`,borderRadius:'16px',padding:'24px',width:'320px',boxShadow:'0 16px 48px rgba(0,0,0,0.15)'}} className="modal-enter">
          <div style={{display:'flex',marginBottom:'20px',borderBottom:`2px solid ${C.border}`}}>
            {[['login','로그인'],['register','회원가입']].map(([k,l])=>(
              <button key={k} onClick={()=>setAuthTab(k)} className="btn"
                style={{flex:1,background:'none',border:'none',borderBottom:`2px solid ${authTab===k?MINT:'transparent'}`,color:authTab===k?MINT:C.textMuted,fontWeight:authTab===k?'700':'400',padding:'10px',cursor:'pointer',fontSize:'14px',marginBottom:'-2px',transition:'all 0.15s'}}>
                {l}
              </button>
            ))}
          </div>
          {authTab==='login'?(
            <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <input placeholder="아이디" value={loginData.username} onChange={e=>setLoginData({...loginData,username:e.target.value})} style={inputStyle}/>
              <input type="password" placeholder="비밀번호" value={loginData.password} onChange={e=>setLoginData({...loginData,password:e.target.value})} style={inputStyle}/>
              <button type="submit" className="btn" style={{background:NAVY,color:'#fff',borderRadius:'10px',padding:'11px',fontWeight:'700',fontSize:'14px',marginTop:'2px'}}>로그인</button>
            </form>
          ):(
            <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <input placeholder="아이디" value={registerData.username} onChange={e=>setRegisterData({...registerData,username:e.target.value})} style={inputStyle}/>
              <input type="password" placeholder="비밀번호" value={registerData.password} onChange={e=>setRegisterData({...registerData,password:e.target.value})} style={inputStyle}/>
              <input type="password" placeholder="비밀번호 확인" value={registerData.passwordConfirm} onChange={e=>setRegisterData({...registerData,passwordConfirm:e.target.value})} style={inputStyle}/>
              <button type="submit" className="btn" style={{background:MINT,color:'#fff',borderRadius:'10px',padding:'11px',fontWeight:'700',fontSize:'14px',marginTop:'2px'}}>회원가입</button>
            </form>
          )}
          <button style={{background:'none',border:'none',color:C.textMuted,fontSize:'12px',cursor:'pointer',marginTop:'14px',display:'block',width:'100%',textAlign:'center'}}
            onClick={()=>axios.post(`${BASE_URL}/api/auth/setup`).then(r=>{toast(r.data,'success');fetchItems();})}>
            예시 데이터 생성
          </button>
        </div>
      )}

      {/* 카테고리 탭바 */}
      <div style={{background:C.navBg,borderBottom:`1px solid ${C.navBdr}`,position:'sticky',top:'60px',zIndex:190}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 24px'}}>
          <div className="tab-bar-scroll">
            <button className={`tab-btn${filterCategory===''?' active':''}`} onClick={()=>setFilterCategory('')}>🏠 전체</button>
            {Object.entries(CATEGORY_LABELS).map(([v,l])=>(
              <button key={v} className={`tab-btn${filterCategory===v?' active':''}`} onClick={()=>setFilterCategory(v)}>
                {CATEGORY_ICONS[v]} {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 등록 패널 */}
      {user&&showRegForm&&(
        <div style={{background:C.navBg,borderBottom:`1px solid ${C.navBdr}`,boxShadow:dark?'none':'0 4px 16px rgba(0,0,0,0.06)'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px'}}>
              <h3 style={{fontSize:'16px',fontWeight:'700',color:C.text}}>상품 등록</h3>
              <button onClick={()=>setShowRegForm(false)} className="btn" style={{background:'none',border:'none',color:C.textMuted,display:'flex'}}><IC.X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                <input placeholder="상품명 *" value={regName} onChange={e=>setRegName(e.target.value)} style={inputStyle}/>
                <input type="number" placeholder="가격 (원) *" value={regPrice} onChange={e=>setRegPrice(e.target.value)} style={inputStyle}/>
                <input placeholder="거래 지역 *" value={regAddress} onChange={e=>setRegAddress(e.target.value)} style={inputStyle}/>
                <div style={{position:'relative'}}>
                  <select value={regCategory} onChange={e=>setRegCategory(e.target.value)} style={{...inputStyle,paddingRight:'34px'}}>
                    {Object.entries(CATEGORY_LABELS).map(([v,l])=><option key={v} value={v}>{CATEGORY_ICONS[v]} {l}</option>)}
                  </select>
                  <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:C.textMuted}}><IC.ChevronDown size={14}/></span>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'14px'}}>
                <div style={{position:'relative'}}>
                  <textarea placeholder="상품 설명 (선택)" value={regDesc} onChange={e=>e.target.value.length<=500&&setRegDesc(e.target.value)}
                    style={{...inputStyle,resize:'vertical',minHeight:'80px'}} rows={3}/>
                  <span style={{position:'absolute',bottom:'10px',right:'12px',fontSize:'11px',color:C.textMuted}}>{regDesc.length}/500</span>
                </div>
                <div onDragEnter={e=>{e.preventDefault();setIsDragging(true)}} onDragLeave={e=>{e.preventDefault();setIsDragging(false)}} onDragOver={e=>e.preventDefault()} onDrop={onDrop}
                  style={{border:`2px dashed ${isDragging?MINT:C.border}`,borderRadius:'10px',background:isDragging?'rgba(0,194,168,0.06)':C.metaBg,transition:'all 0.18s',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',minHeight:'80px'}}>
                  {regPreview?(
                    <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px'}}>
                      <img src={regPreview} alt="preview" style={{width:'54px',height:'54px',objectFit:'cover',borderRadius:'8px',border:`1px solid ${C.border}`}}/>
                      <div>
                        <p style={{fontSize:'12px',fontWeight:'600',color:C.textSub,marginBottom:'4px'}}>{regImage?.name}</p>
                        <button type="button" onClick={()=>clearImage(setRegImage,setRegPreview)}
                          style={{display:'flex',alignItems:'center',gap:'4px',background:'none',border:'1px solid #FECACA',color:'#EF4444',borderRadius:'6px',padding:'3px 8px',cursor:'pointer',fontSize:'12px'}}>
                          <IC.X size={10} color="#EF4444"/> 제거
                        </button>
                      </div>
                    </div>
                  ):(
                    <label style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',cursor:'pointer',padding:'16px'}}>
                      <IC.Upload size={22} color={C.textMuted}/>
                      <span style={{fontSize:'13px',color:C.textMuted,fontWeight:'500'}}>이미지 업로드</span>
                      <span style={{fontSize:'11px',color:C.textMuted}}>클릭 또는 드래그</span>
                      <input type="file" accept="image/*" onChange={e=>applyImage(e.target.files[0],setRegImage,setRegPreview)} style={{display:'none'}}/>
                    </label>
                  )}
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:'8px'}}>
                <button type="button" onClick={()=>setShowRegForm(false)} className="btn"
                  style={{padding:'10px 20px',background:C.metaBg,color:C.textMuted,borderRadius:'10px',fontWeight:'600',fontSize:'14px'}}>취소</button>
                <button type="submit" disabled={submitting} className="btn"
                  style={{display:'flex',alignItems:'center',gap:'7px',background:MINT,color:'#fff',borderRadius:'10px',padding:'10px 24px',fontWeight:'700',fontSize:'14px',opacity:submitting?0.65:1}}>
                  {submitting?<><IC.Spinner size={15}/> 등록 중...</>:'등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 메인 */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'28px 24px'}}>

        {/* 헤더 */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'10px'}}>
          <div>
            <h1 style={{fontSize:'20px',fontWeight:'800',color:C.text,marginBottom:'2px'}}>
              {filterCategory?`${CATEGORY_LABELS[filterCategory]} 상품`:'전체 상품'}
            </h1>
            {!loading&&<p style={{fontSize:'13px',color:C.textMuted}}>{items.length}개의 상품</p>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
            {searchKeyword&&(
              <div style={{display:'flex',alignItems:'center',gap:'6px',background:dark?'rgba(0,194,168,0.1)':'#D6F5F1',border:`1px solid ${MINT}`,borderRadius:'20px',padding:'5px 12px'}}>
                <IC.Search size={12} color={MINT}/>
                <span style={{fontSize:'13px',color:MINT,fontWeight:'600'}}>"{searchKeyword}"</span>
                <button onClick={()=>{setSearchInput('');setSearchKeyword('');}} className="btn"
                  style={{background:'none',border:'none',color:MINT,display:'flex',padding:'0',marginLeft:'2px'}}>
                  <IC.X size={12} color={MINT}/>
                </button>
              </div>
            )}
            {[['latest','최신순'],['price_asc','낮은가격'],['price_desc','높은가격']].map(([v,l])=>(
              <button key={v} className={`sort-btn${sortOrder===v?' active':''}`} onClick={()=>setSortOrder(v)}>{l}</button>
            ))}
          </div>
        </div>

        {/* 카드 그리드 */}
        {loading?(
          <div style={gridStyle}>{Array.from({length:8}).map((_,i)=><SkeletonCard key={i} dark={dark}/>)}</div>
        ):items.length===0?(
          <div style={{textAlign:'center',padding:'80px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'14px',background:C.cardBg,borderRadius:'20px',border:`1px solid ${C.cardBdr}`}}>
            <IC.ShoppingBag size={52} color={C.border}/>
            <p style={{fontSize:'18px',fontWeight:'700',color:C.text}}>상품이 없습니다</p>
            <p style={{fontSize:'14px',color:C.textMuted}}>{searchKeyword||filterCategory?'다른 검색어나 카테고리를 시도해보세요.':'첫 번째 상품을 등록해보세요!'}</p>
            {(searchKeyword||filterCategory)&&(
              <button onClick={()=>{setSearchInput('');setSearchKeyword('');setFilterCategory('');}} className="btn"
                style={{marginTop:'4px',padding:'10px 22px',background:MINT,color:'#fff',borderRadius:'10px',fontSize:'14px',fontWeight:'700'}}>
                전체 보기
              </button>
            )}
          </div>
        ):(
          <div style={gridStyle}>
            {items.map((item,idx)=>(
              <div key={item.id} className="card-hover card-enter"
                style={{background:C.cardBg,borderRadius:'16px',overflow:'hidden',border:`1px solid ${C.cardBdr}`,animationDelay:`${idx*0.035}s`,boxShadow:dark?'none':'0 1px 4px rgba(0,0,0,0.05)'}}
                onClick={()=>openModal(item)}>

                {/* 1:1 정사각 이미지 */}
                <div style={{position:'relative',paddingBottom:'100%',background:C.metaBg,overflow:'hidden'}}>
                  <div style={{position:'absolute',inset:0}}>
                    {item.imageName?(
                      <img src={`${BASE_URL}/images/${item.imageName}`} alt={item.name}
                        className={`card-img-scale${item.status==='SOLD'?' img-sold':''}`}
                        loading="lazy"/>
                    ):(
                      <div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px'}}>
                        <IC.Image size={36} color={C.border}/>
                        <span style={{fontSize:'11px',color:C.textMuted}}>이미지 없음</span>
                      </div>
                    )}

                    {/* 설명 슬라이드업 오버레이 */}
                    {item.description&&(
                      <div className="card-overlay">
                        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.88)',lineHeight:'1.6',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical'}}>
                          {item.description}
                        </p>
                      </div>
                    )}

                    {/* 찜 버튼 */}
                    <button onClick={e=>handleWish(e,item.id)} className={heartAnim===item.id?'heart-pop':''}
                      style={{position:'absolute',top:'10px',right:'10px',width:'32px',height:'32px',borderRadius:'50%',background:'rgba(255,255,255,0.92)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.14)'}}>
                      <IC.Heart size={15} filled={wishedIds.has(item.id)} color={wishedIds.has(item.id)?'#E11D48':'#9CA3AF'}/>
                    </button>

                    {/* SOLD 뱃지 */}
                    {item.status==='SOLD'&&(
                      <div style={{position:'absolute',top:'10px',left:'10px',background:'rgba(0,0,0,0.72)',borderRadius:'6px',padding:'3px 9px'}}>
                        <span style={{color:'#fff',fontWeight:'800',fontSize:'11px',letterSpacing:'1px'}}>SOLD</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 카드 텍스트 */}
                <div style={{padding:'12px 14px 14px'}}>
                  <p style={{fontSize:'11px',color:MINT,fontWeight:'700',marginBottom:'4px'}}>
                    {CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]||'기타'}
                  </p>
                  <p style={{fontSize:'14px',fontWeight:'600',color:C.text,marginBottom:'5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.name}</p>
                  <p style={{fontSize:'19px',fontWeight:'900',color:C.text,marginBottom:'8px',letterSpacing:'-0.5px'}}>
                    {item.price?.toLocaleString()}<span style={{fontSize:'12px',fontWeight:'500',color:C.textMuted,marginLeft:'2px'}}>원</span>
                  </p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'3px'}}>
                      <IC.MapPin size={12} color={C.textMuted}/>
                      <span style={{fontSize:'12px',color:C.textMuted}}>{item.address}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <span style={{display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',color:wishedIds.has(item.id)?'#E11D48':C.textMuted}}>
                        <IC.Heart size={12} filled={wishedIds.has(item.id)} color={wishedIds.has(item.id)?'#E11D48':C.textMuted}/> {item.wishCount||0}
                      </span>
                      {canManage(item)&&(
                        <button onClick={e=>handleDelete(e,item.id)} className="btn" style={{background:'none',border:'none',display:'flex',padding:'2px'}}>
                          <IC.Trash size={13} color={C.textMuted}/>
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

      {/* 상세 모달 */}
      {selectedItem&&(
        <div className="overlay-enter"
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',backdropFilter:'blur(3px)'}}
          onClick={()=>setSelectedItem(null)}>
          <div className="modal-enter"
            style={{background:C.cardBg,borderRadius:'24px',width:'100%',maxWidth:'860px',maxHeight:'90vh',overflowY:'auto',position:'relative'}}
            onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelectedItem(null)} className="btn"
              style={{position:'absolute',top:'16px',right:'16px',zIndex:1,width:'34px',height:'34px',borderRadius:'50%',background:C.metaBg,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.textMuted}}>
              <IC.X size={16}/>
            </button>

            <div style={{display:'flex'}}>
              <div style={{width:'45%',flexShrink:0,background:C.metaBg,borderRadius:'24px 0 0 24px',overflow:'hidden',position:'relative',minHeight:'360px'}}>
                {selectedItem.imageName?(
                  <img src={`${BASE_URL}/images/${selectedItem.imageName}`} alt={selectedItem.name}
                    className={selectedItem.status==='SOLD'?'img-sold':''}
                    style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                ):(
                  <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><IC.Image size={52} color={C.border}/></div>
                )}
                {selectedItem.status==='SOLD'&&(
                  <div style={{position:'absolute',top:'16px',left:'16px',background:'rgba(0,0,0,0.72)',borderRadius:'8px',padding:'5px 12px'}}>
                    <span style={{color:'#fff',fontWeight:'800',fontSize:'13px',letterSpacing:'1.5px'}}>SOLD</span>
                  </div>
                )}
              </div>

              <div style={{flex:1,padding:'32px',display:'flex',flexDirection:'column'}}>
                {!editMode?(
                  <>
                    <div style={{display:'flex',gap:'7px',flexWrap:'wrap',marginBottom:'14px'}}>
                      <span style={{background:dark?'rgba(0,194,168,0.15)':'#D6F5F1',color:MINT,fontSize:'12px',fontWeight:'700',padding:'4px 12px',borderRadius:'20px'}}>
                        {CATEGORY_ICONS[selectedItem.category]} {CATEGORY_LABELS[selectedItem.category]||'기타'}
                      </span>
                      <span style={{background:selectedItem.status==='SOLD'?'#FEF2F2':'#F0FDF4',color:selectedItem.status==='SOLD'?'#EF4444':'#16A34A',fontSize:'12px',fontWeight:'700',padding:'4px 12px',borderRadius:'20px'}}>
                        {selectedItem.status==='SOLD'?'판매완료':'판매중'}
                      </span>
                    </div>
                    <h2 style={{fontSize:'22px',fontWeight:'800',color:C.text,marginBottom:'8px',lineHeight:'1.3'}}>{selectedItem.name}</h2>
                    <p style={{fontSize:'30px',fontWeight:'900',color:C.text,marginBottom:'20px',letterSpacing:'-1px'}}>
                      {selectedItem.price?.toLocaleString()}<span style={{fontSize:'15px',fontWeight:'500',color:C.textMuted,marginLeft:'3px'}}>원</span>
                    </p>
                    <div style={{padding:'14px',background:C.metaBg,borderRadius:'12px',marginBottom:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'14px',color:C.textSub}}>
                        <IC.MapPin size={14} color={C.textMuted}/>{selectedItem.address}
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'14px'}}>
                        <span style={{fontSize:'13px',color:C.textMuted}}>판매자</span>
                        <span style={{fontWeight:'600',color:C.text}}>@{selectedItem.seller}</span>
                      </div>
                    </div>
                    {selectedItem.description&&(
                      <p style={{fontSize:'14px',color:C.textSub,lineHeight:'1.8',padding:'14px',background:C.metaBg,borderRadius:'12px',marginBottom:'16px',whiteSpace:'pre-wrap'}}>
                        {selectedItem.description}
                      </p>
                    )}
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'auto'}}>
                      <button onClick={e=>handleWish(e,selectedItem.id)} className={(heartAnim===selectedItem.id?'heart-pop ':'')+' btn'}
                        style={{display:'flex',alignItems:'center',gap:'7px',padding:'11px 18px',border:`1px solid ${wishedIds.has(selectedItem.id)?'#FECDD3':C.border}`,background:wishedIds.has(selectedItem.id)?'#FFF1F2':C.metaBg,color:wishedIds.has(selectedItem.id)?'#E11D48':C.textMuted,borderRadius:'10px',fontWeight:'600',fontSize:'13px'}}>
                        <IC.Heart size={15} filled={wishedIds.has(selectedItem.id)} color={wishedIds.has(selectedItem.id)?'#E11D48':'#9CA3AF'}/>
                        찜 {selectedItem.wishCount||0}
                      </button>
                      {canManage(selectedItem)&&(
                        <>
                          <button onClick={()=>setEditMode(true)} className="btn"
                            style={{display:'flex',alignItems:'center',gap:'6px',padding:'11px 16px',background:'#6366F1',color:'#fff',borderRadius:'10px',fontWeight:'600',fontSize:'13px'}}>
                            <IC.Pencil size={13} color="#fff"/> 수정
                          </button>
                          <button onClick={handleStatusToggle} className="btn"
                            style={{display:'flex',alignItems:'center',gap:'6px',padding:'11px 16px',background:C.metaBg,color:C.textSub,border:`1px solid ${C.border}`,borderRadius:'10px',fontWeight:'600',fontSize:'13px'}}>
                            <IC.ToggleRight size={15} color={MINT}/>
                            {selectedItem.status==='SELLING'?'판매완료 처리':'판매중으로 변경'}
                          </button>
                          <button onClick={e=>handleDelete(e,selectedItem.id)} className="btn"
                            style={{display:'flex',alignItems:'center',gap:'6px',padding:'11px 16px',background:'#FEF2F2',color:'#EF4444',border:'1px solid #FECACA',borderRadius:'10px',fontWeight:'600',fontSize:'13px'}}>
                            <IC.Trash size={13} color="#EF4444"/> 삭제
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ):(
                  <>
                    <h3 style={{fontSize:'16px',fontWeight:'700',color:C.text,marginBottom:'18px'}}>상품 수정</h3>
                    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                      <input value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} style={inputStyle} placeholder="상품명"/>
                      <input type="number" value={editData.price} onChange={e=>setEditData({...editData,price:e.target.value})} style={inputStyle} placeholder="가격"/>
                      <input value={editData.address} onChange={e=>setEditData({...editData,address:e.target.value})} style={inputStyle} placeholder="지역"/>
                      <div style={{position:'relative'}}>
                        <select value={editData.category} onChange={e=>setEditData({...editData,category:e.target.value})} style={{...inputStyle,paddingRight:'34px'}}>
                          {Object.entries(CATEGORY_LABELS).map(([v,l])=><option key={v} value={v}>{CATEGORY_ICONS[v]} {l}</option>)}
                        </select>
                        <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:C.textMuted}}><IC.ChevronDown size={14}/></span>
                      </div>
                      <textarea value={editData.description} onChange={e=>setEditData({...editData,description:e.target.value})} style={{...inputStyle,resize:'vertical',minHeight:'72px'}} placeholder="상품 설명" rows={3}/>
                      <div style={{border:`2px dashed ${C.border}`,borderRadius:'10px',padding:'12px',background:C.metaBg}}>
                        {editPreview?(
                          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                            <img src={editPreview} alt="preview" style={{width:'52px',height:'52px',objectFit:'cover',borderRadius:'8px',border:`1px solid ${C.border}`}}/>
                            <button type="button" onClick={()=>clearImage(setEditImage,setEditPreview)}
                              style={{display:'flex',alignItems:'center',gap:'4px',background:'none',border:'1px solid #FECACA',color:'#EF4444',borderRadius:'6px',padding:'3px 10px',cursor:'pointer',fontSize:'12px'}}>
                              <IC.X size={11} color="#EF4444"/> 제거
                            </button>
                          </div>
                        ):(
                          <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',color:C.textMuted,fontSize:'13px'}}>
                            <IC.Upload size={16} color={C.textMuted}/> 이미지 변경 (선택)
                            <input type="file" accept="image/*" onChange={e=>applyImage(e.target.files[0],setEditImage,setEditPreview)} style={{display:'none'}}/>
                          </label>
                        )}
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                      <button onClick={handleEditSave} className="btn"
                        style={{display:'flex',alignItems:'center',gap:'6px',padding:'10px 20px',background:MINT,color:'#fff',borderRadius:'10px',fontWeight:'700',fontSize:'14px'}}>
                        <IC.Check size={14} color="#fff"/> 저장
                      </button>
                      <button onClick={()=>{setEditMode(false);clearImage(setEditImage,setEditPreview);}} className="btn"
                        style={{padding:'10px 20px',background:C.metaBg,color:C.textMuted,borderRadius:'10px',fontSize:'14px'}}>취소</button>
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

const gridStyle = {display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'16px'};
