import { useState, useRef, useCallback, useEffect } from "react";

const DEFAULT_HEROES = ["/hero1.png", "/hero2.png", "/hero3.png"];
const LOGO_HEADER = "/logo-text.png";
const LOGO_HERO = "/logo-char.png";

const C = {y:"#FFC94B",dy:"#F0B830",br:"#FFC94B",lb:"#FFD97A",cr:"#F6F6F6",ru:"#E6A800",tx:"#333",mu:"#888",};
const LANGS = [{c:"en",l:"EN"},{c:"ko",l:"KR"},{c:"ja",l:"JP"}];

const Inp=({v,s,p,tp="text",mb=10})=>(
  <input style={{display:"block",width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.lb}`,fontSize:13,color:"#000000",fontFamily:"Georgia,serif",marginBottom:mb,outline:"none",background:"#fff",boxSizing:"border-box"}}
    type={tp} placeholder={p} value={v} onChange={e=>s(e.target.value)}/>
);

const T = {
  en:{login:"Login",signup:"Sign Up",mypage:"My Page",logout:"Logout",shopNow:"Make my case",
    category:"CATEGORY",shipping:"Handmade · 15+ days · Free over $20",returns:"Custom-made · No exchange/returns",productInfo:"Product Info",
    custom:"🐾 Custom Print Available",customDesc:"Send your pet photo for a unique case.",
    addCart:"Add to Cart",buyNow:"Buy Now",selectModel:"Select Phone Model",
    chooseModel:"Choose model",orderInfo:"Order Info",payment:"Payment",done:"Done!",
    petName:"Pet's Name",petPhoto:"Pet Photo (up to 5)",pasteLink:"Or paste image link",
    name:"Full Name",addr:"Street address",addrDetail:"Apt, floor (optional)",
    phone:"Phone",email:"Email",notes:"Notes (optional)",notesHolder:"Custom print details...",
    continueBtn:"Continue to Payment",back:"Back",placeOrder:"Place Order",
    product:"Product",shippingFee:"Shipping",delivery:"Delivery",total:"Total",
    free:"Free",time:"3-5 business days",payMethod:"Payment Method",
    cardBrand:"Card Brand",cardNum:"Card Number",expiry:"Expiry",cvc:"CVC",
    bankInfo:"Woori Bank 1002-000-000000 / Account: Yours Tail\nTransfer within 24hrs.",
    orderPlaced:"Order Placed!",thanks:"Thank you for your order",
    orderNo:"Order No.",model:"Model",continueShopping:"Continue Shopping",
    confirmSent:"Confirmation sent to",orderHistory:"Order History",shippingInfo:"Shipping Info",
    defaultAddr:"Default Address",edit:"Edit",policyTitle:"Shipping Policy",
    policy:"Free shipping · 3-5 days standard · 5-7 days custom · International available",
    trackNo:"Tracking No.",welcome:"Welcome back",signIn:"Sign in to your tail",
    noAcc:"No account?",haveAcc:"Have an account?",createAcc:"Create Account",
    rememberMe:"Remember me",
    wishlist:"Wishlist",emptyWish:"No favorites yet.",
    joinFam:"Join the your tail family",fillAll:"Fill in all fields.",
    validEmail:"Enter a valid email.",fillReq:"Fill all required fields.",
    selPay:"Select a payment method.",fillCard:"Fill in all card details.",
    selPhone:"Select a phone model first",addedCart:"Added to cart!",
    heroSub:"Close to you, always.",petNamePh:"e.g. Bori, Coco",
    forgotPw:"Forgot password?",forgotId:"Forgot ID?",
    forgotPwTitle:"Reset Password",forgotIdTitle:"Find Your ID",
    forgotPwDesc:"Enter your registered email address and we'll send you a password reset link.",
    forgotIdDesc:"Enter the name and phone number you used when signing up.",
    sendResetLink:"Send Reset Link",findMyId:"Find My ID",
    resetSent:"Password reset link has been sent to your email.",
    idFound:"Your registered email is:",idNotFound:"No account found with this information.",
    backToLogin:"Back to Login"},
  ko:{login:"로그인",signup:"회원가입",mypage:"마이페이지",logout:"로그아웃",shopNow:"폰 케이스 만들기",
    category:"카테고리",shipping:"핸드메이드 · 15일 이상 · 20달러 이상 무료배송",returns:"맞춤 제작 · 교환/반품 불가",productInfo:"상품 정보",
    custom:"🐾 맞춤 제작 가능",customDesc:"반려동물 사진을 보내주시면 세상에 하나뿐인 케이스를 만들어드려요.",
    addCart:"장바구니",buyNow:"구매하기",selectModel:"기종 선택",
    chooseModel:"모델 선택",orderInfo:"주문 정보",payment:"결제",done:"완료!",
    petName:"반려동물 이름",petPhoto:"반려동물 사진 (최대 5장)",pasteLink:"이미지 또는 링크 붙여넣기",
    name:"이름",addr:"도로명 주소",addrDetail:"동호수 (선택)",
    phone:"연락처",email:"이메일",notes:"요청사항 (선택)",notesHolder:"맞춤 인쇄 세부 사항...",
    continueBtn:"결제 수단 선택",back:"이전",placeOrder:"주문 완료",
    product:"상품",shippingFee:"배송비",delivery:"배송기간",total:"합계",
    free:"무료",time:"3-5 영업일",payMethod:"결제 수단",
    cardBrand:"카드사",cardNum:"카드 번호",expiry:"유효기간",cvc:"CVC",
    bankInfo:"우리은행 1002-000-000000 / 예금주: Yours Tail\n24시간 이내 입금 시 주문 확정",
    orderPlaced:"주문 완료!",thanks:"주문해주셔서 감사합니다",
    orderNo:"주문번호",model:"기종",continueShopping:"계속 쇼핑",
    confirmSent:"확인 이메일:",orderHistory:"주문 내역",shippingInfo:"배송 정보",
    defaultAddr:"기본 배송지",edit:"수정",policyTitle:"배송 안내",
    policy:"무료배송 · 일반 3-5일 · 맞춤 5-7일 · 해외배송 가능",
    trackNo:"운송장 번호",welcome:"다시 오셨군요",signIn:"your tail 로그인",
    noAcc:"계정이 없으신가요?",haveAcc:"계정이 있으신가요?",createAcc:"회원가입",
    rememberMe:"아이디 저장",
    wishlist:"찜한 상품",emptyWish:"찜한 상품이 없어요.",
    joinFam:"your tail 가족이 되어주세요",fillAll:"모든 항목을 입력해주세요.",
    validEmail:"유효한 이메일을 입력해주세요.",fillReq:"필수 항목을 모두 입력해주세요.",
    selPay:"결제 수단을 선택해주세요.",fillCard:"카드 정보를 모두 입력해주세요.",
    selPhone:"먼저 기종을 선택해주세요",addedCart:"장바구니에 담겼어요!",
    heroSub:"Close to you, always.",petNamePh:"예: 보리, 콩",
    forgotPw:"비밀번호를 잊으셨나요?",forgotId:"아이디를 잊으셨나요?",
    forgotPwTitle:"비밀번호 재설정",forgotIdTitle:"아이디 찾기",
    forgotPwDesc:"가입 시 사용한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.",
    forgotIdDesc:"가입 시 사용한 이름과 연락처를 입력해주세요.",
    sendResetLink:"재설정 링크 보내기",findMyId:"아이디 찾기",
    resetSent:"비밀번호 재설정 링크가 이메일로 전송되었습니다.",
    idFound:"등록된 이메일 주소:",idNotFound:"일치하는 계정을 찾을 수 없습니다.",
    backToLogin:"로그인으로 돌아가기"},
  ja:{login:"ログイン",signup:"会員登録",mypage:"マイページ",logout:"ログアウト",shopNow:"ケースを作る",
    category:"カテゴリー",shipping:"ハンドメイド · 15日以上 · $20以上送料無料",returns:"オーダーメイド · 交換/返品不可",productInfo:"商品情報",
    custom:"🐾 カスタムプリント対応",customDesc:"ペットの写真をアップロードすると世界に一つだけのケースをお作りします。",
    addCart:"カートに入れる",buyNow:"購入する",selectModel:"機種を選択",
    chooseModel:"機種を選択",orderInfo:"注文情報",payment:"お支払い",done:"完了！",
    petName:"ペットの名前",petPhoto:"ペット写真（最大5枚）",pasteLink:"画像またはSNSリンクを貼り付け",
    name:"お名前",addr:"番地・建物名",addrDetail:"部屋番号など（任意）",
    phone:"電話番号",email:"メール",notes:"ご要望（任意）",notesHolder:"カスタムプリントの詳細...",
    continueBtn:"お支払いへ進む",back:"戻る",placeOrder:"注文を確定する",
    product:"商品",shippingFee:"送料",delivery:"配送期間",total:"合計",
    free:"無料",time:"3-5営業日",payMethod:"お支払い方法",
    cardBrand:"カードブランド",cardNum:"カード番号",expiry:"有効期限",cvc:"CVC",
    bankInfo:"Woori Bank 1002-000-000000 / 口座名義: Yours Tail\n24時間以内にお振込みください。",
    orderPlaced:"ご注文完了！",thanks:"ご注文ありがとうございます",
    orderNo:"注文番号",model:"機種",continueShopping:"ショッピングを続ける",
    confirmSent:"確認メールを送信しました:",orderHistory:"注文履歴",shippingInfo:"配送情報",
    defaultAddr:"デフォルト住所",edit:"編集",policyTitle:"配送について",
    policy:"送料無料・通常3-5日・カスタム5-7日・海外配送対応",
    trackNo:"追跡番号",welcome:"おかえりなさい",signIn:"your tailにサインイン",
    noAcc:"アカウントをお持ちでないですか？",haveAcc:"すでにアカウントをお持ちですか？",createAcc:"会員登録",
    rememberMe:"ID保存",
    wishlist:"お気に入り",emptyWish:"お気に入りはまだありません。",
    joinFam:"your tailファミリーに参加しよう",fillAll:"全ての項目を入力してください。",
    validEmail:"有効なメールアドレスを入力してください。",fillReq:"必須項目を全て入力してください。",
    selPay:"お支払い方法を選択してください。",fillCard:"カード情報を全て入力してください。",
    selPhone:"まず機種を選択してください",addedCart:"カートに追加しました！",
    heroSub:"Close to you, always.",petNamePh:"例: ボリ、ここ",
    forgotPw:"パスワードをお忘れですか？",forgotId:"IDをお忘れですか？",
    forgotPwTitle:"パスワード再設定",forgotIdTitle:"ID検索",
    forgotPwDesc:"登録したメールアドレスを入力すると、パスワード再設定リンクをお送りします。",
    forgotIdDesc:"登録時のお名前と電話番号を入力してください。",
    sendResetLink:"再設定リンクを送信",findMyId:"IDを検索",
    resetSent:"パスワード再設定リンクをメールに送信しました。",
    idFound:"登録されたメールアドレス：",idNotFound:"一致するアカウントが見つかりません。",
    backToLogin:"ログインに戻る"}
};

const CL = {
  en:{All:"All",PhoneCase:"Phone Case",GripTok:"Grip Tok",EarphoneCase:"Earphone Case",AcrylicGoods:"Acrylic Goods",Keyring:"Keyring",Wallpaper:"Wallpaper",Dog:"Dog",Cat:"Cat",Rabbit:"Rabbit",Bird:"Bird",Reptile:"Reptile",Aquatic:"Aquatic",Other:"Others"},
  ko:{All:"전체",PhoneCase:"폰케이스",GripTok:"그립톡",EarphoneCase:"이어폰 케이스",AcrylicGoods:"아크릴 굿즈",Keyring:"키링",Wallpaper:"배경화면",Dog:"강아지",Cat:"고양이",Rabbit:"토끼",Bird:"새",Reptile:"파충류",Aquatic:"수생동물",Other:"기타"},
  ja:{All:"全て",PhoneCase:"フォンケース",GripTok:"グリップトック",EarphoneCase:"イヤホンケース",AcrylicGoods:"アクリルグッズ",Keyring:"キーリング",Wallpaper:"壁紙",Dog:"犬",Cat:"猫",Rabbit:"うさぎ",Bird:"鳥",Reptile:"爬虫類",Aquatic:"水生動物",Other:"その他"},
};

const IPHONE=["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15 Plus","iPhone 15","iPhone 14 Pro Max","iPhone 14 Pro","iPhone 14 Plus","iPhone 14","iPhone 13 Pro Max","iPhone 13 Pro","iPhone 13 Mini","iPhone 13","iPhone 12 Pro Max","iPhone 12 Pro","iPhone 12 Mini","iPhone 12","iPhone SE 3rd"];
const GALAXY=["Galaxy S25 Ultra","Galaxy S25+","Galaxy S25","Galaxy S24 Ultra","Galaxy S24+","Galaxy S24","Galaxy S23 Ultra","Galaxy S23+","Galaxy S23","Galaxy S22 Ultra","Galaxy S22+","Galaxy S22","Galaxy Z Fold 6","Galaxy Z Fold 5","Galaxy Z Fold 4","Galaxy Z Flip 6","Galaxy Z Flip 5","Galaxy Z Flip 4","Galaxy A55","Galaxy A54","Galaxy A35"];
const CATS=["All","PhoneCase","EarphoneCase","GripTok","AcrylicGoods","Keyring","Wallpaper"];
const PARENT_CATS=["PhoneCase","EarphoneCase","GripTok","AcrylicGoods","Keyring","Wallpaper"];
const SUB_CATS=["Dog","Cat","Rabbit","Bird","Reptile","Aquatic","Other"];
const ALL_CATS=["All",...PARENT_CATS,...SUB_CATS];
const EM={All:"🐾",PhoneCase:"📱",GripTok:"🔘",EarphoneCase:"🎧",AcrylicGoods:"✨",Keyring:"🔑",Wallpaper:"🖼️",Dog:"🐶",Cat:"🐱",Rabbit:"🐰",Bird:"🐦",Reptile:"🦎",Aquatic:"🐠",Other:"🐾"};

const PRODS=[
  {id:1,cat:"Dog",tag:"Best",e:"🤍",price:18000,n:{en:"Maltese Clear Case",ko:"말티즈 클리어 케이스",ja:"マルチーズ クリアケース"},d:{en:"Fluffy Maltese on a crystal-clear case.",ko:"새하얀 말티즈의 클리어 케이스.",ja:"ふわふわマルチーズのクリアケース。"}},
  {id:2,cat:"Dog",tag:"",e:"🐩",price:22000,n:{en:"Poodle Watercolor",ko:"푸들 수채화 케이스",ja:"プードル水彩ケース"},d:{en:"Soft watercolor poodle in warm tones.",ko:"따뜻한 수채화 푸들 케이스.",ja:"水彩タッチのプードルケース。"}},
  {id:3,cat:"Dog",tag:"New",e:"🦊",price:24000,n:{en:"Shiba Inu Art Case",ko:"시바견 아트 케이스",ja:"柴犬アートケース"},d:{en:"Iconic Shiba smile, bold style.",ko:"시바견 특유의 미소를 담은 케이스.",ja:"個性的な柴犬スマイルのケース。"}},
  {id:4,cat:"Dog",tag:"",e:"💛",price:22000,n:{en:"Golden Retriever",ko:"골든 리트리버 케이스",ja:"ゴールデンレトリバー"},d:{en:"Warm golden tones, the friendliest case.",ko:"따뜻한 골든 색감의 케이스.",ja:"温かみのあるゴールドトーン。"}},
  {id:5,cat:"Cat",tag:"Best",e:"🐱",price:20000,n:{en:"Scottish Fold Clear",ko:"스코티시 폴드 케이스",ja:"スコティッシュフォールド"},d:{en:"Round-faced Scottish Fold, minimalist.",ko:"둥글둥글한 스코티시 폴드 케이스.",ja:"丸顔スコティッシュのミニマルケース。"}},
  {id:6,cat:"Cat",tag:"",e:"🐈",price:19000,n:{en:"Tabby Cat Soft Case",ko:"고등어 고양이 케이스",ja:"トラ猫ソフトケース"},d:{en:"Cozy tabby with warm amber stripes.",ko:"따뜻한 줄무늬 고등어 고양이.",ja:"温かみある縞模様のトラ猫。"}},
  {id:7,cat:"Cat",tag:"New",e:"🖤",price:21000,n:{en:"Black Cat Moon",ko:"블랙캣 문 케이스",ja:"黒猫ムーンケース"},d:{en:"Mysterious black cat under a crescent moon.",ko:"초승달 아래 신비로운 검은 고양이.",ja:"三日月の下の神秘的な黒猫。"}},
  {id:8,cat:"Rabbit",tag:"New",e:"🐰",price:19000,n:{en:"Holland Lop Case",ko:"홀랜드 롭 케이스",ja:"ホーランドロップ"},d:{en:"Floppy Holland Lop in pastel tones.",ko:"파스텔 톤의 홀랜드 롭 케이스.",ja:"パステルトーンのホーランドロップ。"}},
  {id:9,cat:"Rabbit",tag:"",e:"🫧",price:18000,n:{en:"White Bunny Clear",ko:"하얀 토끼 케이스",ja:"白うさぎクリア"},d:{en:"Pure white bunny on transparent background.",ko:"투명 배경의 새하얀 토끼.",ja:"透明背景の白うさぎ。"}},
  {id:10,cat:"Bird",tag:"Best",e:"🦜",price:20000,n:{en:"Parakeet Art Case",ko:"잉꼬 아트 케이스",ja:"インコアートケース"},d:{en:"Colorful budgie, vivid UV print.",ko:"화려한 잉꼬의 UV 프린팅.",ja:"カラフルなインコのケース。"}},
  {id:11,cat:"Bird",tag:"",e:"🐦",price:19000,n:{en:"Cockatiel Soft Case",ko:"코카티엘 케이스",ja:"オカメインコケース"},d:{en:"Gentle cockatiel with warm grays.",ko:"따뜻한 회색톤의 코카티엘.",ja:"温かみのあるオカメインコ。"}},
  {id:12,cat:"Reptile",tag:"New",e:"🦎",price:23000,n:{en:"Bearded Dragon",ko:"턱수염 도마뱀 케이스",ja:"フトアゴケース"},d:{en:"Bold bearded dragon portrait.",ko:"강렬한 턱수염 도마뱀 케이스.",ja:"インパクト抜群のフトアゴケース。"}},
  {id:13,cat:"Reptile",tag:"",e:"🟡",price:22000,n:{en:"Leopard Gecko",ko:"레오파드 게코 케이스",ja:"レオパケース"},d:{en:"Spotted gecko in warm desert tones.",ko:"따뜻한 사막 색감의 레오파드 게코.",ja:"温かみある砂漠カラーのレオパ。"}},
  {id:14,cat:"Aquatic",tag:"New",e:"🐠",price:23000,n:{en:"Betta Fish Art",ko:"베타 피쉬 케이스",ja:"ベタアートケース"},d:{en:"Betta fins like a silk painting.",ko:"실크 페인팅 같은 베타 케이스.",ja:"シルク絵画のようなベタケース。"}},
  {id:15,cat:"Aquatic",tag:"",e:"🐡",price:19000,n:{en:"Goldfish Clear",ko:"금붕어 클리어 케이스",ja:"金魚クリアケース"},d:{en:"Round goldfish on transparent background.",ko:"투명 배경의 동글동글한 금붕어.",ja:"透明背景の丸い金魚。"}},
];

const SLIDES=["✨","🌿","🎀","🍂","🌸","💛","🐾"];
const PAYS=[
  {id:"card",icon:"",l:{en:"Credit Card",ko:"신용카드",ja:"クレジットカード"}},
  {id:"paypal",icon:"",l:{en:"PayPal",ko:"페이팔",ja:"PayPal"}},
  {id:"apple",icon:"",l:{en:"Apple Pay",ko:"애플페이",ja:"Apple Pay"}},
  {id:"google",icon:"",l:{en:"Google Pay",ko:"구글페이",ja:"Google Pay"}},
  {id:"bank",icon:"",l:{en:"Bank Transfer",ko:"계좌이체",ja:"銀行振込"}},
  {id:"kakao",icon:"",l:{en:"Kakao Pay",ko:"카카오페이",ja:"KakaoPay"}},
  {id:"naver",icon:"",l:{en:"Naver Pay",ko:"네이버페이",ja:"NaverPay"}},
];
const MOCK=[
  {id:"YT-20250101",name:"Shiba Inu Art Case",model:"iPhone 15 Pro",price:24000,date:"2025-01-01",status:{en:"Delivered",ko:"배송 완료",ja:"配達済み"},track:"123456789"},
  {id:"YT-20241215",name:"Scottish Fold Clear",model:"Galaxy S24",price:20000,date:"2024-12-15",status:{en:"Shipped",ko:"배송 중",ja:"発送済み"},track:"987654321"},
];

function usePersistent(key,initial){
  const[v,setV]=useState(initial);
  const[ready,setReady]=useState(false);
  const loaded=useRef(false);
  useEffect(()=>{
    fetch("/api/state/"+key).then(r=>r.ok?r.json():null).then(d=>{
      if(d!==null&&d!==undefined) setV(d);
      else try{const s=localStorage.getItem("yt_"+key);const p=s&&JSON.parse(s);if(p!==null&&p!==undefined)setV(p);}catch{}
      loaded.current=true;setReady(true);
    }).catch(()=>{loaded.current=true;setReady(true);});
  },[]);
  useEffect(()=>{
    if(!loaded.current)return;
    try{localStorage.setItem("yt_"+key,JSON.stringify(v));}catch{}
    fetch("/api/state/"+key,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(v)}).catch(()=>{});
  },[v]);
  return[v,setV,ready];
}

function useSwipe(onL,onR){
  const sx=useRef(null);
  return{
    onTouchStart:e=>{sx.current=e.touches[0].clientX;},
    onTouchEnd:e=>{if(sx.current===null)return;const d=e.changedTouches[0].clientX-sx.current;if(Math.abs(d)>40){d<0?onL():onR();}sx.current=null;},
    onMouseDown:e=>{sx.current=e.clientX;},
    onMouseUp:e=>{if(sx.current===null)return;const d=e.clientX-sx.current;if(Math.abs(d)>40){d<0?onL():onR();}sx.current=null;},
  };
}

export default function App(){
  const[lang,setLang]=useState("en");
  const[showL,setShowL]=useState(false);
  const t=T[lang];
  const cl=CL[lang];
  const fmtPrice=v=>{if(lang==="ja")return`¥${Math.round(v/9).toLocaleString()}`;if(lang==="en")return`$${(v/1350).toFixed(2)}`;return`₩${v.toLocaleString()}`;};


  const[pg,setPg]=useState("home");
  const[menu,setMenu]=useState(false);
  const[cat,setCat]=useState("All");const[sortBy,setSortBy]=useState("popular");const[shopPage,setShopPage]=useState(0);
  const[openParent,setOpenParent]=useState(null);
  const[selId,setSelId]=useState(null);
  const[iIdx,setIIdx]=useState(0);
  const[heroIdx,setHeroIdx]=useState(0);
  const[heroes,setHeroes,heroesReady]=usePersistent("heroes",DEFAULT_HEROES);
  const[heroSubText,setHeroSubText]=usePersistent("heroSubText","Close to you, always.");
  const[heroBtnText,setHeroBtnText]=usePersistent("heroBtnText","");
  const[brand,setBrand]=useState("Apple");
  const[model,setModel]=useState("");
  const[caseType,setCaseType]=useState("");
  const[liked,setLiked]=usePersistent("liked",{});const[wishSnap,setWishSnap]=useState([]);
  const[cart,setCart]=usePersistent("cart",[]);const[cartChecked,setCartChecked]=useState(new Set());
  const[toast,setToast]=useState(null);
  const[user,setUser]=useState(null);
  const[users,setUsers]=usePersistent("users",[]);
  const[lE,setLE]=useState(()=>{try{return localStorage.getItem("yt_email")||"";}catch{return"";}});const[lP,setLP]=useState("");
  const[remember,setRemember]=useState(()=>{try{return !!localStorage.getItem("yt_email");}catch{return false;}});
  const[sN,setSN]=useState("");const[sE,setSE]=useState("");const[sP,setSP]=useState("");
  const[aErr,setAErr]=useState("");
  const[fpEmail,setFpEmail]=useState("");const[fpMsg,setFpMsg]=useState("");
  const[fiName,setFiName]=useState("");const[fiPhone,setFiPhone]=useState("");const[fiResult,setFiResult]=useState("");
  const[myTab,setMyTab]=useState("orders");
  const[showOrd,setShowOrd]=useState(false);const[ordItems,setOrdItems]=useState([]);
  const[step,setStep]=useState(1);
  const[nm,setNm]=useState("");const[addr,setAddr]=useState("");const[addr2,setAddr2]=useState("");
  const[ph,setPh]=useState("");const[em,setEm]=useState("");const[note,setNote]=useState("");
  const[photos,setPhotos]=useState([]);const[pUrl,setPUrl]=useState("");const[snsLink,setSnsLink]=useState("");const[petName,setPetName]=useState("");
  const[payM,setPayM]=useState("");
  const[cBr,setCBr]=useState("");const[cN,setCN]=useState("");const[cE,setCE]=useState("");const[cv,setCv]=useState("");
  const[oErr,setOErr]=useState("");
  const[oid,setOid]=useState("");
  const[editAddr,setEditAddr]=useState(false);
const[adminTab,setAdminTab]=useState("dashboard");const[salesPeriod,setSalesPeriod]=useState("day");const[chartPage,setChartPage]=useState(0);const[salesDetail,setSalesDetail]=useState(null);const[salesDetailPage,setSalesDetailPage]=useState(0);const[orderFilter,setOrderFilter]=useState("All");const[orderPage,setOrderPage]=useState(0);const[delPopup,setDelPopup]=useState(null);const[detailOrder,setDetailOrder]=useState(null);const[detailUser,setDetailUser]=useState(null);
const[adminCat,setAdminCat]=useState("All");const[adminOpenParent,setAdminOpenParent]=useState(null);const[adminProdPage,setAdminProdPage]=useState(0);
const[prods,setProds]=useState(PRODS);
const prodsLoaded=useRef(false);
const sel=selId!=null?prods.find(p=>p.id===selId)||null:null;
const setSel=p=>setSelId(p?p.id:null);
const adminProds=prods;
const setAdminProds=setProds;
const[orders,setOrders]=usePersistent("orders",[...MOCK,{id:"YT-20250301",name:"Betta Fish Art",model:"Galaxy S24",price:23000,date:"2025-03-01",status:{en:"Processing",ko:"처리중",ja:"処理中"},track:""},{id:"YT-20250215",name:"Black Cat Moon",model:"iPhone 15",price:21000,date:"2025-02-15",status:{en:"Shipped",ko:"배송 중",ja:"発送済み"},track:"111222333"}]);
const adminOrders=orders;
const setAdminOrders=setOrders;
const[adminUsers,setAdminUsers]=usePersistent("adminUsers",[{name:"Test User",email:"test@test.com",date:"2025-01-01",orders:2},{name:"Jane Doe",email:"jane@example.com",date:"2025-02-10",orders:1}]);
const[showProdForm,setShowProdForm]=useState(false);
const[editProd,setEditProd]=useState(null);
const[pName,setPName]=useState("");const[pNameEn,setPNameEn]=useState("");const[pNameJa,setPNameJa]=useState("");const[pPrice,setPPrice]=useState("");const[pStock,setPStock]=useState("");const[pType,setPType]=useState("PhoneCase");const[pCat,setPCat]=useState("Dog");const[pTag,setPTag]=useState("");const[pDesc,setPDesc]=useState("");const[pDescEn,setPDescEn]=useState("");const[pDescJa,setPDescJa]=useState("");const[pThumb,setPThumb]=useState("");const[pSubs,setPSubs]=useState(["","","","","",""]);const[translating,setTranslating]=useState(false);const[pCost,setPCost]=useState("");const[pPack,setPPack]=useState("");const[pShip,setPShip]=useState("");const[aiGenerating,setAiGenerating]=useState(false);
const[showCouponForm,setShowCouponForm]=useState(false);const[editCouponIdx,setEditCouponIdx]=useState(null);
const[coupons,setCoupons]=usePersistent("coupons",[{code:"WELCOME10",discount:10,type:"%",used:3,active:true},{code:"FLAT2000",discount:2000,type:"₩",used:1,active:true}]);
const[caseCats,setCaseCats]=usePersistent("caseCats",[
  {ko:"폰케이스",en:"Phone Case",ja:"フォンケース"},
  {ko:"이어폰케이스",en:"Earphone Case",ja:"イヤホンケース"}
]);const[newCaseCat,setNewCaseCat]=useState({ko:"",en:"",ja:""});
const[caseTypes,setCaseTypes]=usePersistent("caseTypes",[
  {ko:"하드 케이스",en:"Hard Case",ja:"ハードケース",img:"",cat:"폰케이스",price:0},
  {ko:"소프트 케이스",en:"Soft Case",ja:"ソフトケース",img:"",cat:"폰케이스",price:0},
  {ko:"클리어 케이스",en:"Clear Case",ja:"クリアケース",img:"",cat:"폰케이스",price:0},
  {ko:"범퍼 케이스",en:"Bumper Case",ja:"バンパーケース",img:"",cat:"폰케이스",price:0}
]);const[newCt,setNewCt]=useState({ko:"",en:"",ja:"",img:"",cat:"",price:""});const[dragHero,setDragHero]=useState(null);const[dragOverHero,setDragOverHero]=useState(null);const heroListRef=useRef(null);const[editCtIdx,setEditCtIdx]=useState(null);const[editCt,setEditCt]=useState({ko:"",en:"",ja:"",img:"",cat:"",price:""});const[adminCaseCat,setAdminCaseCat]=useState("");
const[cpCode,setCpCode]=useState("");const[cpDiscount,setCpDiscount]=useState("");const[cpType,setCpType]=useState("%");const[cpUsed,setCpUsed]=useState("");
const[couponInput,setCouponInput]=useState("");const[appliedCoupon,setAppliedCoupon]=useState(null);const[couponMsg,setCouponMsg]=useState("");
const[shippingCosts,setShippingCosts]=usePersistent("shippingCosts",[{country:"한국",cost:3000},{country:"일본",cost:5000},{country:"미국",cost:8000},{country:"동남아",cost:6000}]);const[newShipCountry,setNewShipCountry]=useState("");const[newShipCost,setNewShipCost]=useState("");const[editShipIdx,setEditShipIdx]=useState(null);const[editShipCountry,setEditShipCountry]=useState("");const[editShipCost,setEditShipCost]=useState("");
const[freeShipMin,setFreeShipMin]=usePersistent("freeShipMin",27000);const[defaultShipFee,setDefaultShipFee]=usePersistent("defaultShipFee",3000);const[taxRate,setTaxRate]=usePersistent("taxRate",10);
const[notices,setNotices]=usePersistent("notices",[{id:1,title:{en:"Shipping Delay Notice",ko:"배송 지연 안내",ja:"配送遅延のお知らせ"},date:"2025-03-01",content:{en:"Shipping may be delayed in some areas.",ko:"일부 지역 배송이 지연될 수 있습니다.",ja:"一部地域で配送が遅れる場合があります。"}},{id:2,title:{en:"New Products Released",ko:"신규 상품 출시",ja:"新商品発売"},date:"2025-02-20",content:{en:"Spring season new products are now available.",ko:"봄 시즌 신상품이 출시되었습니다.",ja:"春シーズンの新商品が発売されました。"}}]);
const[showNoticeForm,setShowNoticeForm]=useState(false);
const[ntTitle,setNtTitle]=useState({en:"",ko:"",ja:""});const[ntContent,setNtContent]=useState({en:"",ko:"",ja:""});const[ntBanner,setNtBanner]=useState("");const[ntDetailImg,setNtDetailImg]=useState("");const[openNotice,setOpenNotice]=useState(null);const[ntTranslating,setNtTranslating]=useState(false);
const[reviews,setReviews]=usePersistent("reviews",[]);const[revText,setRevText]=useState("");const[revRating,setRevRating]=useState(5);const[revImgs,setRevImgs]=useState([]);const[revPage,setRevPage]=useState(0);
const[inquiries,setInquiries]=usePersistent("inquiries",[{id:1,user:"jane@example.com",msg:"배송이 언제 오나요?",date:"2025-03-01",reply:""},{id:2,user:"test@test.com",msg:"케이스 색상 변경 가능한가요?",date:"2025-02-28",reply:"안녕하세요! 색상 변경은 주문 후 24시간 이내에만 가능합니다."}]);
const[replyText,setReplyText]=useState({});
const[profiles,setProfiles]=usePersistent("profiles",{});
const[myName,setMyName]=useState("");const[myEmail,setMyEmail]=useState("");const[myAddr,setMyAddr]=useState("");const[myCity,setMyCity]=useState("");const[myPhone,setMyPhone]=useState("");const[myAvatar,setMyAvatar]=useState("");
const[myInquiryMsg,setMyInquiryMsg]=useState("");
const[showDeleteConfirm,setShowDeleteConfirm]=useState(false);
const fRef=useRef(null);
  const chipRef=useRef(null);
  const chipDrag=useRef(null);
  const subChipRef=useRef(null);
  const subChipDrag=useRef(null);
  const adminChipRef=useRef(null);
  const adminChipDrag=useRef(null);
  const adminSubRef=useRef(null);
  const adminSubDrag=useRef(null);
  const adminTabRef=useRef(null);
  const adminTabDrag=useRef(null);
  const heroTimer=useRef(null);

  // Hero slideshow
  const startHeroTimer = useCallback(() => {
    if(heroTimer.current) clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => {
      setHeroIdx(i => (i+1) % heroes.length);
    }, 4000);
  }, []);

  useState(() => { startHeroTimer(); return () => clearInterval(heroTimer.current); }, []);

  const switchHero = (idx) => { setHeroIdx(idx); startHeroTimer(); };

  useEffect(()=>{fetch("/api/prods").then(r=>r.ok?r.json():null).then(d=>{if(Array.isArray(d))setProds(d);else{try{const s=localStorage.getItem("yt_prods");const p=s&&JSON.parse(s);if(Array.isArray(p)&&p.length)setProds(p);}catch{}}}).catch(()=>{}).finally(()=>{prodsLoaded.current=true;});},[]);
  useEffect(()=>{if(!prodsLoaded.current)return;fetch("/api/prods",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(prods)}).catch(()=>{});},[prods]);
  const tr=async(text,to)=>{if(!text)return"";try{const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|${to}`);const j=await r.json();return j.responseData?.translatedText||text;}catch{return text;}};
  const autoTranslate=async()=>{
    if(!pName&&!pDesc)return;
    setTranslating(true);
    const[ne,nj,de,dj]=await Promise.all([tr(pName,"en"),tr(pName,"ja"),tr(pDesc,"en"),tr(pDesc,"ja")]);
    setPNameEn(ne);setPNameJa(nj);setPDescEn(de);setPDescJa(dj);
    setTranslating(false);
  };
  const aiDesc=async()=>{
    if(!pName){tw("상품명을 먼저 입력해주세요.");return;}
    setAiGenerating(true);
    const templates=[
      `${pName} 디자인이 담긴 프리미엄 폰케이스입니다. 고품질 소재로 제작되어 스마트폰을 안전하게 보호하면서도 귀여운 반려동물 일러스트로 일상에 특별함을 더해줍니다. 슬림한 디자인으로 그립감이 좋으며, 무선 충전과도 호환됩니다.`,
      `사랑스러운 ${pName} 일러스트가 프린팅된 감성 폰케이스. 내구성 높은 TPU 소재와 정밀한 프린팅 기술로 선명한 색감이 오래 유지됩니다. 반려동물을 사랑하는 분들에게 완벽한 아이템입니다.`,
      `${pName} 아트 폰케이스로 나만의 개성을 표현하세요. 부드러운 촉감의 매트 코팅으로 지문이 잘 남지 않으며, 카메라와 화면을 보호하는 범퍼 설계가 적용되었습니다. 반려동물 감성 가득한 특별한 케이스.`,
    ];
    const desc=templates[Math.floor(Math.random()*templates.length)];
    setPDesc(desc);
    setAiGenerating(false);
  };
  const autoTranslateNotice=async()=>{
    if(!ntTitle.ko&&!ntContent.ko)return;
    setNtTranslating(true);
    const[te,tj,ce,cj]=await Promise.all([tr(ntTitle.ko,"en"),tr(ntTitle.ko,"ja"),tr(ntContent.ko,"en"),tr(ntContent.ko,"ja")]);
    setNtTitle(t=>({...t,en:te,ja:tj}));setNtContent(c=>({...c,en:ce,ja:cj}));
    setNtTranslating(false);
  };
  const models=brand==="Apple"?IPHONE:GALAXY;
  const listRaw=cat==="All"?prods:PARENT_CATS.includes(cat)?prods.filter(p=>(p.type||"PhoneCase")===cat):openParent?prods.filter(p=>(p.type||"PhoneCase")===openParent&&p.cat===cat):prods.filter(p=>p.cat===cat);
  const list=[...listRaw].sort((a,b)=>{
    if(sortBy==="priceHigh")return b.price-a.price;
    if(sortBy==="priceLow")return a.price-b.price;
    if(sortBy==="popular")return(liked[b.id]?1:0)-(liked[a.id]?1:0);
    if(sortBy==="name")return(a.n[lang]||"").localeCompare(b.n[lang]||"");
    return b.id-a.id;
  });
  const ctPrice=(name)=>{const found=caseTypes.find(c=>(typeof c==="object"?c.ko:c)===name||(typeof c==="object"&&(c.en===name||c.ja===name)));return found&&found.price?found.price:0;};
  const ordRawTotal=ordItems.length>0?ordItems.reduce((s,it)=>s+((it.prod.price+ctPrice(it.caseType))*(it.qty||1)),0):(sel?sel.price+ctPrice(caseType):0);
  const discount=appliedCoupon?(appliedCoupon.type==="%"?Math.floor(ordRawTotal*appliedCoupon.discount/100):appliedCoupon.discount):0;
  const ordShipFee=ordRawTotal>=freeShipMin?0:defaultShipFee;
  const finalPrice=Math.max(0,ordRawTotal-discount)+ordShipFee;
  const tw=m=>{setToast(m);setTimeout(()=>setToast(null),2200);};
  const back=()=>{if(showOrd){setShowOrd(false);setOrdItems([]);return;}if(pg==="detail")setPg("shop");else if(pg==="cart")setPg("home");else if(pg==="forgotPw"||pg==="forgotId")setPg("login");else setPg("home");};
  const openDet=p=>{setSel(p);setIIdx(0);setBrand("Apple");setModel("");setCaseType("");setRevPage(0);setPg("detail");window.scrollTo(0,0);};
  const openOrd=()=>{
    if(!model){tw(t.selPhone);return;}
    if(caseTypes.length>0&&!caseType){tw(lang==="ko"?"케이스 유형을 선택해주세요.":lang==="ja"?"ケースタイプを選択してください。":"Please select a case type.");return;}
    const pr=user?profiles[user.email]:null;
    setStep(1);setOErr("");
    setNm(myName||pr?.name||user?.name||"");setAddr(myAddr||pr?.addr||"");setAddr2(myCity||pr?.city||"");
    setPh(myPhone||pr?.phone||"");setEm(myEmail||user?.email||"");setNote("");
    setPhotos([]);setPUrl("");setSnsLink("");setPetName("");setPayM("");setCBr("");setCN("");setCE("");setCv("");setOid("");
    setCouponInput("");setAppliedCoupon(null);setCouponMsg("");
    setShowOrd(true);
  };
  const addCart=()=>{if(!model){tw(t.selPhone);return;}if(caseTypes.length>0&&!caseType){tw(lang==="ko"?"케이스 유형을 선택해주세요.":lang==="ja"?"ケースタイプを選択してください。":"Please select a case type.");return;}setCart(c=>[...c,{id:Date.now(),prodId:sel.id,brand,model,caseType:caseType||"",qty:1}]);tw(t.addedCart);};
  const v1=()=>{if(!nm||!addr||!ph||!em){setOErr(t.fillReq);return false;}if(!/\S+@\S+\.\S+/.test(em)){setOErr(t.validEmail);return false;}setOErr("");return true;};
  const v2=()=>{if(!payM){setOErr(t.selPay);return false;}if(payM==="card"&&(!cBr||!cN||!cE||!cv)){setOErr(t.fillCard);return false;}setOErr("");return true;};
  const login_=()=>{if(!lE||!lP){setAErr(t.fillAll);return;}try{if(remember)localStorage.setItem("yt_email",lE);else localStorage.removeItem("yt_email");}catch{}if(lE.trim()==="admin@yourtail.com"&&lP.trim()==="admin1234"){setUser({name:"Admin",email:"admin@yourtail.com"});setAErr("");setPg("admin");return;}const found=users.find(u=>u.email===lE&&u.password===lP);if(!found){setAErr(lang==="ko"?"이메일 또는 비밀번호가 올바르지 않습니다.":lang==="ja"?"メールまたはパスワードが正しくありません。":"Invalid email or password.");return;}setUser({name:found.name,email:found.email});const pr=profiles[found.email]||{};setMyName(pr.name||found.name);setMyEmail(pr.email||found.email);setMyAddr(pr.addr||"");setMyCity(pr.city||"");setMyPhone(pr.phone||"");setMyAvatar(pr.avatar||"");setAErr("");setPg("mypage");};
  const signup_=()=>{if(!sN||!sE||!sP){setAErr(t.fillAll);return;}if(users.find(u=>u.email===sE)){setAErr(lang==="ko"?"이미 가입된 이메일입니다.":lang==="ja"?"すでに登録済みのメールアドレスです。":"This email is already registered.");return;}setUsers(u=>[...u,{name:sN,email:sE,password:sP}]);
setAdminUsers(u=>[...u,{name:sN,email:sE,date:new Date().toISOString().slice(0,10),orders:0}]);setUser({name:sN,email:sE});const dp={name:sN||"Name",addr:"Street Address",city:"City, Zip, Country",phone:"Phone Number"};setProfiles(p=>({...p,[sE]:dp}));setMyName(dp.name);setMyEmail(sE);setMyAddr(dp.addr);setMyCity(dp.city);setMyPhone(dp.phone);setMyAvatar("");setAErr("");setPg("mypage");};
  const prevSlide=useCallback(()=>setIIdx(i=>(i-1+7)%7),[]);
  const nextSlide=useCallback(()=>setIIdx(i=>(i+1)%7),[]);
  const swipe=useSwipe(nextSlide,prevSlide);
  const onCD=e=>{chipDrag.current={x:e.clientX||e.touches?.[0]?.clientX,sl:chipRef.current.scrollLeft};};
  const onCM=e=>{if(!chipDrag.current)return;const x=e.clientX||e.touches?.[0]?.clientX;chipRef.current.scrollLeft=chipDrag.current.sl-(x-chipDrag.current.x);};
  const onCU=()=>{chipDrag.current=null;};
  const onSCD=e=>{subChipDrag.current={x:e.clientX||e.touches?.[0]?.clientX,sl:subChipRef.current.scrollLeft};};
  const onSCM=e=>{if(!subChipDrag.current)return;const x=e.clientX||e.touches?.[0]?.clientX;subChipRef.current.scrollLeft=subChipDrag.current.sl-(x-subChipDrag.current.x);};
  const onSCU=()=>{subChipDrag.current=null;};
  const onACD=e=>{adminChipDrag.current={x:e.clientX||e.touches?.[0]?.clientX,sl:adminChipRef.current.scrollLeft};};
  const onACM=e=>{if(!adminChipDrag.current)return;const x=e.clientX||e.touches?.[0]?.clientX;adminChipRef.current.scrollLeft=adminChipDrag.current.sl-(x-adminChipDrag.current.x);};
  const onACU=()=>{adminChipDrag.current=null;};
  const onASD=e=>{adminSubDrag.current={x:e.clientX||e.touches?.[0]?.clientX,sl:adminSubRef.current.scrollLeft};};
  const onASM=e=>{if(!adminSubDrag.current)return;const x=e.clientX||e.touches?.[0]?.clientX;adminSubRef.current.scrollLeft=adminSubDrag.current.sl-(x-adminSubDrag.current.x);};
  const onASU=()=>{adminSubDrag.current=null;};
  const onATD=e=>{adminTabDrag.current={x:e.clientX||e.touches?.[0]?.clientX,sl:adminTabRef.current.scrollLeft};};
  const onATM=e=>{if(!adminTabDrag.current)return;const x=e.clientX||e.touches?.[0]?.clientX;adminTabRef.current.scrollLeft=adminTabDrag.current.sl-(x-adminTabDrag.current.x);};
  const onATU=()=>{adminTabDrag.current=null;};

  const ss = {
root:{minHeight:"100vh",background:"#F6F6F6",display:"flex",justifyContent:"center"},
    app:{position:"relative",width:"100%",maxWidth:390,minHeight:"100vh",background:C.cr,overflow:"hidden",flexShrink:0,fontFamily:lang==="ja"?"'Pretendard','Noto Sans JP',sans-serif":lang==="ko"?"'Pretendard','Nanum Gothic',sans-serif":"'Pretendard',Georgia,serif"},
    hdr:{position:"sticky",top:0,zIndex:300,display:"flex",alignItems:"center",height:48},
    logoBox:{display:"flex",alignItems:"center",background:C.br,height:"100%",padding:"0 14px",cursor:"pointer",flexShrink:0},
    hdrRight:{display:"flex",alignItems:"center",background:C.br,height:"100%",flex:1,justifyContent:"flex-end",padding:"0 8px",gap:2},
    iconBtn:{background:"none",border:"none",cursor:"pointer",padding:"5px 6px",display:"flex",alignItems:"center",position:"relative"},
    loginBtn:{background:"none",border:`1px solid #FFFFFF`,borderRadius:10,color:"#FFFFFF",fontSize:11,fontWeight:700,padding:"4px 8px",cursor:"pointer",fontFamily:lang==="ko"?"'Nanum Gothic', sans-serif":lang==="ja"?"'Noto Sans JP', sans-serif":"Georgia,serif",marginLeft:2},
    badge:{position:"absolute",top:1,right:1,background:"#000",color:"#FFFFFF",fontSize:9,fontWeight:700,borderRadius:"50%",width:13,height:13,display:"flex",alignItems:"center",justifyContent:"center"},
    langWrap:{position:"relative"},
    langBtn:{background:"none",border:`1px solid #FFFFFF`,borderRadius:10,color:"#FFFFFF",fontSize:10,fontWeight:700,padding:"3px 7px",cursor:"pointer"},
    langDD:{position:"absolute",top:28,right:0,background:C.cr,borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",overflow:"hidden",zIndex:999,minWidth:70},
    // Hero
    heroWrap:{width:"100%",height:"calc(100vh - 48px)",position:"relative",overflow:"hidden"},
    heroImg:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",transition:"opacity 0.5s ease"},
    heroGrad:{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(255,201,75,0.92) 0%,rgba(255,251,238,0.15) 50%,transparent 100%)"},
heroDots:{position:"absolute",bottom:145,right:28,display:"flex",gap:8,zIndex:2},    heroText:{position:"absolute",bottom:44,left:0,right:0,padding:"0 28px"},
    heroSub:{fontSize:15,color:"rgba(255,251,238,0.95)",marginBottom:24,fontStyle:"italic",fontWeight:700,textShadow:"0 2px 14px rgba(0,0,0,0.4)",lineHeight:1.15,textAlign:"left",fontFamily:"Georgia, serif"},
    ctaBtn:{background:"#FFFBEE",color:"#FFC94B",border:"none",borderRadius:28,fontSize:13,fontWeight:700,padding:"12px 28px",cursor:"pointer",fontFamily:lang==="ja"?"'Noto Sans JP', Georgia, serif":lang==="ko"?"'Nanum Gothic', Georgia, serif":"Georgia, serif"},
    // Shop
    shopWrap:{minHeight:"calc(100vh - 48px)",paddingBottom:16,background:"#FFFFFF"},
    chipBar:{background:"#FFFDF5",padding:"9px 12px",display:"flex",justifyContent:"flex-start",gap:7,overflowX:"auto",borderBottom:`2px solid ${C.dy}`,position:"sticky",top:48,zIndex:100,userSelect:"none",scrollbarWidth:"none",msOverflowStyle:"none"},
    chip:{flexShrink:0,border:"1.5px solid transparent",borderRadius:18,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Georgia,serif",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5},
    grid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"12px"},
    card:{background:"#FFFEF5",borderRadius:12,overflow:"hidden",border:"1px solid #F5F5F5",cursor:"pointer",display:"flex",flexDirection:"column"},
    cardImg:{aspectRatio:"3/4",background:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontSize:44},
    // Detail
    detailWrap:{paddingBottom:80,minHeight:"calc(100vh - 48px)",background:"#FFFFFF"},
    carousel:{width:"100%",aspectRatio:"1",background:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"grab",userSelect:"none"},
    carBtn:{background:"#FFFFFF",border:"none",width:40,height:"100%",fontSize:26,color:C.y,cursor:"pointer",flexShrink:0},
    dots:{display:"flex",justifyContent:"center",gap:5,padding:"8px 0",background:`linear-gradient(135deg,${C.y},${C.dy})`},
    ctaBar:{position:"sticky",bottom:0,background:"rgba(255,251,238,0.97)",backdropFilter:"blur(8px)",borderTop:`1px solid rgba(107,58,42,0.1)`,padding:"9px 12px 14px",display:"flex",gap:7,zIndex:200},
    // Modal
    modalBg:{position:"absolute",inset:0,background:"rgba(74,37,22,0.65)",zIndex:600,display:"flex",alignItems:"flex-end"},
    modalSheet:{width:"100%",background:"#FFFFFF",borderRadius:"18px 18px 0 0",maxHeight:"92%",display:"flex",flexDirection:"column",overflow:"hidden"},
    // Auth
    authWrap:{minHeight:"calc(100vh - 48px)",background:C.cr,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 18px"},
    authCard:{width:"100%",background:"#fff",borderRadius:16,padding:"28px 22px",boxShadow:"0 4px 22px rgba(107,58,42,0.12)",textAlign:"center"},
fullBtn:{display:"block",width:"100%",background:C.br,color:"#FFFFFF",border:"none",borderRadius:10,padding:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",marginBottom:10},    // Mypage
    profileBanner:{background:C.y,padding:"18px 16px",display:"flex",alignItems:"center",gap:12},
    tabs:{display:"flex",background:C.y,borderBottom:`2px solid ${C.y}`},
    tabBtn:{flex:1,padding:"11px",background:"none",border:"none",outline:"none",fontSize:12,fontWeight:600,color:"#FFFFFF",cursor:"pointer",fontFamily:"Georgia,serif"},
  };

  return(
    <div style={ss.root}>
  <style>{`*::-webkit-scrollbar{display:none} button{outline:none!important} button,input,select,textarea{font-family:inherit!important}`}</style>
      <div style={ss.app}>

        {/* HEADER */}
        <div style={ss.hdr}>
          <div style={ss.logoBox} onClick={()=>{setPg("home");setMenu(false);setShowL(false);}}>
            <img src={LOGO_HEADER} alt="your tail" style={{height:26,width:"auto"}}/>
          </div>
          <div style={ss.hdrRight}>
            {/* Lang */}
            <div style={ss.langWrap}>
              <button style={ss.langBtn} onClick={()=>setShowL(v=>!v)}>
                {LANGS.find(l=>l.c===lang)?.l}
              </button>
              {showL&&(
                <div style={ss.langDD}>
                  {LANGS.map(l=>(
                    <button key={l.c} style={{display:"block",width:"100%",padding:"8px 12px",background:lang===l.c?C.y:"none",border:"none",fontSize:12,fontWeight:700,color:lang===l.c?"#FFFFFF":C.br,cursor:"pointer",fontFamily:"Georgia,serif",textAlign:"left"}} onClick={()=>{setLang(l.c);setShowL(false);}}>
                      {l.l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user?(
              <button style={ss.iconBtn} onClick={()=>{setPg(user?.email==="admin@yourtail.com"?"admin":"mypage");setShowL(false);}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"  stroke="#FFFFFF" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </button>
            ):(
              <button style={ss.loginBtn} onClick={()=>{setAErr("");setPg("login");setShowL(false);}}>{t.login}</button>
            )}
            <button style={ss.iconBtn} onClick={()=>{if(!user){tw(lang==="ko"?"로그인이 필요합니다":lang==="ja"?"ログインが必要です":"Please log in first");setPg("login");setShowL(false);return;}setWishSnap(prods.filter(p=>liked[p.id]).map(p=>p.id));setPg("wishlist");setShowL(false);}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {Object.values(liked).filter(Boolean).length>0&&<span style={ss.badge}>{Object.values(liked).filter(Boolean).length}</span>}
            </button>
            <button style={ss.iconBtn} onClick={()=>{if(!user){tw(lang==="ko"?"로그인이 필요합니다":lang==="ja"?"ログインが必要です":"Please log in first");setPg("login");setShowL(false);return;}setPg("cart");setShowL(false);}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {cart.length>0&&<span style={ss.badge}>{cart.length}</span>}
            </button>
            <button style={ss.iconBtn} onClick={()=>{pg==="home"?setMenu(v=>!v):back();setShowL(false);}}>
              {pg==="home"?(
                <div style={{display:"flex",flexDirection:"column",gap:4}}><div style={{width:17,height:2,background:"#FFFFFF",borderRadius:2}}/><div style={{width:17,height:2,background:"#FFFFFF",borderRadius:2}}/><div style={{width:17,height:2,background:"#FFFFFF",borderRadius:2}}/></div>
              ):(
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* DRAWER */}
        {menu&&(
          <>
            <div style={{position:"absolute",inset:0,background:"rgba(74,37,22,0.5)",zIndex:400}} onClick={()=>setMenu(false)}/>
<nav style={{position:"absolute",top:0,right:0,width:210,height:"100%",minHeight:"100vh",background:"#FFFBEE",zIndex:500,display:"flex",flexDirection:"column",overflowY:"auto",borderLeft:`2px solid ${C.y}`}}>
              <button style={{position:"absolute",top:11,right:11,background:"none",border:"none",color:C.br,fontSize:16,cursor:"pointer",opacity:0.5}} onClick={()=>setMenu(false)}>✕</button>
              <div style={{display:"flex",alignItems:"center",padding:"48px 16px 12px",borderBottom:`1px solid ${C.y}`}}>
                <img src={LOGO_HEADER} alt="your tail" style={{height:22,width:"auto",filter:"brightness(0.3)"}}/>
              </div>
              <button style={{background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",cursor:"pointer",borderBottom:`1px solid rgba(249,221,129,0.4)`,fontFamily:"Georgia,serif",width:"100%"}} onClick={()=>{setPg("notices");setOpenNotice(null);setMenu(false);}}>
                <span style={{color:"#2A2A2A",fontSize:13,fontWeight:600}}>{lang==="ko"?"공지사항":lang==="ja"?"お知らせ":"Notices"}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6B3A2A" strokeWidth="2.5" opacity="0.4"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button style={{background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",cursor:"pointer",borderBottom:`1px solid rgba(249,221,129,0.4)`,fontFamily:"Georgia,serif",width:"100%"}} onClick={()=>{setCat("All");setOpenParent(null);setPg("shop");setMenu(false);}}>
                <span style={{color:"#2A2A2A",fontSize:13,fontWeight:600}}>{cl.All}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6B3A2A" strokeWidth="2.5" opacity="0.4"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              {PARENT_CATS.map(pc=>{const hasSub=pc==="PhoneCase";return(<div key={pc}>
              {hasSub?(<>
              <button style={{background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",cursor:"pointer",borderBottom:openParent===pc?"none":`1px solid rgba(249,221,129,0.4)`,fontFamily:"Georgia,serif",width:"100%"}} onClick={()=>setOpenParent(v=>v===pc?null:pc)}>
                <span style={{color:"#2A2A2A",fontSize:13,fontWeight:600}}>{cl[pc]}</span>
                <span style={{fontSize:10,color:"#6B3A2A",opacity:0.5}}>{openParent===pc?"▾":"▸"}</span>
              </button>
              {openParent===pc&&SUB_CATS.map(c=>(
                <button key={c} style={{background:"#FFFFFF",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 16px 9px 32px",cursor:"pointer",borderBottom:`1px solid rgba(249,221,129,0.25)`,fontFamily:"Georgia,serif",width:"100%"}} onClick={()=>{setCat(c);setPg("shop");setMenu(false);}}>
                  <span style={{color:"#2A2A2A",fontSize:12,fontWeight:500}}>{cl[c]}</span>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#6B3A2A" strokeWidth="2.5" opacity="0.3"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
              </>):(
              <button style={{background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",cursor:"pointer",borderBottom:`1px solid rgba(249,221,129,0.4)`,fontFamily:"Georgia,serif",width:"100%"}} onClick={()=>{setCat(pc);setOpenParent(null);setPg("shop");setMenu(false);}}>
                <span style={{color:"#2A2A2A",fontSize:13,fontWeight:600}}>{cl[pc]}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6B3A2A" strokeWidth="2.5" opacity="0.4"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              )}
              </div>)})}
              {/* Lang in drawer */}
              <div style={{padding:"12px 16px",borderBottom:`1px solid rgba(249,221,129,0.4)`}}>
                <p style={{color:"#2A2A2A",fontSize:9,letterSpacing:"0.14em",margin:"0 0 7px"}}>LANGUAGE</p>
                <div style={{display:"flex",gap:5}}>
                  {LANGS.map(l=>(
<button key={l.c} style={{flex:1,padding:"6px 4px",borderRadius:7,border:`1.5px solid ${lang===l.c?C.br:C.lb}`,background:lang===l.c?C.br:"#FFFFFF",fontSize:10,fontWeight:700,color:lang===l.c?"#FFFFFF":C.br,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>setLang(l.c)}>                      {l.l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{padding:"12px 16px"}}>
                {!user?(<>
                  <button style={ss.fullBtn} onClick={()=>{setPg("login");setMenu(false);}}>{t.login}</button>
                  <button style={{...ss.fullBtn,background:"#FFFFFF",border:`1.5px solid ${C.br}`,color:C.br}} onClick={()=>{setPg("signup");setMenu(false);}}>{t.signup}</button>
                </>):(<>
                  <button style={ss.fullBtn} onClick={()=>{setPg(user?.email==="admin@yourtail.com"?"admin":"mypage");setMenu(false);}}>{t.mypage}</button>
                  <button style={{...ss.fullBtn,background:"#FFFFFF",border:`1.5px solid ${C.br}`,color:C.br}} onClick={()=>{setUser(null);setMyName("");setMyEmail("");setMyAddr("");setMyCity("");setMyPhone("");setMyAvatar("");setMenu(false);setPg("home");}}>{t.logout}</button>
                </>)}
              </div>
              {user&&user.email!=="admin@yourtail.com"&&(
                <div style={{padding:"0 16px 16px",marginTop:"auto"}}>
                  <button style={{background:"none",border:"none",fontSize:10,color:"#999",cursor:"pointer",padding:0}} onClick={()=>setShowDeleteConfirm(true)}>{lang==="ko"?"회원탈퇴":lang==="ja"?"退会する":"Delete Account"}</button>
                </div>
              )}
            </nav>
          </>
        )}

        {/* HOME */}
        {pg==="home"&&heroesReady&&(
          <div style={ss.heroWrap} onTouchStart={e=>{const t=e.touches[0].clientX;e.currentTarget.dataset.sx=t;}} onTouchEnd={e=>{const d=e.changedTouches[0].clientX-e.currentTarget.dataset.sx;if(d<-40)switchHero((heroIdx+1)%heroes.length);else if(d>40)switchHero((heroIdx-1+heroes.length)%heroes.length);}} onMouseDown={e=>{e.currentTarget.dataset.sx=e.clientX;}} onMouseUp={e=>{const d=e.clientX-e.currentTarget.dataset.sx;if(d<-40)switchHero((heroIdx+1)%heroes.length);else if(d>40)switchHero((heroIdx-1+heroes.length)%heroes.length);}}>
            <img src={heroes[heroIdx]} alt="" style={ss.heroImg}/>
            <div style={ss.heroGrad}/>
            {/* Hero dots */}
            <div style={ss.heroDots}>
            </div>
            <div style={ss.heroText}>
              <img src={LOGO_HERO} alt="your tail" style={{height:100,width:"auto",display:"block",marginBottom:16,filter:"drop-shadow(0 2px 10px rgba(0,0,0,0.35))"}}/>
              <p style={ss.heroSub}>{heroSubText}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
  <button style={ss.ctaBtn} onClick={()=>{setCat("All");setPg("shop");}}>{heroBtnText||t.shopNow} →</button>
  <div style={{display:"flex",gap:8}}>
    {heroes.map((_,i)=>(
      <button key={i} onClick={()=>switchHero(i)} style={{width:i===heroIdx?20:7,height:7,borderRadius:4,background:i===heroIdx?"#fff":"rgba(255,255,255,0.45)",border:"none",cursor:"pointer",padding:0,transition:"all 0.3s"}}/>
    ))}
  </div>
</div>
            </div>
          </div>
        )}

        {/* SHOP */}
        {pg==="shop"&&(
          <div style={ss.shopWrap}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4,padding:"4px 14px 8px"}}>
              <span style={{fontSize:11,color:"#999"}}>{list.length}{lang==="ko"?"개 상품":lang==="ja"?"件の商品":" products"}</span>
              <div style={{display:"flex",gap:4}}>
                {[["popular",lang==="ko"?"인기순":lang==="ja"?"人気順":"Popular"],["latest",lang==="ko"?"최신순":lang==="ja"?"新着順":"Latest"],["priceLow",lang==="ko"?"낮은가격":lang==="ja"?"安い順":"Low"],["priceHigh",lang==="ko"?"높은가격":lang==="ja"?"高い順":"High"],["name",lang==="ko"?"이름순":lang==="ja"?"名前順":"Name"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setSortBy(k)} style={{padding:"3px 8px",borderRadius:12,border:`1px solid ${sortBy===k?"#555":"#DDD"}`,background:sortBy===k?"#555":"#fff",color:sortBy===k?"#fff":"#888",fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex"}}>
            <div style={{display:"flex",flexDirection:"column",gap:2,padding:"0 0 0 6px",flexShrink:0,marginRight:24,position:"relative"}}>
              <button style={{padding:"7px 6px",border:"none",borderLeft:cat==="All"?`3px solid ${C.y}`:"3px solid transparent",background:cat==="All"?"rgba(255,201,75,0.1)":"none",color:cat==="All"?C.y:"#888",fontSize:12,fontWeight:cat==="All"?700:500,cursor:"pointer",textAlign:"left",whiteSpace:"nowrap",width:"fit-content"}} onClick={()=>{setCat("All");setOpenParent(null);setShopPage(0);}}>
                {cl.All}
              </button>
              {PARENT_CATS.map(pc=>{const hasSub=pc==="PhoneCase";const isOpen=openParent===pc;const active=cat===pc||(hasSub&&isOpen&&SUB_CATS.includes(cat));return(
              <span key={pc} style={{display:"contents"}}>
                <button style={{padding:"7px 6px",border:"none",borderLeft:active?`3px solid ${C.y}`:"3px solid transparent",background:active?"rgba(255,201,75,0.1)":"none",color:active?C.y:"#888",fontSize:12,fontWeight:active?700:500,cursor:"pointer",textAlign:"left",whiteSpace:"nowrap",width:"fit-content"}} onClick={()=>{setShopPage(0);if(hasSub){if(isOpen){setOpenParent(null);setCat(pc);}else{setOpenParent(pc);setCat(pc);}}else{setCat(pc);setOpenParent(null);}}}>
                  {cl[pc]}{hasSub&&<span style={{fontSize:10,marginLeft:2}}>{isOpen?"▾":"▸"}</span>}
                </button>
                {hasSub&&isOpen&&SUB_CATS.map(c=>{const on=cat===c;return(
                  <button key={c} style={{padding:"5px 6px 5px 14px",border:"none",borderLeft:on?"3px solid #999":"3px solid transparent",background:on?"rgba(0,0,0,0.06)":"none",color:on?"#555":"#888",fontSize:11,fontWeight:on?700:500,cursor:"pointer",textAlign:"left",whiteSpace:"nowrap",width:"fit-content"}} onClick={()=>{setCat(c);setShopPage(0);}}>
                    {cl[c]}
                  </button>);})}
              </span>);})}
            </div>
            <div style={{flex:1}}>
            {(()=>{const perPage=6;const totalPages=Math.max(1,Math.ceil(list.length/perPage));const pg2=Math.min(shopPage,totalPages-1);const paged=list.slice(pg2*perPage,(pg2+1)*perPage);return(<>
            <div style={ss.grid}>
              {paged.map(p=>(
                <div key={p.id} style={ss.card} onClick={()=>openDet(p)}>
                  <div style={ss.cardImg}>
                    {p.thumb?<img src={p.thumb} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"#E0E0E0"}}/>}
                    {p.tag&&<span style={{position:"absolute",top:7,left:7,background:C.br,color:"#FFFFFF",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:18}}>{p.tag}</span>}
                    <button style={{position:"absolute",top:6,right:7,background:"rgba(0,0,0,0.55)",border:"none",outline:"none",cursor:"pointer",fontSize:14,lineHeight:1,width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>{e.stopPropagation();setLiked(l=>({...l,[p.id]:!l[p.id]}));}}>
                      <span style={{color:liked[p.id]?C.y:"#FFFFFF"}}>♥</span>
                    </button>
                  </div>
                  <div style={{padding:"9px 10px 12px",display:"flex",flexDirection:"column",justifyContent:"space-between",flex:1}}>
                    <p style={{fontSize:10,color:"#000000",margin:"0 0 7px",fontWeight:600,lineHeight:1.3,textAlign:"left"}}>{p.n[lang]}</p>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto"}}>
                      <span style={{fontSize:10,fontWeight:700,color:C.ru}}>{fmtPrice(p.price)}</span>
                      <span style={{fontSize:10,color:"#fff",background:C.y,width:18,height:18,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages>1&&(
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:14,padding:"14px 0"}}>
                <button disabled={pg2===0} onClick={()=>setShopPage(p=>p-1)} style={{background:"none",border:`1px solid ${pg2===0?"#EEE":C.y}`,borderRadius:8,padding:"6px 14px",fontSize:12,cursor:pg2===0?"default":"pointer",color:pg2===0?"#CCC":C.y,fontWeight:600}}>←</button>
                <span style={{fontSize:12,color:"#666"}}>{pg2+1} / {totalPages}</span>
                <button disabled={pg2>=totalPages-1} onClick={()=>setShopPage(p=>p+1)} style={{background:"none",border:`1px solid ${pg2>=totalPages-1?"#EEE":C.y}`,borderRadius:8,padding:"6px 14px",fontSize:12,cursor:pg2>=totalPages-1?"default":"pointer",color:pg2>=totalPages-1?"#CCC":C.y,fontWeight:600}}>→</button>
              </div>
            )}
            </>);})()}
            </div>
            </div>
          </div>
        )}

        {/* DETAIL */}
        {pg==="detail"&&sel&&(
          <div style={ss.detailWrap}>
            <div style={ss.carousel} {...swipe}>
              <button style={ss.carBtn} onClick={prevSlide}>‹</button>
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,pointerEvents:"none",fontSize:88,position:"relative",alignSelf:"stretch"}}>
                {(()=>{const src=iIdx===0?sel.thumb:(sel.subs&&sel.subs[iIdx-1]);return src?<img src={src} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<span>{iIdx===0?sel.e:SLIDES[iIdx]}</span>;})()}
              </div>
              <button style={ss.carBtn} onClick={nextSlide}>›</button>
            </div>
            <div style={{...ss.dots,justifyContent:"space-between",padding:"8px 16px"}}>
  <span style={{fontSize:11,color:"#FFFFFF",opacity:0.8}}>{iIdx+1} / 7</span>
  <div style={{display:"flex",gap:5,alignItems:"center"}}>
    {SLIDES.map((_,i)=><button key={i} style={{width:6,height:6,borderRadius:"50%",background:i===iIdx?"#FFFFFF":"rgba(255,255,255,0.5)",border:"none",cursor:"pointer",padding:0,transition:"all 0.2s",transform:i===iIdx?"scale(1.3)":"scale(1)"}} onClick={()=>setIIdx(i)}/>)}
  </div>
</div>
            <div style={{padding:"16px 16px 0",textAlign:"left"}}>
              <div style={{display:"flex",gap:7,marginBottom:10}}>
                <span style={{fontSize:11,color:C.y,border:`1px solid ${C.y}`,borderRadius:18,padding:"2px 9px",background:"#FFFFFF"}}>{cl[sel.cat]}</span>
                {sel.tag&&<span style={{fontSize:11,background:C.y,color:"#FFFFFF",borderRadius:18,padding:"2px 9px",fontWeight:700}}>{sel.tag}</span>}
              </div>
              <h2 style={{fontSize:20,fontWeight:700,color:"#000000",margin:"0 0 6px",fontStyle:"italic"}}>{sel.n[lang]}</h2>
              <p style={{fontSize:19,fontWeight:700,color:C.ru,margin:"0 0 14px"}}>{fmtPrice(sel.price)}</p>
              <div style={{height:1,background:"rgba(107,58,42,0.1)",margin:"0 0 14px"}}/>
              <p style={{fontSize:13,color:"#333",lineHeight:1.7,margin:"0 0 16px"}}>{sel.d[lang]}</p>
              {/* Model selector */}
              <div style={{background:"rgba(249,221,129,0.35)",borderRadius:12,padding:13,marginBottom:14,border:`1px solid ${C.dy}`}}>
                <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 9px"}}>{t.selectModel}</p>
                <div style={{display:"flex",gap:7,marginBottom:9}}>
                  {["Apple","Galaxy"].map(b=>(
                    <button key={b} style={{flex:1,padding:8,borderRadius:9,border:`1.5px solid ${C.y}`,background:brand===b?C.y:"#FFFFFF",fontSize:12,fontWeight:600,color:brand===b?"#FFFFFF":C.y,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>{setBrand(b);setModel("");}}>
                      {b==="Apple"?"Apple":"Galaxy"}
                    </button>
                  ))}
                </div>
                <select style={{width:"100%",padding:"9px 11px",borderRadius:9,border:`1.5px solid ${C.lb}`,background:"#FFFFFF",fontSize:12,color:"#000000",fontFamily:"Georgia,serif",cursor:"pointer",outline:"none"}} value={model} onChange={e=>setModel(e.target.value)}>
                  <option value="">{t.chooseModel}</option>
                  {models.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
                {model&&<p style={{marginTop:7,fontSize:11,color:C.ru,fontWeight:700}}>✔ {brand} · {model}</p>}
              </div>
              {caseTypes.length>0&&(
              <div style={{background:"rgba(249,221,129,0.35)",borderRadius:12,padding:13,marginBottom:14,border:`1px solid ${C.dy}`}}>
                <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 9px"}}>{lang==="ko"?"케이스 유형":lang==="ja"?"ケースタイプ":"Case Type"}</p>
                {(()=>{const usedCats=[...new Set(caseTypes.filter(ct=>typeof ct==="object"&&ct.cat).map(ct=>ct.cat))];const noCat=caseTypes.filter(ct=>typeof ct==="string"||!ct.cat);return(<>
                  {usedCats.map(catKo=>{const catObj=caseCats.find(cc=>cc.ko===catKo);const catName=catObj?(catObj[lang]||catObj.ko):catKo;const items=caseTypes.filter(ct=>typeof ct==="object"&&ct.cat===catKo);return items.length>0&&(
                    <div key={catKo} style={{marginBottom:8}}>
                      <p style={{fontSize:10,fontWeight:700,color:"#666",margin:"0 0 5px"}}>{catName}</p>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {items.map((ct,ci)=>{const ctName=ct[lang]||ct.ko||ct.en;const isActive=caseType===(ct[lang]||ct.ko);return(
                          <button key={ci} style={{padding:"7px 12px",borderRadius:9,border:`1.5px solid ${C.y}`,background:isActive?C.y:"#FFFFFF",fontSize:11,fontWeight:600,color:isActive?"#FFFFFF":C.y,cursor:"pointer"}} onClick={()=>setCaseType(ct[lang]||ct.ko)}>{ctName}<span style={{fontSize:9,opacity:0.8}}> {ct.price>0?`+${fmtPrice(ct.price)}`:fmtPrice(0)}</span></button>
                        );})}
                      </div>
                    </div>
                  );})}
                  {noCat.length>0&&(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {noCat.map((ct,ci)=>{const ctName=typeof ct==="string"?ct:(ct[lang]||ct.ko||ct.en);const isActive=typeof ct==="string"?caseType===ct:caseType===(ct[lang]||ct.ko);const ctP=typeof ct==="object"&&ct.price?ct.price:0;return(
                        <button key={ci} style={{padding:"7px 12px",borderRadius:9,border:`1.5px solid ${C.y}`,background:isActive?C.y:"#FFFFFF",fontSize:11,fontWeight:600,color:isActive?"#FFFFFF":C.y,cursor:"pointer"}} onClick={()=>setCaseType(typeof ct==="string"?ct:(ct[lang]||ct.ko))}>{ctName}<span style={{fontSize:9,opacity:0.8}}> {ctP>0?`+${fmtPrice(ctP)}`:fmtPrice(0)}</span></button>
                      );})}
                    </div>
                  )}
                </>);})()}
                {caseType&&<p style={{marginTop:7,fontSize:11,color:C.ru,fontWeight:700}}>✔ {caseType}</p>}
                {caseType&&caseTypes.find(ct=>typeof ct!=="string"&&(ct[lang]||ct.ko)===caseType&&ct.img)&&(
                  <div style={{marginTop:8,textAlign:"center"}}><img src={caseTypes.find(ct=>typeof ct!=="string"&&(ct[lang]||ct.ko)===caseType).img} style={{width:"100%",maxWidth:800,height:"auto",aspectRatio:"1/1",objectFit:"contain",borderRadius:8,border:"1px solid #EEE"}} alt="case type"/></div>
                )}
              </div>
              )}
              <div style={{background:"#FFFFFF",borderRadius:11,padding:"12px 14px",marginBottom:13,border:`1px solid ${C.dy}`}}>
                <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 4px"}}>{t.custom.replace("🐾 ","")}</p>
                <p style={{fontSize:11,color:"#999999",lineHeight:1.6,margin:0}}>{t.customDesc}</p>
              </div>
           <div style={{marginBottom:7}}><p style={{fontSize:10,color:"#000000",margin:0}}><b>Shipping:</b> {t.shipping}</p></div>
<div style={{marginBottom:16}}><p style={{fontSize:10,color:"#000000",margin:0}}><b>Returns:</b> {t.returns}</p></div>
              {/* REVIEWS */}
              {(()=>{const isAdmin=user&&user.email==="admin@yourtail.com";const prodReviews=reviews.filter(r=>r.prodId===sel.id);const avg=prodReviews.length>0?Math.round(prodReviews.reduce((s,r)=>s+r.rating,0)/prodReviews.length*10)/10:0;const hasPurchased=user&&orders.some(o=>o.userEmail===user.email&&o.items&&o.items.some(it=>it.prodId===sel.id));const alreadyReviewed=!isAdmin&&user&&prodReviews.some(r=>r.email===user.email);return(
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#333",margin:0}}>{lang==="ko"?"리뷰":lang==="ja"?"レビュー":"Reviews"} ({prodReviews.length})</p>
                  {avg>0&&<span style={{fontSize:11,color:"#FFC94B",fontWeight:700}}>★ {avg}</span>}
                </div>
                {prodReviews.length===0&&<p style={{fontSize:11,color:"#999",margin:"0 0 8px"}}>{lang==="ko"?"아직 리뷰가 없습니다.":lang==="ja"?"まだレビューはありません。":"No reviews yet."}</p>}
                {(()=>{const perPage=3;const totalPages=Math.ceil(prodReviews.length/perPage);const page=Math.min(revPage,Math.max(totalPages-1,0));const paged=prodReviews.slice(page*perPage,page*perPage+perPage);return<>{paged.map(r=>(
                  <div key={r.id} style={{background:"#FAFAFA",borderRadius:8,padding:"8px 10px",marginBottom:6,border:"1px solid #F5F5F5"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                      <span style={{fontSize:10,fontWeight:600,color:"#333"}}>{r.name}</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:9,color:"#999"}}>{r.date}</span>
                        {isAdmin&&<button style={{background:"none",border:"none",fontSize:9,color:"#E53935",cursor:"pointer",padding:0,fontWeight:600}} onClick={()=>setReviews(rs=>rs.filter(x=>x.id!==r.id))}>삭제</button>}
                      </div>
                    </div>
                    <p style={{fontSize:11,color:"#FFC94B",margin:"0 0 3px"}}>{"★".repeat(r.rating)+"☆".repeat(5-r.rating)}</p>
                    <p style={{fontSize:11,color:"#555",margin:0,lineHeight:1.4}}>{r.text}</p>
                    {r.images&&r.images.length>0&&(
                      <div style={{display:"flex",gap:4,marginTop:6}}>{r.images.map((img,ii)=><img key={ii} src={img} alt="" style={{width:56,height:56,borderRadius:6,objectFit:"cover",border:"1px solid #EEE",cursor:"pointer"}} onClick={()=>window.open(img,"_blank")}/>)}</div>
                    )}
                  </div>
                ))}
                {totalPages>1&&(
                  <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:6,marginTop:6}}>
                    <button style={{background:"none",border:"none",fontSize:12,cursor:page>0?"pointer":"default",color:page>0?"#333":"#CCC",padding:"2px 6px"}} disabled={page===0} onClick={()=>setRevPage(p=>p-1)}>←</button>
                    {Array.from({length:totalPages},(_,i)=><button key={i} style={{width:22,height:22,borderRadius:11,border:"none",background:i===page?C.y:"#F0F0F0",color:i===page?"#fff":"#666",fontSize:10,fontWeight:600,cursor:"pointer"}} onClick={()=>setRevPage(i)}>{i+1}</button>)}
                    <button style={{background:"none",border:"none",fontSize:12,cursor:page<totalPages-1?"pointer":"default",color:page<totalPages-1?"#333":"#CCC",padding:"2px 6px"}} disabled={page===totalPages-1} onClick={()=>setRevPage(p=>p+1)}>→</button>
                  </div>
                )}</>;})()}
                {user&&(isAdmin||hasPurchased)&&!alreadyReviewed&&(
                  <div style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #F5F5F5",marginTop:8}}>
                    <p style={{fontSize:10,fontWeight:700,color:"#333",margin:"0 0 6px"}}>{lang==="ko"?"리뷰 작성":lang==="ja"?"レビューを書く":"Write a Review"}</p>
                    <div style={{display:"flex",gap:4,marginBottom:6}}>
                      {[1,2,3,4,5].map(n=>(
                        <button key={n} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:n<=revRating?"#FFC94B":"#DDD",padding:0}} onClick={()=>setRevRating(n)}>★</button>
                      ))}
                    </div>
                    <textarea style={{width:"100%",padding:"7px 9px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box",minHeight:50,resize:"none",marginBottom:6}} placeholder={lang==="ko"?"리뷰를 작성해주세요":lang==="ja"?"レビューを入力してください":"Write your review"} value={revText} onChange={e=>setRevText(e.target.value)}/>
                    <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                      {revImgs.map((url,i)=>(
                        <div key={i} style={{position:"relative",width:52,height:52}}>
                          <img src={url} alt="" style={{width:52,height:52,borderRadius:6,objectFit:"cover",border:"1px solid #EEE"}}/>
                          <button style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:8,background:"#E53935",color:"#fff",border:"none",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1}} onClick={()=>setRevImgs(imgs=>imgs.filter((_,j)=>j!==i))}>×</button>
                        </div>
                      ))}
                      {revImgs.length<3&&(
                        <label style={{width:52,height:52,borderRadius:6,border:"1.5px dashed #CCC",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,color:"#CCC"}}>
                          +
                          <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files?.[0];if(!f)return;const ext=(f.name.split(".").pop()||"jpg");try{const r=await fetch("/api/upload?ext="+encodeURIComponent(ext),{method:"POST",headers:{"content-type":f.type||"application/octet-stream"},body:f});const j=await r.json();setRevImgs(imgs=>[...imgs,j.url]);}catch{}e.target.value="";}}/>
                        </label>
                      )}
                      <span style={{fontSize:9,color:"#999"}}>{revImgs.length}/3</span>
                    </div>
                    <button style={{width:"100%",background:C.y,color:"#fff",border:"none",borderRadius:6,padding:"7px 0",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>{if(revText.trim()){setReviews(rs=>[...rs,{id:Date.now(),prodId:sel.id,email:user.email,name:user.name||user.email.split("@")[0],rating:revRating,text:revText.trim(),images:revImgs.length>0?[...revImgs]:[],date:new Date().toISOString().slice(0,10)}]);setRevText("");setRevRating(5);setRevImgs([]);}}}>{lang==="ko"?"등록":lang==="ja"?"投稿":"Submit"}</button>
                  </div>
                )}
              </div>);})()}
            </div>
            <div style={ss.ctaBar}>
              <button style={{width:42,height:42,borderRadius:11,border:`1.5px solid ${C.y}`,outline:"none",background:"#FFFFFF",fontSize:18,color:C.y,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} onClick={()=>{if(!user){tw(lang==="ko"?"로그인이 필요합니다":lang==="ja"?"ログインが必要です":"Please log in first");setPg("login");return;}setLiked(l=>({...l,[sel.id]:!l[sel.id]}));}}>
                {liked[sel.id]?"♥":"♡"}
              </button>
              <button style={{flex:1,height:42,borderRadius:11,background:"#FFFFFF",border:`1.5px solid ${C.y}`,color:C.y,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>{if(!user){tw(lang==="ko"?"로그인이 필요합니다":lang==="ja"?"ログインが必要です":"Please log in first");setPg("login");return;}addCart();}}>{t.addCart}</button>
              <button style={{flex:1.4,height:42,borderRadius:11,background:C.y,color:"#FFFFFF",border:"none",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>{if(!user){tw(lang==="ko"?"로그인이 필요합니다":lang==="ja"?"ログインが必要です":"Please log in first");setPg("login");return;}openOrd();}}>{t.buyNow}</button>
            </div>
          </div>
        )}

        {/* ORDER MODAL */}
        {showOrd&&sel&&(
          <div style={ss.modalBg}>
            <div style={ss.modalSheet}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px 9px",borderBottom:`1px solid rgba(249,221,129,0.55)`,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  {[1,2,3].map(n=>(<div key={n} style={{display:"flex",alignItems:"center",gap:3}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:step>=n?C.y:"#FFFFFF",border:`1.5px solid ${C.y}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:step>=n?"#FFFFFF":C.y}}>{step>n?"✓":n}</div>
                    {n<3&&<div style={{width:16,height:2,background:step>n?C.br:"rgba(107,58,42,0.15)"}}/>}
                  </div>))}
                  <span style={{fontSize:11,fontWeight:700,color:C.br,marginLeft:5}}>{step===1?t.orderInfo:step===2?t.payment:t.done}</span>
                </div>
                <button style={{background:"none",border:"none",fontSize:16,color:"#000",cursor:"pointer"}} onClick={()=>{setShowOrd(false);setOrdItems([]);}}>✕</button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"13px 16px 26px"}}>
                {step===1&&(()=>{const oi=ordItems.length>0?ordItems:[{prod:sel,brand,model,caseType:caseType||"",qty:1}];const ordTotal=oi.reduce((s,it)=>s+((it.prod.price+ctPrice(it.caseType))*(it.qty||1)),0);const ordShipFree=ordTotal>=freeShipMin;const ordShipCost=ordShipFree?0:defaultShipFee;return(<>
                  {oi.map((it,idx)=>(
                  <div key={idx} style={{display:"flex",gap:11,background:"rgba(249,221,129,0.3)",borderRadius:12,padding:11,marginBottom:8,alignItems:"center"}}>
                    {it.prod.thumb?(
                      <img src={it.prod.thumb} alt="" style={{width:50,height:50,borderRadius:10,objectFit:"cover",flexShrink:0,background:"#FAFAFA"}}/>
                    ):(
                      <div style={{width:50,height:50,background:`linear-gradient(135deg,${C.y},${C.dy})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:28}}>{it.prod.e}</div>
                    )}
                    <div style={{textAlign:"left",flex:1}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#000000",margin:"0 0 2px"}}>{it.prod.n[lang]}</p>
                      <p style={{fontSize:10,color:"#000000",margin:"0 0 3px"}}>{it.brand} · {it.model}{(it.qty||1)>1?` × ${it.qty}`:""}</p>
                      <p style={{fontSize:13,fontWeight:700,color:C.ru,margin:0}}>{fmtPrice((it.prod.price+ctPrice(it.caseType))*(it.qty||1))}</p>
                    </div>
                    {oi.length>1&&<button style={{background:"none",border:"none",color:"#ccc",fontSize:16,cursor:"pointer",flexShrink:0,padding:"0 2px"}} onClick={()=>setOrdItems(o=>o.filter((_,j)=>j!==idx))}>✕</button>}
                  </div>))}
                  <div style={{background:"#fff",borderRadius:10,padding:"11px 13px",marginBottom:13,border:`1px solid rgba(249,221,129,0.7)`}}>
                    {(()=>{const prodTotal=oi.reduce((s,it)=>s+(it.prod.price*(it.qty||1)),0);const ctTotal=oi.reduce((s,it)=>s+(ctPrice(it.caseType)*(it.qty||1)),0);const rows=[[t.product+(oi.length>1?` (${oi.length})`:""),fmtPrice(prodTotal)]];if(ctTotal>0)rows.push([lang==="ko"?"케이스 유형":lang==="ja"?"ケースタイプ":"Case type",`+${fmtPrice(ctTotal)}`]);rows.push([t.shippingFee,ordShipFree?t.free:fmtPrice(defaultShipFee)],[t.delivery,t.time]);return rows.map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#000000"}}>{l}</span><span style={{fontSize:12,fontWeight:600,color:"#000000"}}>{v}</span></div>
                    ));})()}
                    {ordShipFree?<p style={{fontSize:10,color:"#388E3C",margin:"0 0 6px",textAlign:"right"}}>✓ {lang==="ko"?`${fmtPrice(freeShipMin)} 이상 무료배송`:lang==="ja"?`${fmtPrice(freeShipMin)}以上送料無料`:`Free shipping on orders over ${fmtPrice(freeShipMin)}`}</p>
                    :<p style={{fontSize:10,color:C.ru,margin:"0 0 6px",textAlign:"right"}}>{lang==="ko"?`${fmtPrice(freeShipMin-ordTotal)} 더 구매하면 무료배송!`:lang==="ja"?`${fmtPrice(freeShipMin-ordTotal)}追加で送料無料！`:`${fmtPrice(freeShipMin-ordTotal)} more for free shipping!`}</p>}
                    <div style={{borderTop:`1px solid rgba(107,58,42,0.1)`,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,fontWeight:700,color:C.br}}>{t.total}</span>
                      <span style={{fontSize:14,fontWeight:700,color:C.ru}}>{fmtPrice(ordTotal+ordShipCost)}</span>
                    </div>
                  </div>
                  {/* Pet name */}
                  <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 4px"}}>{t.petName}</p>
                  <Inp v={petName} s={setPetName} p={t.petNamePh}/>
                  {/* Pet photo */}
                  <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 7px"}}>{t.petPhoto}</p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:8}}>
                    {Array.from({length:5}).map((_,i)=>{
                      const img=photos[i];
                      return img?(
                        <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",border:`1.5px solid ${C.lb}`,background:"#FAFAFA"}}>
                          <img src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                          <button style={{position:"absolute",top:3,right:3,background:"rgba(229,57,53,0.95)",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0}} onClick={()=>setPhotos(ps=>ps.filter((_,j)=>j!==i))}>✕</button>
                        </div>
                      ):(
                        <label key={i} style={{position:"relative",aspectRatio:"1",borderRadius:10,border:`1.5px dashed ${C.lb}`,background:"rgba(249,221,129,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.lb,fontSize:20}}>
                          +
                          <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{
                            const files=Array.from(e.target.files);if(!files.length)return;
                            Promise.all(files.map(async f=>{const ext=(f.name.split(".").pop()||"jpg");try{const r=await fetch("/api/upload?ext="+encodeURIComponent(ext),{method:"POST",headers:{"content-type":f.type||"application/octet-stream"},body:f});const j=await r.json();return j.url;}catch{return null;}})).then(arr=>setPhotos(ps=>[...ps,...arr.filter(Boolean)].slice(0,5)));
                            e.target.value="";
                          }}/>
                        </label>
                      );
                    })}
                  </div>
                  <input style={{display:"block",width:"100%",padding:"9px 11px",borderRadius:9,border:`1.5px solid ${C.lb}`,fontSize:11,color:"#000",outline:"none",background:"#fff",boxSizing:"border-box",marginBottom:11}} placeholder={lang==="ko"?"SNS 링크 (인스타그램, 트위터 등)":lang==="ja"?"SNSリンク (Instagram, Twitter等)":"SNS link (Instagram, Twitter, etc.)"} value={snsLink} onChange={e=>setSnsLink(e.target.value)}/>
                  <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 4px"}}>{t.name} <span style={{color:C.ru}}>*</span></p>
                  <Inp v={nm} s={setNm} p={t.name}/>
                  <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 4px"}}>{t.addr} <span style={{color:C.ru}}>*</span></p>
                  <Inp v={addr} s={setAddr} p={t.addr}/>
                  <Inp v={addr2} s={setAddr2} p={t.addrDetail}/>
                  <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 4px"}}>{t.phone} <span style={{color:C.ru}}>*</span></p>
                  <Inp v={ph} s={setPh} p={t.phone} tp="tel"/>
                  <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 4px"}}>{t.email} <span style={{color:C.ru}}>*</span></p>
                  <Inp v={em} s={setEm} p={t.email} tp="email"/>
                  <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 4px"}}>{t.notes}</p>
                  <textarea style={{display:"block",width:"100%",padding:"9px 11px",borderRadius:9,border:`1.5px solid ${C.lb}`,fontSize:12,color:C.tx,fontFamily:"Georgia,serif",marginBottom:11,outline:"none",background:"#fff",minHeight:60,resize:"none",boxSizing:"border-box"}} placeholder={t.notesHolder} value={note} onChange={e=>setNote(e.target.value)}/>
                  {oErr&&<p style={{fontSize:11,color:C.ru,background:"rgba(194,90,42,0.08)",padding:"7px 10px",borderRadius:7,marginBottom:10}}>{oErr}</p>}
                  <button style={ss.fullBtn} onClick={()=>{if(v1())setStep(2);}}>{t.continueBtn}</button>
                </>)})()}

                {step===2&&(()=>{const oi=ordItems.length>0?ordItems:[{prod:sel,brand,model,caseType:caseType||"",qty:1}];return(<>
                  {oi.map((it,idx)=>(
                  <div key={idx} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(249,221,129,0.28)",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                    {it.prod.thumb?(
                      <img src={it.prod.thumb} alt="" style={{width:42,height:42,borderRadius:8,objectFit:"cover",flexShrink:0,background:"#FAFAFA"}}/>
                    ):(
                      <div style={{width:42,height:42,background:`linear-gradient(135deg,${C.y},${C.dy})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{it.prod.e}</div>
                    )}
                    <div style={{flex:1,textAlign:"left"}}>
                      <p style={{fontSize:12,fontWeight:700,color:"#000000",margin:"0 0 2px"}}>{it.prod.n[lang]}</p>
                      <p style={{fontSize:10,color:"#000000",margin:"0 0 3px"}}>{it.brand} {it.model}{(it.qty||1)>1?` × ${it.qty}`:""}</p>
                      <p style={{fontSize:12,fontWeight:700,color:C.ru,margin:0}}>{fmtPrice((it.prod.price+ctPrice(it.caseType))*(it.qty||1))}</p>
                    </div>
                  </div>))}
                  {discount>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 4px",marginBottom:4}}><span style={{fontSize:11,color:"#999"}}>{lang==="ko"?"할인":"Discount"}</span><span style={{fontSize:12,fontWeight:700,color:C.ru}}>-{fmtPrice(discount)}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"4px 4px 4px"}}><span style={{fontSize:11,color:"#999"}}>{t.shippingFee}</span><span style={{fontSize:12,fontWeight:600,color:ordShipFee>0?C.ru:"#333"}}>{ordShipFee>0?fmtPrice(ordShipFee):t.free}</span></div>
                  {ordShipFee===0?<p style={{fontSize:10,color:"#388E3C",margin:"0 0 4px",textAlign:"right",padding:"0 4px"}}>✓ {lang==="ko"?`${fmtPrice(freeShipMin)} 이상 무료배송`:lang==="ja"?`${fmtPrice(freeShipMin)}以上送料無料`:`Free shipping on orders over ${fmtPrice(freeShipMin)}`}</p>
                  :<p style={{fontSize:10,color:C.ru,margin:"0 0 4px",textAlign:"right",padding:"0 4px"}}>{lang==="ko"?`${fmtPrice(freeShipMin-ordRawTotal)} 더 구매하면 무료배송!`:lang==="ja"?`${fmtPrice(freeShipMin-ordRawTotal)}追加で送料無料！`:`${fmtPrice(freeShipMin-ordRawTotal)} more for free shipping!`}</p>}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"4px 4px 10px"}}><span style={{fontSize:13,fontWeight:700,color:C.br}}>{t.total}</span><span style={{fontSize:14,fontWeight:700,color:C.ru}}>{fmtPrice(finalPrice)}</span></div>
                  <p style={{fontSize:11,fontWeight:700,color:C.br,margin:"0 0 8px"}}>{lang==="ko"?"쿠폰":lang==="ja"?"クーポン":"Coupon"}</p>
                  <div style={{display:"flex",gap:6,marginBottom:6}}>
                    <input style={{flex:1,padding:"9px 11px",borderRadius:9,border:`1.5px solid ${C.lb}`,fontSize:12,outline:"none",background:"#fff",boxSizing:"border-box"}} placeholder={lang==="ko"?"쿠폰 코드 입력":lang==="ja"?"クーポンコード":"Coupon code"} value={couponInput} onChange={e=>setCouponInput(e.target.value.toUpperCase())} disabled={!!appliedCoupon}/>
                    {appliedCoupon?(
                      <button style={{background:"#FFFFFF",border:`1.5px solid ${C.ru}`,borderRadius:9,padding:"0 14px",fontSize:11,color:C.ru,cursor:"pointer",fontWeight:700}} onClick={()=>{setAppliedCoupon(null);setCouponMsg("");setCouponInput("");}}>{lang==="ko"?"해제":lang==="ja"?"解除":"Remove"}</button>
                    ):(
                      <button style={{background:C.y,border:"none",borderRadius:9,padding:"0 14px",fontSize:11,color:"#fff",cursor:"pointer",fontWeight:700}} onClick={()=>{
                        const code=couponInput.trim().toUpperCase();
                        const found=coupons.find(c=>c.active&&c.code.toUpperCase()===code);
                        if(found){setAppliedCoupon(found);setCouponMsg(lang==="ko"?"쿠폰 적용 완료":lang==="ja"?"クーポン適用":"Applied");}
                        else{setAppliedCoupon(null);setCouponMsg(lang==="ko"?"유효하지 않은 쿠폰입니다.":lang==="ja"?"無効なクーポンです。":"Invalid coupon.");}
                      }}>{lang==="ko"?"적용":lang==="ja"?"適用":"Apply"}</button>
                    )}
                  </div>
                  {couponMsg&&<p style={{fontSize:10,color:appliedCoupon?"#388E3C":C.ru,margin:"0 0 6px"}}>{couponMsg}</p>}
                  {coupons.filter(c=>c.active).length>0&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                      {coupons.filter(c=>c.active).slice(0,6).map(c=>(
                        <button key={c.code} style={{background:appliedCoupon?.code===c.code?C.y:"#FFFFFF",color:appliedCoupon?.code===c.code?"#FFFFFF":C.br,border:`1px solid ${C.lb}`,borderRadius:14,padding:"3px 9px",fontSize:10,fontWeight:700,cursor:"pointer"}} onClick={()=>{setCouponInput(c.code);setAppliedCoupon(c);setCouponMsg(lang==="ko"?"쿠폰 적용 완료":lang==="ja"?"クーポン適用":"Applied");}}>{c.code} -{c.discount}{c.type}</button>
                      ))}
                    </div>
                  )}
                  <p style={{fontSize:11,fontWeight:700,color:C.br,margin:"0 0 8px"}}>{t.payMethod} <span style={{color:C.ru}}>*</span></p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                    {PAYS.map(m=>(<button key={m.id} style={{background:payM===m.id?C.y:"#fff",border:`1.5px solid ${payM===m.id?C.y:"#DDDDDD"}`,borderRadius:10,padding:"10px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}} onClick={()=>setPayM(m.id)}>
                      <span style={{fontSize:10,fontWeight:600,color:payM===m.id?"#FFFFFF":"#000000",textAlign:"center"}}>{m.l[lang]}</span>
                    </button>))}
                  </div>
                  {payM==="card"&&(
                    <div style={{background:"rgba(249,221,129,0.2)",borderRadius:10,padding:12,marginBottom:11}}>
                      <p style={{fontSize:11,fontWeight:700,color:C.br,margin:"0 0 6px"}}>{t.cardBrand}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:9}}>
                        {["Visa","Mastercard","Amex","Discover","JCB","UnionPay"].map(b=>(<button key={b} style={{padding:"3px 8px",borderRadius:6,border:`1.5px solid ${cBr===b?C.y:"#DDDDDD"}`,background:cBr===b?C.y:"#fff",fontSize:10,fontWeight:600,color:cBr===b?"#FFFFFF":"#000000",cursor:"pointer"}} onClick={()=>setCBr(b)}>{b}</button>))}
                      </div>
                      <p style={{fontSize:11,fontWeight:700,color:C.br,margin:"0 0 4px"}}>{t.cardNum}</p>
                      <Inp v={cN} s={v=>{const r=v.replace(/\D/g,"").slice(0,16);setCN(r.replace(/(.{4})/g,"$1 ").trim());}} p="0000 0000 0000 0000"/>
                      <div style={{display:"flex",gap:8}}>
                        <div style={{flex:1}}><p style={{fontSize:11,fontWeight:700,color:C.br,margin:"0 0 4px"}}>{t.expiry}</p><Inp v={cE} s={v=>{let r=v.replace(/\D/g,"").slice(0,4);if(r.length>2)r=r.slice(0,2)+" / "+r.slice(2);setCE(r);}} p="MM / YY"/></div>
                        <div style={{flex:1}}><p style={{fontSize:11,fontWeight:700,color:C.br,margin:"0 0 4px"}}>{t.cvc}</p><Inp v={cv} s={v=>setCv(v.replace(/\D/g,"").slice(0,4))} p="CVC"/></div>
                      </div>
                    </div>
                  )}
                  {payM==="bank"&&<div style={{background:"rgba(249,221,129,0.3)",borderRadius:10,padding:"12px 13px",marginBottom:11}}><p style={{fontSize:12,color:C.br,lineHeight:1.7,margin:0,whiteSpace:"pre-line"}}>{t.bankInfo}</p></div>}
                  {(payM==="kakao"||payM==="naver"||payM==="paypal")&&<div style={{background:"rgba(249,221,129,0.3)",borderRadius:10,padding:"12px 13px",marginBottom:11}}><p style={{fontSize:12,color:C.br,margin:0}}>{payM==="kakao"?"Redirecting to KakaoPay...":payM==="naver"?"Redirecting to Naver Pay...":"Redirecting to PayPal..."}</p></div>}
                  <div style={{background:"#FFF8E1",borderRadius:8,padding:"8px 11px",marginBottom:10,border:"1px solid #FFE082"}}>
                    <p style={{fontSize:10,fontWeight:700,color:"#E6A800",margin:"0 0 2px"}}>{lang==="ko"?"교환/반품 안내":lang==="ja"?"交換・返品について":"Exchange/Return Policy"}</p>
                    <p style={{fontSize:9,color:"#999",margin:0,lineHeight:1.5,whiteSpace:"pre-line"}}>{lang==="ko"?"본 상품은 맞춤형 주문제작 상품으로, 주문 후 교환 및 반품이 불가합니다.":lang==="ja"?"本商品はオーダーメイド商品のため、注文後の交換・返品はできません。":"This is a custom-made product.\nExchange and returns are not available after ordering."}</p>
                  </div>
                  {oErr&&<p style={{fontSize:11,color:C.ru,background:"rgba(194,90,42,0.08)",padding:"7px 10px",borderRadius:7,marginBottom:10}}>{oErr}</p>}
                  <div style={{display:"flex",gap:8}}>
                    <button style={{background:"#FFFFFF",border:`1.5px solid ${C.y}`,borderRadius:10,padding:"12px 14px",fontSize:12,color:C.y,cursor:"pointer",fontFamily:"Georgia,serif",flexShrink:0}} onClick={()=>{setOErr("");setStep(1);}}>{t.back}</button>
                    <button style={{flex:1,background:C.y,color:"#FFFFFF",border:"none",borderRadius:10,padding:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>{if(v2()){
                      const newOid="YT-"+Date.now().toString().slice(-8);setOid(newOid);
                      const items=oi;
                      const names=items.map(it=>it.prod.n.ko).join(", ");
                      const models2=items.map(it=>`${it.brand} ${it.model}`).join(", ");
                      setOrders(os=>[{id:newOid,name:names,model:models2,price:finalPrice,date:new Date().toISOString().slice(0,10),status:{en:"Processing",ko:"처리중",ja:"処理中"},track:"",email:em,userEmail:user?.email||em,coupon:appliedCoupon?appliedCoupon.code:"",couponDiscount:discount||0,snsLink:snsLink||"",photos:photos||[],petName:petName||"",custName:nm,addr:addr+(addr2?" "+addr2:""),phone:ph,payMethod:payM||"",items:items.map(it=>({prodId:it.prod.id,name:it.prod.n,price:it.prod.price,qty:it.qty||1,brand:it.brand,model:it.model,thumb:it.prod.thumb||"",caseType:it.caseType||""}))},...os]);
                      if(appliedCoupon){setCoupons(cs=>cs.map(c=>c.code===appliedCoupon.code?{...c,used:(c.used||0)+1}:c));}
                      setAdminUsers(us=>us.map(x=>x.email===em?{...x,orders:(x.orders||0)+1}:x));
                      if(ordItems.length>0){const ids=new Set(ordItems.map(it=>it.id));setCart(c=>c.filter(x=>!ids.has(x.id)));setCartChecked(new Set());}
                      setStep(3);
                    }}}>{t.placeOrder}</button>
                  </div>
                </>)})()}

                {step===3&&(()=>{const oi=ordItems.length>0?ordItems:[{prod:sel,brand,model,caseType:caseType||"",qty:1}];return(
                  <div style={{textAlign:"center",padding:"6px 0 12px"}}>
                    <div style={{width:56,height:56,borderRadius:"50%",background:C.y,color:"#FFFFFF",fontSize:22,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>✓</div>
                    <h2 style={{fontSize:21,fontWeight:700,color:C.br,margin:"0 0 5px",fontStyle:"italic"}}>{t.orderPlaced}</h2>
                    <p style={{fontSize:12,color:"#000000",margin:"0 0 16px"}}>{t.thanks}</p>
                    <div style={{background:"rgba(249,221,129,0.3)",borderRadius:12,padding:13,marginBottom:14,textAlign:"left"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:11,color:"#000000"}}>{t.orderNo}</span><span style={{fontSize:11,fontWeight:600,color:"#000000"}}>{oid}</span></div>
                      {oi.map((it,idx)=>(
                        <div key={idx} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:11,color:"#000000"}}>{it.prod.n[lang]}{(it.qty||1)>1?` ×${it.qty}`:""}</span>
                          <span style={{fontSize:11,fontWeight:600,color:"#000000",textAlign:"right"}}>{it.brand} {it.model}</span>
                        </div>
                      ))}
                      {appliedCoupon&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#000000"}}>{lang==="ko"?"쿠폰":lang==="ja"?"クーポン":"Coupon"}</span><span style={{fontSize:11,fontWeight:600,color:C.ru}}>{appliedCoupon.code} (-{fmtPrice(discount)})</span></div>}
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#000000"}}>{t.shippingFee}</span><span style={{fontSize:11,fontWeight:600,color:ordShipFee>0?C.ru:"#333"}}>{ordShipFee>0?fmtPrice(ordShipFee):t.free}</span></div>
                      <div style={{borderTop:"1px solid rgba(107,58,42,0.1)",paddingTop:7,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:700,color:C.br}}>{t.total}</span><span style={{fontSize:12,fontWeight:700,color:C.ru}}>{fmtPrice(finalPrice)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}><span style={{fontSize:11,color:"#000000"}}>{t.delivery}</span><span style={{fontSize:11,fontWeight:600,color:"#000000"}}>{t.time}</span></div>
                    </div>
                    <p style={{fontSize:11,color:"#000000",margin:"0 0 16px"}}>{t.confirmSent} <b>{em}</b></p>
                    <button style={ss.fullBtn} onClick={()=>{setShowOrd(false);setOrdItems([]);setPg("shop");}}>{t.continueShopping}</button>
                  </div>);})()}
              </div>
            </div>
          </div>
        )}

        {/* LOGIN */}
        {pg==="login"&&(
          <div style={ss.authWrap}>
            <div style={ss.authCard}>
              <h2 style={{fontSize:20,fontWeight:700,color:C.br,margin:"0 0 4px",fontStyle:"italic"}}>{t.welcome}</h2>
              <p style={{fontSize:12,color:C.mu,margin:"0 0 18px"}}>{t.signIn}</p>
              {aErr&&<p style={{fontSize:11,color:C.ru,background:"rgba(194,90,42,0.08)",padding:"7px 10px",borderRadius:7,marginBottom:10}}>{aErr}</p>}
              <Inp v={lE} s={setLE} p={t.email} tp="email"/>
              <Inp v={lP} s={setLP} p="Password" tp="password"/>
              <label style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#000000",cursor:"pointer",marginBottom:12,userSelect:"none"}}>
                <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} style={{accentColor:C.y,width:14,height:14,cursor:"pointer"}}/>
                <span>{t.rememberMe}</span>
              </label>
              <button style={ss.fullBtn} onClick={login_}>{t.login}</button>
              <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:4,marginBottom:8}}>
                <span style={{fontSize:10,color:C.mu,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setAErr("");setFpEmail("");setFpMsg("");setPg("forgotPw");}}>{t.forgotPw}</span>
                <span style={{fontSize:10,color:C.mu,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setAErr("");setFiName("");setFiPhone("");setFiResult("");setPg("forgotId");}}>{t.forgotId}</span>
              </div>
              <p style={{fontSize:11,color:"#000000"}}>{t.noAcc} <span style={{color:C.ru,fontWeight:700,cursor:"pointer"}} onClick={()=>{setAErr("");setPg("signup");}}>{t.signup}</span></p>
            </div>
          </div>
        )}

        {/* SIGNUP */}
        {pg==="signup"&&(
          <div style={ss.authWrap}>
            <div style={ss.authCard}>
              <h2 style={{fontSize:20,fontWeight:700,color:C.br,margin:"0 0 4px",fontStyle:"italic"}}>{t.createAcc}</h2>
              <p style={{fontSize:12,color:C.mu,margin:"0 0 18px"}}>{t.joinFam}</p>
              {aErr&&<p style={{fontSize:11,color:C.ru,background:"rgba(194,90,42,0.08)",padding:"7px 10px",borderRadius:7,marginBottom:10}}>{aErr}</p>}
              <Inp v={sN} s={setSN} p={t.name}/>
              <Inp v={sE} s={setSE} p={t.email} tp="email"/>
              <Inp v={sP} s={setSP} p="Password" tp="password"/>
              <button style={ss.fullBtn} onClick={signup_}>{t.createAcc}</button>
              <p style={{fontSize:11,color:"#000000"}}>{t.haveAcc} <span style={{color:C.ru,fontWeight:700,cursor:"pointer"}} onClick={()=>{setAErr("");setPg("login");}}>{t.login}</span></p>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD */}
        {pg==="forgotPw"&&(
          <div style={ss.authWrap}>
            <div style={ss.authCard}>
              <h2 style={{fontSize:20,fontWeight:700,color:C.br,margin:"0 0 4px",fontStyle:"italic"}}>{t.forgotPwTitle}</h2>
              <p style={{fontSize:12,color:C.mu,margin:"0 0 18px"}}>{t.forgotPwDesc}</p>
              {fpMsg&&<p style={{fontSize:11,color:fpMsg===t.resetSent?"#2E7D32":C.ru,background:fpMsg===t.resetSent?"rgba(46,125,50,0.08)":"rgba(194,90,42,0.08)",padding:"7px 10px",borderRadius:7,marginBottom:10}}>{fpMsg}</p>}
              <Inp v={fpEmail} s={setFpEmail} p={t.email} tp="email"/>
              <button style={ss.fullBtn} onClick={async()=>{if(!fpEmail.trim()){setFpMsg(t.fillAll);return;}if(!/\S+@\S+\.\S+/.test(fpEmail)){setFpMsg(t.validEmail);return;}const em=fpEmail.trim();const found=users.find(u=>u.email===em)||users.find(u=>{const pr=profiles[u.email]||{};return pr.email===em;})||Object.values(profiles).some(pr=>pr.email===em);if(!found){setFpMsg(lang==="ko"?"등록되지 않은 이메일입니다.":lang==="ja"?"登録されていないメールアドレスです。":"This email is not registered.");return;}try{const r=await fetch("/api/send-reset-email",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:em})});const j=await r.json();if(j.ok){setFpMsg(t.resetSent);}else{setFpMsg(j.error||"Failed");}}catch(e){setFpMsg(lang==="ko"?"이메일 전송에 실패했습니다.":lang==="ja"?"メール送信に失敗しました。":"Failed to send email.");}}}>{t.sendResetLink}</button>
              <div style={{background:"#F9F9F9",borderRadius:8,padding:12,marginTop:12,marginBottom:12,textAlign:"left"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#555",margin:"0 0 6px"}}>{lang==="ko"?"해결 방법":lang==="ja"?"解決方法":"How to resolve"}</p>
                <ul style={{fontSize:10,color:"#666",margin:0,paddingLeft:16,lineHeight:1.8,textAlign:"left"}}>
                  <li>{lang==="ko"?"가입할 때 사용한 이메일 주소를 정확히 입력해주세요.":lang==="ja"?"登録時のメールアドレスを正確に入力してください。":"Enter the exact email address you used when signing up."}</li>
                  <li>{lang==="ko"?"스팸 메일함도 확인해주세요.":lang==="ja"?"迷惑メールフォルダもご確認ください。":"Check your spam folder as well."}</li>
                  <li>{lang==="ko"?"비밀번호는 영문, 숫자 조합으로 설정해주세요.":lang==="ja"?"パスワードは英数字の組み合わせで設定してください。":"Set your password with a combination of letters and numbers."}</li>
                  <li>{lang==="ko"?"문제가 지속되면 고객센터로 문의해주세요.":lang==="ja"?"問題が続く場合はカスタマーサポートまでお問い合わせください。":"If the issue persists, please contact customer support."}</li>
                </ul>
              </div>
              <p style={{fontSize:11,color:"#000000",cursor:"pointer"}} onClick={()=>{setFpMsg("");setPg("login");}}><span style={{color:C.ru,fontWeight:700}}>← {t.backToLogin}</span></p>
            </div>
          </div>
        )}

        {/* FORGOT ID */}
        {pg==="forgotId"&&(
          <div style={ss.authWrap}>
            <div style={ss.authCard}>
              <h2 style={{fontSize:20,fontWeight:700,color:C.br,margin:"0 0 4px",fontStyle:"italic"}}>{t.forgotIdTitle}</h2>
              <p style={{fontSize:12,color:C.mu,margin:"0 0 18px"}}>{t.forgotIdDesc}</p>
              {fiResult&&<p style={{fontSize:11,color:fiResult.startsWith(t.idFound)?"#2E7D32":C.ru,background:fiResult.startsWith(t.idFound)?"rgba(46,125,50,0.08)":"rgba(194,90,42,0.08)",padding:"7px 10px",borderRadius:7,marginBottom:10}}>{fiResult}</p>}
              <Inp v={fiName} s={setFiName} p={t.name}/>
              <Inp v={fiPhone} s={setFiPhone} p={t.phone} tp="tel"/>
              <button style={ss.fullBtn} onClick={()=>{if(!fiName.trim()||!fiPhone.trim()){setFiResult(t.fillAll);return;}const found=users.find(u=>{const pr=profiles[u.email]||{};return(u.name===fiName.trim()||pr.name===fiName.trim())&&(pr.phone===fiPhone.trim());});if(found){const pr=profiles[found.email]||{};const masked=(pr.email||found.email).replace(/(.{2})(.*)(@.*)/, (m,a,b,c)=>a+"*".repeat(b.length)+c);setFiResult(t.idFound+" "+masked);}else{setFiResult(t.idNotFound);}}}>{t.findMyId}</button>
              <div style={{background:"#F9F9F9",borderRadius:8,padding:12,marginTop:12,marginBottom:12,textAlign:"left"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#555",margin:"0 0 6px"}}>{lang==="ko"?"해결 방법":lang==="ja"?"解決方法":"How to resolve"}</p>
                <ul style={{fontSize:10,color:"#666",margin:0,paddingLeft:16,lineHeight:1.8,textAlign:"left"}}>
                  <li>{lang==="ko"?"가입 시 입력한 이름과 연락처를 정확히 입력해주세요.":lang==="ja"?"登録時のお名前と電話番号を正確に入力してください。":"Enter the exact name and phone number you used when signing up."}</li>
                  <li>{lang==="ko"?"이메일 주소 일부가 마스킹되어 표시됩니다.":lang==="ja"?"メールアドレスの一部がマスク表示されます。":"Your email will be partially masked for security."}</li>
                  <li>{lang==="ko"?"마이페이지에서 연락처를 변경한 경우, 변경 후 연락처를 입력해주세요.":lang==="ja"?"マイページで連絡先を変更した場合、変更後の連絡先を入力してください。":"If you changed your phone number in My Page, enter the updated one."}</li>
                  <li>{lang==="ko"?"문제가 지속되면 고객센터로 문의해주세요.":lang==="ja"?"問題が続く場合はカスタマーサポートまでお問い合わせください。":"If the issue persists, please contact customer support."}</li>
                </ul>
              </div>
              <p style={{fontSize:11,color:"#000000",cursor:"pointer"}} onClick={()=>{setFiResult("");setPg("login");}}><span style={{color:C.ru,fontWeight:700}}>← {t.backToLogin}</span></p>
            </div>
          </div>
        )}

        {/* NOTICES PAGE */}
        {pg==="notices"&&(
          <div style={{padding:"14px 14px 80px",background:"#FFFFFF"}}>
            <div style={{display:"flex",alignItems:"center",marginBottom:14}}>
              <button style={{background:"none",border:"none",fontSize:18,cursor:"pointer",marginRight:8,color:"#333"}} onClick={()=>setPg("shop")}>←</button>
              <p style={{fontSize:15,fontWeight:700,color:"#333",margin:0}}>{lang==="ko"?"공지사항":lang==="ja"?"お知らせ":"Notices"}</p>
            </div>
            {openNotice?(()=>{const n=notices.find(x=>x.id===openNotice);if(!n)return null;const tt=typeof n.title==="object"?n.title:{en:n.title,ko:n.title,ja:n.title};const cc=typeof n.content==="object"?n.content:{en:n.content,ko:n.content,ja:n.content};return(
              <div>
                <button style={{background:"none",border:"none",fontSize:12,color:"#999",cursor:"pointer",marginBottom:10,padding:0}} onClick={()=>setOpenNotice(null)}>← {lang==="ko"?"목록으로":lang==="ja"?"一覧へ":"Back to list"}</button>
                {(n.detailImg||n.banner)&&<img src={n.detailImg||n.banner} alt="" style={{width:"100%",borderRadius:12,marginBottom:14,display:"block"}}/>}
                <p style={{fontSize:16,fontWeight:700,color:"#333",margin:"0 0 6px"}}>{tt[lang]||tt.ko||tt.en}</p>
                <p style={{fontSize:11,color:"#999",margin:"0 0 14px"}}>{n.date}</p>
                <p style={{fontSize:13,color:"#333",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{cc[lang]||cc.ko||cc.en}</p>
              </div>);})():(
              notices.length===0?(
                <p style={{fontSize:12,color:"#999",textAlign:"center",padding:"40px 0"}}>{lang==="ko"?"공지가 없어요.":lang==="ja"?"お知らせがありません。":"No notices."}</p>
              ):notices.map(n=>{const tt=typeof n.title==="object"?n.title:{en:n.title,ko:n.title,ja:n.title};return(
                <div key={n.id} style={{marginBottom:12,cursor:"pointer",borderRadius:12,overflow:"hidden",border:"1px solid #F5F5F5",background:"#fff"}} onClick={()=>setOpenNotice(n.id)}>
                  {n.banner?(
                    <img src={n.banner} alt="" style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
                  ):(
                    <div style={{width:"100%",height:120,background:"linear-gradient(135deg, #FFC94B 0%, #FFE082 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:32}}>📢</span>
                    </div>
                  )}
                  <div style={{padding:"10px 14px",textAlign:"right"}}>
                    <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 4px"}}>{tt[lang]||tt.ko||tt.en}</p>
                    <p style={{fontSize:10,color:"#999",margin:0}}>{n.date}</p>
                  </div>
                </div>
              );})
            )}
          </div>
        )}

        {/* MYPAGE */}
        {pg==="mypage"&&user&&(
          <div style={{minHeight:"calc(100vh - 48px)"}}>
            <div style={ss.profileBanner}>
              <label style={{position:"relative",width:48,height:48,borderRadius:"50%",overflow:"hidden",flexShrink:0,cursor:"pointer",background:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {myAvatar?<img src={myAvatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:22,color:"#fff"}}>{(myName||user.name||"U").charAt(0).toUpperCase()}</span>}
                <div style={{position:"absolute",bottom:0,right:0,width:16,height:16,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:"#333"}}>✎</span></div>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files?.[0];if(!f)return;const ext=(f.name.split(".").pop()||"jpg");try{const r=await fetch("/api/upload?ext="+encodeURIComponent(ext),{method:"POST",headers:{"content-type":f.type||"application/octet-stream"},body:f});const j=await r.json();setMyAvatar(j.url);if(user)setProfiles(p=>({...p,[user.email]:{...p[user.email],avatar:j.url}}));}catch{}e.target.value="";}}/>
              </label>
              <div style={{textAlign:"left",flex:1,minWidth:0}}><p style={{fontSize:15,fontWeight:700,color:"#FFFFFF",margin:"0 0 2px"}}>{myName||user.name}</p><p style={{fontSize:10,color:"#FFFFFF",margin:"0 0 2px"}}>{myEmail||user.email}</p>{(myAddr||myCity)&&<p style={{fontSize:10,color:"rgba(255,255,255,0.85)",margin:0}}>{[myAddr,myCity].filter(Boolean).join(", ")}</p>}</div>
              <button style={{background:"none",border:`1px solid #FFFFFF`,color:"#FFFFFF",fontSize:10,borderRadius:12,padding:"4px 10px",cursor:"pointer",fontFamily:"Georgia,serif",flexShrink:0}} onClick={()=>{setUser(null);setMyName("");setMyEmail("");setMyAddr("");setMyCity("");setMyPhone("");setMyAvatar("");setPg("home");}}>{t.logout}</button>
            </div>
            <div style={ss.tabs}>
              {[["orders",t.orderHistory],["shipping",t.shippingInfo],["cs",lang==="ko"?"1:1문의":lang==="ja"?"1:1お問合せ":"1:1 Inquiry"]].map(([k,l])=>(
                <button key={k} style={{...ss.tabBtn,opacity:myTab===k?1:0.5,borderBottom:myTab===k?`3px solid ${C.br}`:"none",fontSize:11}} onClick={()=>setMyTab(k)}>{l}</button>
              ))}
            </div>
            <div style={{padding:14}}>
              {myTab==="orders"&&(()=>{const mine=orders.filter(o=>o.userEmail===user.email||o.email===user.email||o.email===(myEmail||""));return mine.length===0?(
                <p style={{fontSize:12,color:"#000",textAlign:"center",padding:"24px 0"}}>{lang==="ko"?"주문 내역이 없어요.":lang==="ja"?"注文履歴がありません。":"No orders yet."}</p>
              ):mine.map(o=>{const payLabel=(()=>{const p=PAYS.find(m=>m.id===o.payMethod);return p?p.l[lang]||p.l.en:o.payMethod||"-";})();return(
                <div key={o.id} style={{background:"#fff",borderRadius:12,padding:14,marginBottom:10,boxShadow:"0 2px 7px rgba(107,58,42,0.08)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:10,color:C.mu}}>{o.id}</span>
                    <span style={{fontSize:9,fontWeight:700,color:"#fff",borderRadius:18,padding:"2px 9px",background:o.status.en==="Delivered"?"#5A8A3A":o.status.en==="Cancelled"?"#E53935":o.status.en==="Shipped"?"#1976D2":"#FF9800"}}>{o.status[lang]}</span>
                  </div>
                  {o.items&&o.items.length>0&&o.items.map((it,idx)=>(
                    <div key={idx} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                      {it.thumb&&<img src={it.thumb} alt="" style={{width:40,height:40,borderRadius:6,objectFit:"cover",flexShrink:0,background:"#FAFAFA"}}/>}
                      <div style={{flex:1,textAlign:"left"}}>
                        <p style={{fontSize:12,fontWeight:700,color:C.tx,margin:0}}>{typeof it.name==="object"?it.name[lang]||it.name.ko:it.name}{(it.qty||1)>1?` ×${it.qty}`:""}</p>
                        <p style={{fontSize:10,color:C.mu,margin:0}}>{it.brand} {it.model}</p>
                      </div>
                    </div>
                  ))}
                  {(!o.items||o.items.length===0)&&<>
                    <p style={{fontSize:13,fontWeight:700,color:C.tx,margin:"0 0 2px",textAlign:"left"}}>{o.name}</p>
                    <p style={{fontSize:10,color:C.mu,margin:"0 0 6px",textAlign:"left"}}>{o.model}</p>
                  </>}
                  <div style={{background:"#F8F8F8",borderRadius:8,padding:10,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,color:C.mu}}>{lang==="ko"?"주문일":lang==="ja"?"注文日":"Date"}</span>
                      <span style={{fontSize:10,color:"#333"}}>{o.date}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,color:C.mu}}>{lang==="ko"?"결제 수단":lang==="ja"?"お支払い方法":"Payment"}</span>
                      <span style={{fontSize:10,fontWeight:600,color:"#333"}}>{payLabel}</span>
                    </div>
                    {o.coupon&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,color:C.mu}}>{lang==="ko"?"쿠폰":lang==="ja"?"クーポン":"Coupon"}</span>
                      <span style={{fontSize:10,fontWeight:600,color:C.ru}}>{o.coupon}</span>
                    </div>}
                    <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #EEE",paddingTop:4}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#333"}}>{lang==="ko"?"결제 금액":lang==="ja"?"お支払い金額":"Total"}</span>
                      <span style={{fontSize:12,fontWeight:700,color:C.ru}}>{fmtPrice(o.price)}</span>
                    </div>
                  </div>
                  <div style={{background:"rgba(249,221,129,0.3)",borderRadius:6,padding:"6px 10px",display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:10,color:C.mu}}>{t.trackNo}</span>
                    <span style={{fontSize:10,fontWeight:700,color:C.br}}>{o.track||"-"}</span>
                  </div>
                  {o.status.en==="Processing"&&(
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
                      <button style={{padding:"4px 10px",borderRadius:6,border:"1px solid #CCC",background:"#F5F5F5",fontSize:10,fontWeight:600,cursor:"pointer",color:"#888"}} onClick={()=>setDelPopup({icon:"⚠️",title:lang==="ko"?"주문 취소":lang==="ja"?"注文キャンセル":"Cancel Order",msg:lang==="ko"?"이 주문을 취소하시겠습니까?":lang==="ja"?"この注文をキャンセルしますか？":"Cancel this order?",btnText:lang==="ko"?"취소하기":lang==="ja"?"キャンセル":"Cancel",btnColor:"#888",onOk:()=>setOrders(os=>os.map(x=>x.id===o.id?{...x,status:{en:"Cancelled",ko:"취소됨",ja:"キャンセル"}}:x))})}>{lang==="ko"?"주문 취소":lang==="ja"?"キャンセル":"Cancel"}</button>
                    </div>
                  )}
                  {o.status.en==="Delivered"&&o.items&&o.items.length>0&&(()=>{const unreviewedItems=o.items.filter(it=>it.prodId&&!reviews.some(r=>r.email===user.email&&r.prodId===it.prodId));return unreviewedItems.length>0?(
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4,justifyContent:"flex-end"}}>
                      {unreviewedItems.map((it,idx)=>{const prod=prods.find(p=>p.id===it.prodId);if(!prod)return null;return(
                        <button key={idx} style={{padding:"5px 12px",borderRadius:8,border:`1.5px solid ${C.y}`,background:"#FFFBEE",fontSize:10,fontWeight:700,cursor:"pointer",color:C.y}} onClick={()=>{setSel(prod);setPg("detail");}}>{lang==="ko"?"리뷰 작성":lang==="ja"?"レビューを書く":"Write Review"} — {typeof prod.name==="object"?(prod.name[lang]||prod.name.ko):prod.name}</button>
                      );})}
                    </div>
                  ):null;})()}
                </div>
              );})})()}
              {myTab==="shipping"&&(<>
                <div style={{background:"#fff",borderRadius:12,padding:14,boxShadow:"0 2px 7px rgba(107,58,42,0.08)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.br}}>{t.defaultAddr}</span>
                    <button style={{fontSize:10,color:C.ru,background:"none",border:`1px solid ${C.ru}`,borderRadius:8,padding:"3px 9px",cursor:"pointer"}} onClick={()=>setEditAddr(v=>!v)}>{t.edit}</button>
                  </div>
<div style={{display:"flex",gap:10,marginBottom:6,textAlign:"left"}}>
  <span style={{fontSize:10,color:"#999",width:36,flexShrink:0}}>{lang==="ko"?"이름":lang==="ja"?"名前":"Name"}</span>
  <span style={{fontSize:11,color:"#000",fontWeight:600}}>{myName||user.name}</span>
</div>
<div style={{display:"flex",gap:10,marginBottom:6,textAlign:"left"}}>
  <span style={{fontSize:10,color:"#999",width:36,flexShrink:0}}>{lang==="ko"?"이메일":lang==="ja"?"メール":"Email"}</span>
  <span style={{fontSize:11,color:"#000"}}>{myEmail||user.email}</span>
</div>
<div style={{display:"flex",gap:10,marginBottom:6,textAlign:"left"}}>
  <span style={{fontSize:10,color:"#999",width:36,flexShrink:0}}>{lang==="ko"?"주소":lang==="ja"?"住所":"Addr"}</span>
  <span style={{fontSize:11,color:"#000"}}>{myAddr||(lang==="ko"?"도로명 주소":lang==="ja"?"住所":"123 Cozy Street, Apt 4B")}</span>
</div>
<div style={{display:"flex",gap:10,marginBottom:6,textAlign:"left"}}>
  <span style={{fontSize:10,color:"#999",width:36,flexShrink:0}}>{lang==="ko"?"지역":lang==="ja"?"地域":"City"}</span>
  <span style={{fontSize:11,color:"#000"}}>{myCity||(lang==="ko"?"시/도, 우편번호":lang==="ja"?"市区町村、郵便番号":"Seoul, 04521, South Korea")}</span>
</div>
<div style={{display:"flex",gap:10,textAlign:"left"}}>
  <span style={{fontSize:10,color:"#999",width:36,flexShrink:0}}>{lang==="ko"?"연락처":lang==="ja"?"電話":"Phone"}</span>
  <span style={{fontSize:11,color:"#000"}}>{myPhone||(lang==="ko"?"연락처":lang==="ja"?"電話番号":"+82 10-1234-5678")}</span>
</div>
{editAddr&&(
  <div style={{marginTop:12,borderTop:`1px solid ${C.lb}`,paddingTop:12}}>
<Inp v={myName} s={setMyName} p={lang==="ko"?"이름":lang==="ja"?"お名前":"Full Name"}/>
<Inp v={myEmail} s={setMyEmail} p={lang==="ko"?"이메일":lang==="ja"?"メール":"Email"} tp="email"/>
<Inp v={myAddr} s={setMyAddr} p={lang==="ko"?"도로명 주소":lang==="ja"?"住所":"Address"}/>
<Inp v={myCity} s={setMyCity} p={lang==="ko"?"시/도, 우편번호, 국가":lang==="ja"?"市区町村、郵便番号、国":"City, Zip, Country"}/>
<Inp v={myPhone} s={setMyPhone} p={lang==="ko"?"연락처":lang==="ja"?"電話番号":"Phone"} tp="tel"/>
<button style={{...ss.fullBtn,marginTop:4}} onClick={()=>{if(user)setProfiles(p=>({...p,[user.email]:{name:myName,email:myEmail,addr:myAddr,city:myCity,phone:myPhone}}));setEditAddr(false);}}>{lang==="ko"?"저장":lang==="ja"?"保存":"Save"}</button>
  </div>
)}
                </div>
                <div style={{background:"#fff",borderRadius:12,padding:14,marginTop:10,boxShadow:"0 2px 7px rgba(107,58,42,0.08)"}}>
                  <p style={{fontSize:12,fontWeight:700,color:C.br,margin:"0 0 7px"}}>{t.policyTitle}</p>
                  <p style={{fontSize:11,color:"#000000",lineHeight:1.8}}>{t.policy}</p>
                </div>
              </>)}
              {myTab==="cs"&&(<>
                <div style={{background:"#fff",borderRadius:12,padding:14,marginBottom:10,boxShadow:"0 2px 7px rgba(107,58,42,0.08)"}}>
                  <p style={{fontSize:12,fontWeight:700,color:C.br,margin:"0 0 8px"}}>{lang==="ko"?"1:1 문의 작성":lang==="ja"?"お問い合わせ作成":"New inquiry"}</p>
                  <textarea style={{display:"block",width:"100%",padding:"9px 11px",borderRadius:9,border:`1.5px solid ${C.lb}`,fontSize:12,color:"#000",fontFamily:"inherit",outline:"none",background:"#fff",minHeight:70,resize:"none",boxSizing:"border-box",marginBottom:8}} placeholder={lang==="ko"?"문의 내용을 입력해주세요":lang==="ja"?"お問い合わせ内容":"Type your inquiry..."} value={myInquiryMsg} onChange={e=>setMyInquiryMsg(e.target.value)}/>
                  <button style={{...ss.fullBtn,marginBottom:0}} onClick={()=>{
                    if(!myInquiryMsg.trim())return;
                    setInquiries(qs=>[{id:Date.now(),user:user.email,msg:myInquiryMsg.trim(),date:new Date().toISOString().slice(0,10),reply:""},...qs]);
                    setMyInquiryMsg("");
                    tw(lang==="ko"?"문의가 등록되었어요!":lang==="ja"?"お問い合わせを送信しました":"Inquiry submitted!");
                  }}>{lang==="ko"?"문의 등록":lang==="ja"?"送信":"Submit"}</button>
                </div>
                {(()=>{const mine=inquiries.filter(q=>q.user===user.email);return mine.length===0?(
                  <p style={{fontSize:12,color:C.mu,textAlign:"center",padding:"16px 0"}}>{lang==="ko"?"문의 내역이 없어요.":lang==="ja"?"問い合わせ履歴がありません。":"No inquiries yet."}</p>
                ):mine.map(q=>(
                  <div key={q.id} style={{background:"#fff",borderRadius:12,padding:14,marginBottom:10,boxShadow:"0 2px 7px rgba(107,58,42,0.08)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:10,color:C.mu}}>{q.date}</span>
                      <span style={{fontSize:9,fontWeight:700,color:"#fff",borderRadius:18,padding:"2px 8px",background:q.reply?"#5A8A3A":"#FF9800"}}>{q.reply?(lang==="ko"?"답변완료":lang==="ja"?"回答済":"Answered"):(lang==="ko"?"대기중":lang==="ja"?"対応中":"Pending")}</span>
                    </div>
                    <p style={{fontSize:12,color:"#333",margin:"0 0 8px",whiteSpace:"pre-line"}}>{q.msg}</p>
                    {q.reply&&(
                      <div style={{background:"#FFF9E6",borderRadius:8,padding:"8px 10px"}}>
                        <p style={{fontSize:10,color:C.ru,fontWeight:700,margin:"0 0 3px"}}>{lang==="ko"?"답변":lang==="ja"?"回答":"Reply"}</p>
                        <p style={{fontSize:11,color:"#333",margin:0,whiteSpace:"pre-line"}}>{q.reply}</p>
                      </div>
                    )}
                  </div>
                ));})()}
              </>)}
            </div>
          </div>
        )}
     {/* ADMIN */}
{pg==="admin"&&(
  <div style={{minHeight:"calc(100vh - 48px)",background:"#F8F8F8",fontFamily:"'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif"}}>
    {/* Admin Header */}
    <div style={{background:"#1A1A1A",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{color:"#FFC94B",fontWeight:700,fontSize:14}}>🛠 Admin Panel</span>
      <button style={{background:"none",border:"1px solid #FFC94B",color:"#FFC94B",borderRadius:8,padding:"3px 10px",fontSize:11,cursor:"pointer"}} onClick={()=>setPg("home")}>← 앱으로</button>
    </div>
    <div style={{display:"flex",borderTop:"1px solid #333"}}>
    <div style={{display:"flex",flexDirection:"column",background:"#1A1A1A",width:76,flexShrink:0,overflowY:"auto",padding:"6px 0",minHeight:"100vh",alignSelf:"stretch"}}>
      {[["dashboard","📊","대시보드"],["design","🎨","디자인"],["sales","💰","매출"],["orders","🛒","주문"],["products","📦","상품"],["caseTypes","📱","케이스유형"],["shipping","🚚","배송비"],["users","👥","회원"],["cs","💬","고객서비스"],["coupons","🎟","쿠폰"],["notices","📢","공지사항"]].map(([k,icon,label])=>(
        <button key={k} style={{background:"transparent",color:adminTab===k?"#FFC94B":"#fff",border:"none",padding:"10px 4px",fontSize:9,fontWeight:adminTab===k?700:500,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,borderLeft:adminTab===k?"3px solid #FFC94B":"3px solid transparent",textAlign:"right",paddingRight:8,whiteSpace:"nowrap"}} onClick={()=>setAdminTab(k)}>{label}</button>
      ))}
    </div>
    <div style={{flex:1,minWidth:0,padding:14,overflowY:"auto"}}>

      {/* DASHBOARD */}
      {adminTab==="dashboard"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["총 매출","₩"+adminOrders.reduce((s,o)=>s+o.price,0).toLocaleString(),"#FFC94B"],["총 주문",adminOrders.length+"건","#4CAF50"],["총 회원",adminUsers.length+"명","#2196F3"],["총 상품",adminProds.length+"개","#FF9800"]].map(([l,v,c])=>(
              <div key={l} style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5"}}>
                <p style={{fontSize:10,color:"#999",margin:"0 0 4px"}}>{l}</p>
                <p style={{fontSize:18,fontWeight:700,color:c,margin:0}}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:14}}>
            <p style={{fontSize:12,fontWeight:700,color:"#333",margin:"0 0 10px",textAlign:"left"}}>최근 주문</p>
            {adminOrders.slice(0,3).map(o=>(
              <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F5F5F5"}}>
                <div style={{textAlign:"left"}}>
                  <p style={{fontSize:12,fontWeight:600,color:"#333",margin:0}}>{o.name}</p>
                  <p style={{fontSize:10,color:"#999",margin:0}}>{o.date} · {o.model}</p>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:"#FFC94B"}}>₩{o.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:14}}>
            <p style={{fontSize:12,fontWeight:700,color:"#333",margin:"0 0 10px",textAlign:"left"}}>최근 회원</p>
            {adminUsers.slice(0,3).map((u,i)=>{const pr=profiles[u.email];return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #F5F5F5"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#FFF3D0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                  {pr?.avatar?<img src={pr.avatar} style={{width:32,height:32,objectFit:"cover"}} alt=""/>:<span style={{fontSize:13,fontWeight:700,color:"#FFC94B"}}>{(pr?.name||u.name||"U").charAt(0).toUpperCase()}</span>}
                </div>
                <div style={{flex:1,minWidth:0,textAlign:"left"}}>
                  <p style={{fontSize:12,fontWeight:600,color:"#333",margin:"0 0 1px"}}>{pr?.name||u.name}</p>
                  <p style={{fontSize:10,color:"#999",margin:"0 0 1px"}}>{pr?.email||u.email}</p>
                  {pr?.addr&&<p style={{fontSize:10,color:"#666",margin:0}}>{pr.addr}{pr.city?" "+pr.city:""}</p>}
                </div>
              </div>
            );})}
          </div>
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#333",margin:"0 0 10px",textAlign:"left"}}>인기 상품 TOP 3</p>
            {adminProds.slice(0,3).map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid #F5F5F5"}}>
                <span style={{fontSize:16,fontWeight:700,color:"#FFC94B",width:20,textAlign:"left"}}>{i+1}</span>
                {p.thumb?<img src={p.thumb} alt="" style={{width:36,height:36,borderRadius:6,objectFit:"cover",flexShrink:0,background:"#FAFAFA"}}/>:<div style={{width:36,height:36,borderRadius:6,background:"#E0E0E0",flexShrink:0}}/>}
                <div style={{flex:1,textAlign:"left"}}>
                  <p style={{fontSize:12,fontWeight:600,color:"#333",margin:0}}>{p.n.ko}</p>
                  <p style={{fontSize:10,color:"#999",margin:0}}>₩{p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESIGN */}
      {adminTab==="design"&&(
        <div>
          <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 14px"}}>메인 배너 관리</p>
          <p style={{fontSize:8,color:"#999",margin:"0 0 10px"}}>홈 화면 상단에 표시되는 슬라이드 배너입니다. 최대 5장까지 등록할 수 있습니다.</p>
          <div ref={heroListRef} style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {heroes.map((src,i)=>(
              <div key={i} draggable onDragStart={()=>setDragHero(i)} onDragOver={e=>{e.preventDefault();setDragOverHero(i);}} onDragLeave={()=>setDragOverHero(null)} onDragEnd={()=>{if(dragHero!==null&&dragOverHero!==null&&dragHero!==dragOverHero){setHeroes(h=>{const n=[...h];const item=n.splice(dragHero,1)[0];n.splice(dragOverHero,0,item);return n;});}setDragHero(null);setDragOverHero(null);}} onTouchStart={e=>{setDragHero(i);e.currentTarget.style.opacity="0.5";}} onTouchMove={e=>{e.preventDefault();const touch=e.touches[0];const el=document.elementFromPoint(touch.clientX,touch.clientY);if(el&&heroListRef.current){const items=heroListRef.current.children;for(let j=0;j<items.length;j++){if(items[j].contains(el)){setDragOverHero(j);items[j].style.border="2px solid #FFC94B";} else{items[j].style.border="2px solid transparent";}}}}} onTouchEnd={e=>{if(dragHero!==null&&dragOverHero!==null&&dragHero!==dragOverHero){setHeroes(h=>{const n=[...h];const item=n.splice(dragHero,1)[0];n.splice(dragOverHero,0,item);return n;});}if(heroListRef.current){const items=heroListRef.current.children;for(let j=0;j<items.length;j++){items[j].style.border="2px solid transparent";items[j].style.opacity="1";}}setDragHero(null);setDragOverHero(null);}} style={{background:"#fff",borderRadius:10,overflow:"hidden",border:"1px solid #F5F5F5",cursor:"grab",opacity:dragHero===i?0.5:1,border:dragOverHero===i?"2px solid #FFC94B":"2px solid transparent",touchAction:"none"}}>
                <img src={src} alt="" style={{width:"100%",height:120,objectFit:"cover",display:"block"}}/>
                <div style={{padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:11,color:"#333",fontWeight:600}}>배너 {i+1}</span>
                    <button disabled={i===0} style={{background:"none",border:"1px solid #DDD",borderRadius:4,padding:"2px 6px",fontSize:10,cursor:i===0?"default":"pointer",color:i===0?"#CCC":"#333"}} onClick={()=>{setHeroes(h=>{const n=[...h];[n[i-1],n[i]]=[n[i],n[i-1]];return n;});}}>▲</button>
                    <button disabled={i===heroes.length-1} style={{background:"none",border:"1px solid #DDD",borderRadius:4,padding:"2px 6px",fontSize:10,cursor:i===heroes.length-1?"default":"pointer",color:i===heroes.length-1?"#CCC":"#333"}} onClick={()=>{setHeroes(h=>{const n=[...h];[n[i],n[i+1]]=[n[i+1],n[i]];return n;});}}>▼</button>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <label style={{background:"#F5F5F5",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",color:"#333"}}>
                      변경
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files[0];if(!f)return;const ext=f.name.split(".").pop();const r=await fetch("/api/upload?ext="+ext,{method:"POST",body:f});const j=await r.json();setHeroes(h=>{const n=[...h];n[i]=j.url;return n;});}}/>
                    </label>
                    {heroes.length>1&&<button style={{background:"#FFE8E8",border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",color:"#E53935"}} onClick={()=>{setHeroes(h=>h.filter((_,j)=>j!==i));setHeroIdx(0);}}>삭제</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {heroes.length<5&&(
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:14,border:"2px dashed #DDD",borderRadius:10,cursor:"pointer",color:"#999",fontSize:12,background:"#FAFAFA"}}>
              + 배너 추가
              <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files[0];if(!f)return;const ext=f.name.split(".").pop();const r=await fetch("/api/upload?ext="+ext,{method:"POST",body:f});const j=await r.json();setHeroes(h=>[...h,j.url]);}}/>
            </label>
          )}
          <div style={{marginTop:20}}>
            <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 8px"}}>배너 텍스트</p>
            <p style={{fontSize:8,color:"#999",margin:"0 0 8px"}}>메인 배너에 표시되는 문구를 수정할 수 있습니다.</p>
            <input style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #DDD",fontSize:12,boxSizing:"border-box",marginBottom:8}} value={heroSubText} onChange={e=>setHeroSubText(e.target.value)} placeholder="배너 텍스트 입력"/>
            <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 8px"}}>버튼 텍스트</p>
            <p style={{fontSize:8,color:"#999",margin:"0 0 8px"}}>메인 배너의 버튼 문구를 수정할 수 있습니다. 비워두면 기본값이 사용됩니다.</p>
            <input style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #DDD",fontSize:12,boxSizing:"border-box"}} value={heroBtnText} onChange={e=>setHeroBtnText(e.target.value)} placeholder={t.shopNow}/>
          </div>
        </div>
      )}

      {/* SALES */}
      {adminTab==="sales"&&(()=>{
        const today=new Date().toISOString().slice(0,10);
        const thisMonth=today.slice(0,7);
        const thisYear=today.slice(0,4);
        const grouped={};
        const getShipCost=(o)=>{const sc=shippingCosts.find(s=>s.country===o.shipCountry);return sc?sc.cost:0;};
        const findProd=(it)=>{if(it.prodId)return adminProds.find(p=>p.id===it.prodId);const n=typeof it.name==="object"?it.name.ko||it.name.en:it.name;return adminProds.find(p=>(typeof p.n==="object"?(p.n.ko||p.n.en):p.n)===n);};
        const getItemCost=(o)=>{if(!o.items||o.items.length===0){const prod=adminProds.find(p=>(typeof p.n==="object"?(p.n.en||p.n.ko):p.n)===o.name);return prod?((prod.cost||0)+(prod.pack||0)):0;}return o.items.reduce((s,it)=>{const prod=findProd(it);const cost=(prod?.cost||0)+(prod?.pack||0);return s+cost*(it.qty||1);},0);};
        adminOrders.forEach(o=>{
          const d=o.date||"";
          const dayKey=d.slice(0,10);
          const monKey=d.slice(0,7);
          const yearKey=d.slice(0,4);
          const key=salesPeriod==="day"?dayKey:salesPeriod==="month"?monKey:yearKey;
          if(!grouped[key])grouped[key]={total:0,count:0,shipTotal:0,costTotal:0};
          grouped[key].total+=o.price||0;
          grouped[key].shipTotal+=getShipCost(o);
          grouped[key].costTotal+=getItemCost(o);
          grouped[key].count+=1;
        });
        const sorted=Object.entries(grouped).sort((a,b)=>b[0].localeCompare(a[0]));
        const currentKey=salesPeriod==="day"?today:salesPeriod==="month"?thisMonth:thisYear;
        const current=grouped[currentKey]||{total:0,count:0,shipTotal:0,costTotal:0};
        const allTotal=adminOrders.reduce((s,o)=>s+(o.price||0),0);
        const allShip=adminOrders.reduce((s,o)=>s+getShipCost(o),0);
        const allCost=adminOrders.reduce((s,o)=>s+getItemCost(o),0);
        const calcNet=(rev,ship,cost)=>{const tax=Math.round(rev*taxRate/100);return rev-ship-cost-tax;};
        const periodLabel=salesPeriod==="day"?"오늘":salesPeriod==="month"?"이번 달":"올해";
        return(
        <div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[["day","일별"],["month","월별"],["year","연도별"]].map(([k,l])=>(
              <button key={k} onClick={()=>{setSalesPeriod(k);setChartPage(0);}} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",background:salesPeriod===k?"#FFC94B":"#fff",color:salesPeriod===k?"#fff":"#999",border:"1px solid #F5F5F5"}}>{l}</button>
            ))}
          </div>
          {(()=>{const periodOrders=adminOrders.filter(o=>{const d=o.date||"";const key=salesPeriod==="day"?d.slice(0,10):salesPeriod==="month"?d.slice(0,7):d.slice(0,4);return key===currentKey;});
          const pNet=calcNet(current.total,current.shipTotal||0,current.costTotal||0);
          const aNet=calcNet(allTotal,allShip,allCost);
          const cards=[
            {id:"periodSales",label:periodLabel+" 매출",value:"₩"+current.total.toLocaleString(),color:"#FFC94B",orders:periodOrders},
            {id:"periodShip",label:periodLabel+" 배송비",value:"-₩"+(current.shipTotal||0).toLocaleString(),color:"#E53935",orders:periodOrders.filter(o=>o.shipCountry)},
            {id:"periodCost",label:periodLabel+" 원가+포장",value:"-₩"+(current.costTotal||0).toLocaleString(),color:"#FF9800",orders:periodOrders},
            {id:"periodTax",label:periodLabel+" 세금("+taxRate+"%)",value:"-₩"+Math.round(current.total*taxRate/100).toLocaleString(),color:"#9C27B0",orders:periodOrders},
            {id:"periodNet",label:periodLabel+" 순수익",value:"₩"+pNet.toLocaleString(),sub:current.total>0?Math.round(pNet/current.total*100)+"%":"0%",color:pNet>=0?"#4CAF50":"#E53935",orders:periodOrders},
            {id:"periodCount",label:periodLabel+" 주문",value:current.count+"건",color:"#2196F3",orders:periodOrders},
            {id:"totalSales",label:"누적 매출",value:"₩"+allTotal.toLocaleString(),color:"#FFC94B",orders:adminOrders},
            {id:"totalNet",label:"누적 순수익",value:"₩"+aNet.toLocaleString(),sub:allTotal>0?Math.round(aNet/allTotal*100)+"%":"0%",color:aNet>=0?"#4CAF50":"#E53935",orders:adminOrders}
          ];
          return(<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {cards.map(c=>(
              <div key={c.id} style={{background:salesDetail===c.id?"#FFFEF5":"#fff",borderRadius:10,padding:14,border:salesDetail===c.id?`2px solid ${c.color}`:"1px solid #F5F5F5",cursor:"pointer"}} onClick={()=>{setSalesDetail(salesDetail===c.id?null:c.id);setSalesDetailPage(0);}}>
                <p style={{fontSize:10,color:"#999",margin:"0 0 4px"}}>{c.label}</p>
                <p style={{fontSize:18,fontWeight:700,color:c.color,margin:0,textAlign:"right"}}>{c.value}</p>
                {c.sub&&<p style={{fontSize:11,fontWeight:700,color:c.color,margin:"2px 0 0",textAlign:"right"}}>마진 {c.sub}</p>}
              </div>
            ))}
          </div>
          {salesDetail&&(()=>{const card=cards.find(c=>c.id===salesDetail);if(!card)return null;const ords=card.orders;const sdPerPage=5;const sdTotalPages=Math.max(1,Math.ceil(ords.length/sdPerPage));const sdPage=Math.min(salesDetailPage,sdTotalPages-1);const sdPaged=ords.slice(sdPage*sdPerPage,(sdPage+1)*sdPerPage);return(
            <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <p style={{fontSize:12,fontWeight:700,color:"#333",margin:0}}>{card.label} 상세 ({ords.length}건)</p>
                <button style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#999"}} onClick={()=>setSalesDetail(null)}>✕</button>
              </div>
              {ords.length===0?<p style={{fontSize:11,color:"#999",textAlign:"center",padding:"12px 0"}}>내역이 없습니다.</p>
              :sdPaged.map(o=>(
                <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F5F5F5"}}>
                  <div>
                    <p style={{fontSize:11,fontWeight:600,color:"#333",margin:0}}>{o.items&&o.items.length>0?(typeof o.items[0].name==="object"?o.items[0].name.ko:o.items[0].name):o.name}{o.items&&o.items.length>1?` 외 ${o.items.length-1}건`:""}</p>
                    <p style={{fontSize:9,color:"#999",margin:0}}>{o.id} · {o.date}{o.shipCountry?` · ${o.shipCountry}`:""}</p>
                  </div>
                  {(()=>{const oShip=getShipCost(o);const oCostPack=o.items&&o.items.length>0?o.items.reduce((s,it)=>{const prod=findProd(it);return{cost:s.cost+((prod?.cost||0)*(it.qty||1)),pack:s.pack+((prod?.pack||0)*(it.qty||1))};},{cost:0,pack:0}):(()=>{const prod=adminProds.find(p=>(typeof p.n==="object"?(p.n.en||p.n.ko):p.n)===o.name);return{cost:prod?.cost||0,pack:prod?.pack||0};})();const oTax=Math.round((o.price||0)*taxRate/100);const oNet=(o.price||0)-oShip-oCostPack.cost-oCostPack.pack-oTax;return(
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#FFC94B",margin:0}}>₩{(o.price||0).toLocaleString()}</p>
                    {oShip>0&&<p style={{fontSize:9,color:"#E53935",margin:0}}>배송 -₩{oShip.toLocaleString()}</p>}
                    {oCostPack.cost>0&&<p style={{fontSize:9,color:"#FF9800",margin:0}}>원가 -₩{oCostPack.cost.toLocaleString()}</p>}
                    {oCostPack.pack>0&&<p style={{fontSize:9,color:"#FF9800",margin:0}}>포장 -₩{oCostPack.pack.toLocaleString()}</p>}
                    <p style={{fontSize:9,color:"#9C27B0",margin:0}}>세금({taxRate}%) -₩{oTax.toLocaleString()}</p>
                    <p style={{fontSize:10,fontWeight:700,color:oNet>=0?"#4CAF50":"#E53935",margin:0}}>순수익 ₩{oNet.toLocaleString()}</p>
                  </div>);})()}
                </div>
              ))}
              {sdTotalPages>1&&(
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,paddingTop:10}}>
                  <button disabled={sdPage===0} onClick={()=>setSalesDetailPage(p=>p-1)} style={{background:"none",border:"1px solid #DDD",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:sdPage===0?"default":"pointer",color:sdPage===0?"#CCC":"#333",fontWeight:600}}>←</button>
                  <span style={{fontSize:11,color:"#666"}}>{sdPage+1} / {sdTotalPages}</span>
                  <button disabled={sdPage>=sdTotalPages-1} onClick={()=>setSalesDetailPage(p=>p+1)} style={{background:"none",border:"1px solid #DDD",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:sdPage>=sdTotalPages-1?"default":"pointer",color:sdPage>=sdTotalPages-1?"#CCC":"#333",fontWeight:600}}>→</button>
                </div>
              )}
            </div>
          );})()}
          </>);})()}
          {(()=>{
            const pg=chartPage;
            const filledKeys=(()=>{
              if(salesPeriod==="day"){
                const base=new Date(today);base.setDate(base.getDate()-pg*7);
                const arr=[];for(let i=6;i>=0;i--){const d=new Date(base);d.setDate(d.getDate()-i);arr.push(d.toISOString().slice(0,10));}return arr;
              }
              if(salesPeriod==="month"){
                const [by,bm]=thisMonth.split("-").map(Number);
                let ey=by,em=bm-pg*6;while(em<1){em+=12;ey--;}
                const arr=[];for(let i=5;i>=0;i--){let ny=ey,nm=em-i;while(nm<1){nm+=12;ny--;}arr.push(ny+"-"+String(nm).padStart(2,"0"));}return arr;
              }
              const baseY=Number(thisYear)-pg*3;
              return[String(baseY-2),String(baseY-1),String(baseY)];
            })();
            const chartData=filledKeys.map(k=>[k,grouped[k]||{total:0,count:0}]);
            const maxVal=Math.max(...chartData.map(([,v])=>v.total),1);
            const W=280,H=140,padL=20,padR=20,padT=20,padB=28;
            const gW=W-padL-padR,gH=H-padT-padB;
            const points=chartData.map(([,v],i)=>{
              const x=padL+(chartData.length>1?i/(chartData.length-1):0.5)*gW;
              const y=padT+gH-(v.total/maxVal)*gH;
              return[x,y];
            });
            const polyline=points.map(([x,y])=>x+","+y).join(" ");
            const areaPath=points.length>1?("M"+points[0][0]+","+(padT+gH)+" L"+points.map(([x,y])=>x+","+y).join(" L")+" L"+points[points.length-1][0]+","+(padT+gH)+" Z"):"";
            const rangeLabel=(()=>{
              const f=filledKeys[0],l=filledKeys[filledKeys.length-1];
              if(salesPeriod==="day")return(f||"").slice(5)+" ~ "+(l||"").slice(5);
              if(salesPeriod==="month")return(f||"").slice(0,7)+" ~ "+(l||"").slice(0,7);
              return f+" ~ "+l;
            })();
            return(
            <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <button onClick={()=>setChartPage(p=>p+1)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#333",padding:"0 4px"}}>◀</button>
                <span style={{fontSize:11,fontWeight:700,color:"#333"}}>{rangeLabel}</span>
                <button onClick={()=>setChartPage(p=>Math.max(p-1,0))} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:pg>0?"#333":"#DDD",padding:"0 4px"}}>▶</button>
              </div>
              <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:"auto"}}>
                <defs><linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFC94B" stopOpacity="0.3"/><stop offset="100%" stopColor="#FFC94B" stopOpacity="0.02"/></linearGradient></defs>
                {areaPath&&<path d={areaPath} fill="url(#salesGrad)"/>}
                {points.length>1&&<polyline points={polyline} fill="none" stroke="#FFC94B" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>}
                {points.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke="#FFC94B" strokeWidth="2"/>)}
                {chartData.map(([,v],i)=>{const[x,y]=points[i];return v.total>0?<text key={"v"+i} x={x} y={y-8} textAnchor="middle" fontSize="7" fill="#999">₩{v.total>=10000?(v.total/10000).toFixed(1)+"만":v.total.toLocaleString()}</text>:null;})}
                {chartData.map(([key],i)=>{const[x]=points[i];return<text key={"l"+i} x={x} y={H-4} textAnchor="middle" fontSize="7.5" fill="#666">{salesPeriod==="day"?key.slice(5):salesPeriod==="month"?key.slice(5):key}</text>;})}
              </svg>
            </div>);
          })()}
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#333",margin:"0 0 10px"}}>{salesPeriod==="day"?"일별":salesPeriod==="month"?"월별":"연도별"} 매출 내역</p>
            {sorted.length===0?(<p style={{fontSize:12,color:"#999",textAlign:"center",padding:"16px 0"}}>매출 데이터가 없습니다.</p>)
            :sorted.map(([key,v])=>(
              <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F5F5F5"}}>
                <div>
                  <p style={{fontSize:12,fontWeight:600,color:"#333",margin:0}}>{key}</p>
                  <p style={{fontSize:10,color:"#999",margin:0}}>{v.count}건</p>
                </div>
                {(()=>{const vNet=calcNet(v.total,v.shipTotal||0,v.costTotal||0);return(
                <div style={{textAlign:"right"}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#FFC94B",margin:0}}>₩{v.total.toLocaleString()}</p>
                  {(v.shipTotal||0)>0&&<p style={{fontSize:9,color:"#E53935",margin:0}}>배송 -₩{v.shipTotal.toLocaleString()}</p>}
                  {(v.costTotal||0)>0&&<p style={{fontSize:9,color:"#FF9800",margin:0}}>원가 -₩{v.costTotal.toLocaleString()}</p>}
                  <p style={{fontSize:9,color:"#9C27B0",margin:0}}>세금 -₩{Math.round(v.total*taxRate/100).toLocaleString()}</p>
                  <p style={{fontSize:10,fontWeight:700,color:vNet>=0?"#4CAF50":"#E53935",margin:0}}>순수익 ₩{vNet.toLocaleString()}</p>
                </div>);})()}
              </div>
            ))}
          </div>
        </div>);
      })()}

      {/* PRODUCTS */}
      {adminTab==="products"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:13,fontWeight:700,color:"#333",margin:0}}>상품 목록 ({adminProds.length})</p>
            <button style={{background:"#FFC94B",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>{setEditProd(null);setPName("");setPNameEn("");setPNameJa("");setPPrice("");setPStock("");setPType("PhoneCase");setPCat("Dog");setPTag("");setPDesc("");setPDescEn("");setPDescJa("");setPThumb("");setPSubs(["","","","","",""]);setPCost("");setPPack("");setPShip("");setShowProdForm(true);}}>+ 상품 추가</button>
          </div>
          {showProdForm&&(
            <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:14}}>
              <p style={{fontSize:12,fontWeight:700,color:"#333",margin:"0 0 10px",textAlign:"left"}}>{editProd?"상품 수정":"새 상품 추가"}</p>
              <p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 4px",textAlign:"left"}}>상품명</p>
              <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:6,boxSizing:"border-box",textAlign:"left"}} placeholder="상품명 (한국어)" value={pName} onChange={e=>setPName(e.target.value)}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"0 0 4px"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#999",margin:0,textAlign:"left"}}>상품 설명</p>
                <button style={{background:"#1A1A1A",color:"#FFC94B",border:"none",borderRadius:6,padding:"3px 8px",fontSize:9,fontWeight:700,cursor:"pointer"}} onClick={aiDesc} disabled={aiGenerating}>{aiGenerating?"생성 중...":"✨ AI 자동 작성"}</button>
              </div>
              <textarea style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box",minHeight:50,resize:"none",textAlign:"left"}} placeholder="상품 설명 (한국어)" value={pDesc} onChange={e=>setPDesc(e.target.value)}/>
              <button style={{width:"100%",background:"#1A1A1A",color:"#FFC94B",border:"none",borderRadius:8,padding:"8px 0",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:8}} onClick={autoTranslate} disabled={translating}>{translating?"번역 중...":"🌐 자동 번역 (영어·일본어)"}</button>
              <div style={{display:"flex",gap:6,marginBottom:6}}>
                <div style={{flex:1}}><p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 3px"}}>🇺🇸 English</p><input style={{display:"block",width:"100%",padding:"7px 9px",borderRadius:8,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="Product name" value={pNameEn} onChange={e=>setPNameEn(e.target.value)}/></div>
                <div style={{flex:1}}><p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 3px"}}>🇯🇵 日本語</p><input style={{display:"block",width:"100%",padding:"7px 9px",borderRadius:8,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="商品名" value={pNameJa} onChange={e=>setPNameJa(e.target.value)}/></div>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                <div style={{flex:1}}><textarea style={{display:"block",width:"100%",padding:"7px 9px",borderRadius:8,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box",minHeight:40,resize:"none"}} placeholder="Description" value={pDescEn} onChange={e=>setPDescEn(e.target.value)}/></div>
                <div style={{flex:1}}><textarea style={{display:"block",width:"100%",padding:"7px 9px",borderRadius:8,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box",minHeight:40,resize:"none"}} placeholder="説明" value={pDescJa} onChange={e=>setPDescJa(e.target.value)}/></div>
              </div>
              <div style={{marginBottom:8}}>
                <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 6px"}}>썸네일 이미지</p>
                {pThumb?(
                  <div style={{position:"relative",width:"100%",aspectRatio:"3/4",borderRadius:8,overflow:"hidden",border:"1px solid #DDD",marginBottom:6,background:"#FAFAFA"}}>
                    <img src={pThumb} alt="썸네일 미리보기" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>{e.currentTarget.style.display="none";}}/>
                    <button style={{position:"absolute",top:6,right:6,background:"rgba(229,57,53,0.95)",color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}} onClick={()=>setPThumb("")}>제거</button>
                  </div>
                ):(
                  <div style={{width:"100%",aspectRatio:"3/4",borderRadius:8,border:"1px dashed #CCC",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:11,background:"#FAFAFA"}}>미리보기</div>
                )}
                <label style={{display:"block",background:"#F5F5F5",border:"1px solid #DDD",borderRadius:8,padding:"8px 10px",fontSize:11,textAlign:"center",cursor:"pointer",marginBottom:6,color:"#333"}}>
                  이미지 파일 선택
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files?.[0];if(!f)return;const ext=(f.name.split(".").pop()||"jpg");try{const r=await fetch("/api/upload?ext="+encodeURIComponent(ext),{method:"POST",headers:{"content-type":f.type||"application/octet-stream"},body:f});const j=await r.json();setPThumb(j.url);}catch{}e.target.value="";}}/>
                </label>
                <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,boxSizing:"border-box"}} placeholder="또는 이미지 URL 붙여넣기" value={pThumb.startsWith("data:")?"":pThumb} onChange={e=>setPThumb(e.target.value)}/>
              </div>
              <div style={{marginBottom:10}}>
                <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 6px"}}>서브 이미지 (최대 6장)</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                  {Array.from({length:6}).map((_,i)=>{
                    const img=pSubs[i];
                    return(
                      <label key={i} style={{position:"relative",aspectRatio:"3/4",borderRadius:8,border:img?"1px solid #DDD":"1px dashed #CCC",background:"#FAFAFA",overflow:"hidden",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {img?(
                          <>
                            <img src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                            <button style={{position:"absolute",top:3,right:3,background:"rgba(229,57,53,0.95)",color:"#fff",border:"none",borderRadius:4,padding:"1px 5px",fontSize:9,fontWeight:700,cursor:"pointer",zIndex:1}} onClick={e=>{e.preventDefault();setPSubs(s=>{const n=[...s];n[i]="";return n;});}}>✕</button>
                          </>
                        ):(
                          <span style={{color:"#999",fontSize:18}}>+</span>
                        )}
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files?.[0];if(!f)return;const ext=(f.name.split(".").pop()||"jpg");try{const r=await fetch("/api/upload?ext="+encodeURIComponent(ext),{method:"POST",headers:{"content-type":f.type||"application/octet-stream"},body:f});const j=await r.json();setPSubs(s=>{const n=[...s];n[i]=j.url;return n;});}catch{}e.target.value="";}}/>
                      </label>
                    );
                  })}
                </div>
              </div>
              <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box"}} placeholder="판매가 (숫자만)" value={pPrice} onChange={e=>setPPrice(e.target.value)}/>
              <div style={{background:"#F9F9F9",borderRadius:8,border:"1px solid #EEE",padding:10,marginBottom:8,boxSizing:"border-box",width:"100%",overflow:"hidden"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 6px"}}>원가 · 포장비 (내부 관리용)</p>
                <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:6}}>
                  <input style={{width:"100%",padding:"7px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="원가 (₩)" type="number" value={pCost} onChange={e=>setPCost(e.target.value)}/>
                  <input style={{width:"100%",padding:"7px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="포장비 (₩)" type="number" value={pPack} onChange={e=>setPPack(e.target.value)}/>
                </div>
                {(()=>{const sell=Number(pPrice)||0;const cost=(Number(pCost)||0)+(Number(pPack)||0);const tax=Math.round(sell*taxRate/100);const margin=sell-cost-tax;const rate=sell>0?Math.round(margin/sell*100):0;return sell>0?(
                  <div style={{padding:"6px 8px",background:"#fff",borderRadius:6,border:"1px solid #EEE"}}>
                    <p style={{fontSize:10,color:"#666",margin:"0 0 2px"}}>원가+포장: ₩{cost.toLocaleString()} · 세금({taxRate}%): ₩{tax.toLocaleString()}</p>
                    <p style={{fontSize:11,fontWeight:700,color:margin>0?"#388E3C":"#E53935",margin:0}}>마진: ₩{margin.toLocaleString()} ({rate}%)</p>
                  </div>
                ):null;})()}
              </div>
              <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box"}} placeholder="재고 수량" value={pStock} onChange={e=>setPStock(e.target.value)}/>
              <select style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box"}} value={pType} onChange={e=>setPType(e.target.value)}>
                {PARENT_CATS.map(c=><option key={c} value={c}>{cl[c]}</option>)}
              </select>
              <select style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box"}} value={pCat} onChange={e=>setPCat(e.target.value)}>
                {SUB_CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <select style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box"}} value={pTag} onChange={e=>setPTag(e.target.value)}>
                <option value="">태그 없음</option>
                <option value="Best">Best</option>
                <option value="New">New</option>
              </select>
              <div style={{display:"flex",gap:8}}>
                <button style={{flex:1,background:"#FFC94B",color:"#fff",border:"none",borderRadius:8,padding:10,fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{
                  const nn={en:pNameEn||pName,ko:pName,ja:pNameJa||pName};
                  const dd={en:pDescEn||pDesc,ko:pDesc,ja:pDescJa||pDesc};
                  if(editProd){
                    setProds(ps=>ps.map(p=>p.id===editProd.id?{...p,type:pType,n:nn,price:Number(pPrice),cat:pCat,tag:pTag,d:dd,thumb:pThumb,subs:pSubs,cost:Number(pCost)||0,pack:Number(pPack)||0}:p));
                  } else {
                    const newP={id:Date.now(),type:pType,cat:pCat,tag:pTag,e:"🐾",price:Number(pPrice),n:nn,d:dd,thumb:pThumb,subs:pSubs,cost:Number(pCost)||0,pack:Number(pPack)||0};
                    setProds(ps=>[...ps,newP]);
                  }
                  setShowProdForm(false);
                }}>{editProd?"수정 완료":"추가"}</button>
                <button style={{background:"none",border:"1px solid #DDD",borderRadius:8,padding:10,fontSize:12,cursor:"pointer"}} onClick={()=>setShowProdForm(false)}>취소</button>
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0,minWidth:80,overflowY:"auto",maxHeight:"70vh"}}>
              {CATS.map(c=>{
                const cnt=c==="All"?adminProds.length:adminProds.filter(p=>(p.type||"PhoneCase")===c).length;
                const isOpen=adminOpenParent===c;
                const hasSub=c==="PhoneCase";
                const active=adminCat===c||(isOpen&&SUB_CATS.includes(adminCat));
                return(<div key={c}>
                  <button onClick={()=>{setAdminProdPage(0);if(c==="All"){setAdminCat("All");setAdminOpenParent(null);}else if(hasSub){if(isOpen){setAdminOpenParent(null);setAdminCat(c);}else{setAdminOpenParent(c);setAdminCat(c);}}else{setAdminCat(c);setAdminOpenParent(null);}}} style={{padding:"8px 4px",border:"none",borderLeft:active?"3px solid #FFC94B":"3px solid transparent",background:active?"rgba(255,201,75,0.1)":"none",color:active?"#FFC94B":"#888",fontSize:10,fontWeight:active?700:500,cursor:"pointer",textAlign:"left",whiteSpace:"nowrap",width:"100%"}}>
                    {cl[c]} <span style={{opacity:0.6,fontSize:9}}>({cnt})</span>
                  </button>
                  {hasSub&&isOpen&&(
                    <div style={{display:"flex",flexDirection:"column",gap:1,paddingLeft:6,borderLeft:"2px solid #EEE"}}>
                      {SUB_CATS.map(sc=>{
                        const scnt=adminProds.filter(p=>(p.type||"PhoneCase")===c&&p.cat===sc).length;
                        const on=adminCat===sc;
                        return(<button key={sc} onClick={()=>{setAdminCat(sc);setAdminProdPage(0);}} style={{padding:"5px 4px",border:"none",background:on?"rgba(51,51,51,0.08)":"none",color:on?"#333":"#999",fontSize:9,fontWeight:on?700:500,cursor:"pointer",textAlign:"left",whiteSpace:"nowrap",borderRadius:4}}>{cl[sc]} ({scnt})</button>);
                      })}
                    </div>
                  )}
                </div>);
              })}
            </div>
            <div style={{flex:1,minWidth:0}}>
          {(()=>{const fl=adminCat==="All"?adminProds:PARENT_CATS.includes(adminCat)?adminProds.filter(p=>(p.type||"PhoneCase")===adminCat):adminOpenParent?adminProds.filter(p=>(p.type||"PhoneCase")===adminOpenParent&&p.cat===adminCat):adminProds.filter(p=>p.cat===adminCat);const perPage=6;const totalPages=Math.max(1,Math.ceil(fl.length/perPage));const page=Math.min(adminProdPage,totalPages-1);const paged=fl.slice(page*perPage,(page+1)*perPage);return fl.length===0?(
            <p style={{fontSize:12,color:"#999",textAlign:"center",padding:"24px 0"}}>이 카테고리에 상품이 없어요.</p>
          ):(<>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {paged.map(p=>(
            <div key={p.id} style={{background:"#fff",borderRadius:12,border:"1px solid #F5F5F5",overflow:"hidden",display:"flex",alignItems:"stretch"}}>
              <div style={{position:"relative",width:60,flexShrink:0,background:"#FAFAFA"}}>
                {p.thumb?(
                  <img src={p.thumb} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                ):(
                  <div style={{position:"absolute",inset:0,background:"#E0E0E0"}}/>
                )}
                {p.tag&&<span style={{position:"absolute",top:6,left:6,fontSize:9,background:"#FFC94B",color:"#fff",borderRadius:10,padding:"2px 7px",fontWeight:700}}>{p.tag}</span>}
              </div>
              <div style={{padding:"10px 10px 12px"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{p.n.ko}</p>
                <p style={{fontSize:10,fontWeight:700,color:"#FFC94B",margin:"0 0 2px",textAlign:"left"}}>₩{p.price.toLocaleString()}</p>
                <p style={{fontSize:9,color:"#999",margin:"0 0 2px",textAlign:"left"}}>${(p.price/1350).toFixed(2)} · ¥{Math.round(p.price/9).toLocaleString()}</p>
                {(p.cost>0||p.pack>0)&&(()=>{const c=(p.cost||0)+(p.pack||0);const tx=Math.round(p.price*taxRate/100);const m=p.price-c-tx;return <p style={{fontSize:9,fontWeight:600,color:m>0?"#388E3C":"#E53935",margin:"0 0 6px",textAlign:"left"}}>마진 ₩{m.toLocaleString()}</p>;})()}
                <div style={{display:"flex",gap:6}}>
                  <button style={{flex:1,background:"#F5F5F5",border:"none",borderRadius:6,padding:"6px 0",fontSize:11,cursor:"pointer",color:"#333",fontWeight:600}} onClick={()=>{setEditProd(p);setPName(typeof p.n==="object"?p.n.ko||"":p.n);setPNameEn(typeof p.n==="object"?p.n.en||"":"");setPNameJa(typeof p.n==="object"?p.n.ja||"":"");setPPrice(String(p.price));setPType(p.type||"PhoneCase");setPCat(p.cat);setPTag(p.tag||"");setPDesc(typeof p.d==="object"?p.d.ko||"":p.d);setPDescEn(typeof p.d==="object"?p.d.en||"":"");setPDescJa(typeof p.d==="object"?p.d.ja||"":"");setPThumb(p.thumb||"");setPSubs([...(p.subs||[]),"","","","","",""].slice(0,6));setPCost(p.cost!=null?String(p.cost):"");setPPack(p.pack!=null?String(p.pack):"");setShowProdForm(true);}}>수정</button>
                  <button style={{flex:1,background:"#FFE8E8",border:"none",borderRadius:6,padding:"6px 0",fontSize:11,cursor:"pointer",color:"#E53935",fontWeight:600}} onClick={()=>setProds(ps=>ps.filter(x=>x.id!==p.id))}>삭제</button>
                </div>
              </div>
            </div>
          ))}
          </div>
          {totalPages>1&&(
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,padding:"10px 0"}}>
              <button disabled={page===0} onClick={()=>setAdminProdPage(p=>p-1)} style={{background:"none",border:"1px solid #DDD",borderRadius:6,padding:"5px 10px",fontSize:11,cursor:page===0?"default":"pointer",color:page===0?"#CCC":"#333",fontWeight:600}}>← 이전</button>
              <span style={{fontSize:11,color:"#666"}}>{page+1} / {totalPages}</span>
              <button disabled={page>=totalPages-1} onClick={()=>setAdminProdPage(p=>p+1)} style={{background:"none",border:"1px solid #DDD",borderRadius:6,padding:"5px 10px",fontSize:11,cursor:page>=totalPages-1?"default":"pointer",color:page>=totalPages-1?"#CCC":"#333",fontWeight:600}}>다음 →</button>
            </div>
          )}
          </>)})()}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {adminTab==="orders"&&(()=>{
        const filteredOrders=orderFilter==="All"?adminOrders:adminOrders.filter(o=>o.status.en===orderFilter);
        return(
        <div>
          <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 10px",textAlign:"left"}}>주문 목록 ({adminOrders.length})</p>
          <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap",justifyContent:"flex-start"}}>
            {[["All","전체",adminOrders.length,"#555"],["Processing","처리중",adminOrders.filter(o=>o.status.en==="Processing").length,"#FF9800"],["Shipped","배송중",adminOrders.filter(o=>o.status.en==="Shipped").length,"#1976D2"],["Delivered","배송완료",adminOrders.filter(o=>o.status.en==="Delivered").length,"#5A8A3A"],["Cancelled","취소됨",adminOrders.filter(o=>o.status.en==="Cancelled").length,"#E53935"]].map(([k,l,cnt,clr])=>(
              <button key={k} onClick={()=>{setOrderFilter(k);setOrderPage(0);}} style={{padding:"6px 10px",borderRadius:18,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:orderFilter===k?clr:"#F5F5F5",color:orderFilter===k?"#fff":"#888"}}>{l} ({cnt})</button>
            ))}
          </div>
          {(()=>{const perPage=6;const totalPages=Math.max(1,Math.ceil(filteredOrders.length/perPage));const pg2=Math.min(orderPage,totalPages-1);const paged=filteredOrders.slice(pg2*perPage,(pg2+1)*perPage);return filteredOrders.length===0?(<p style={{fontSize:12,color:"#999",textAlign:"center",padding:"20px 0"}}>해당 상태의 주문이 없습니다.</p>)
          :(<>{paged.map(o=>(
            <div key={o.id} style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:8,textAlign:"left"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:10,color:"#999"}}>{o.id}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <select style={{fontSize:10,border:"1px solid #DDD",borderRadius:6,padding:"2px 6px",background:"#fff"}} value={o.status.en} onChange={e=>{
                    const map={"Processing":{en:"Processing",ko:"처리중",ja:"処理中"},"Shipped":{en:"Shipped",ko:"배송 중",ja:"発送済み"},"Delivered":{en:"Delivered",ko:"배송 완료",ja:"配達済み"},"Cancelled":{en:"Cancelled",ko:"취소됨",ja:"キャンセル"}};
                    setAdminOrders(os=>os.map(x=>x.id===o.id?{...x,status:map[e.target.value]}:x));
                  }}>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                  <button style={{background:"#FFE8E8",border:"none",borderRadius:6,padding:"3px 7px",fontSize:10,cursor:"pointer",color:"#E53935",fontWeight:700}} onClick={()=>setDelPopup({msg:"이 주문을 삭제하시겠습니까?",onOk:()=>setAdminOrders(os=>os.filter(x=>x.id!==o.id))})}>삭제</button>
                </div>
              </div>
              <div style={{display:"flex",gap:10,marginBottom:6}}>
                {o.items&&o.items.length>0&&o.items[0].thumb&&<img src={o.items[0].thumb} alt="" style={{width:48,height:48,borderRadius:8,objectFit:"cover",flexShrink:0,background:"#FAFAFA"}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 2px",textAlign:"left"}}>{o.items&&o.items.length>0?(typeof o.items[0].name==="object"?o.items[0].name[lang]||o.items[0].name.ko||o.items[0].name.en:o.items[0].name):o.name}{o.items&&o.items.length>1&&<span style={{fontSize:11,fontWeight:600,color:"#FF9800",marginLeft:4}}>외 {o.items.length-1}건</span>}</p>
                  <p style={{fontSize:10,color:"#999",margin:0,textAlign:"left"}}>{o.model}{o.items&&o.items[0]&&o.items[0].caseType?` · ${o.items[0].caseType}`:""} · {o.date}</p>
                </div>
              </div>
              {(()=>{const orig=o.items&&o.items.length>0?o.items.reduce((s,it)=>s+(it.price||0)*(it.qty||1),0):0;const hasDiscount=orig>0&&orig>o.price;return(<div style={{marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{display:"flex",alignItems:"center",gap:4}}>{hasDiscount&&<span style={{fontSize:10,color:"#BBB",textDecoration:"line-through"}}>₩{orig.toLocaleString()}</span>}<span style={{fontSize:12,fontWeight:700,color:"#FFC94B"}}>₩{o.price.toLocaleString()}</span>{hasDiscount&&<span style={{fontSize:9,fontWeight:700,color:"#E53935",background:"#FFE8E8",borderRadius:4,padding:"1px 4px"}}>-{Math.round((orig-o.price)/orig*100)}%</span>}</span>
                  <span style={{fontSize:9,fontWeight:700,color:"#fff",borderRadius:18,padding:"2px 8px",background:o.status.en==="Delivered"?"#5A8A3A":o.status.en==="Cancelled"?"#E53935":o.status.en==="Shipped"?"#1976D2":"#FF9800"}}>{o.status.ko}</span>
                </div>
                {o.coupon&&<p style={{fontSize:10,color:"#E6A800",margin:"2px 0 0",textAlign:"left"}}>🎟 {o.coupon} {o.couponDiscount>0&&<span style={{color:"#E53935"}}>(-₩{o.couponDiscount.toLocaleString()})</span>}</p>}
              </div>);})()}
              <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:6}}>
                <select style={{width:"100%",padding:"5px 6px",borderRadius:6,border:"1px solid #DDD",fontSize:10,background:"#fff",boxSizing:"border-box"}} value={o.shipCountry||""} onChange={e=>setAdminOrders(os=>os.map(x=>x.id===o.id?{...x,shipCountry:e.target.value}:x))}>
                  <option value="">국가 선택</option>
                  {shippingCosts.map((sc,si)=><option key={si} value={sc.country}>{sc.country} (₩{sc.cost.toLocaleString()})</option>)}
                </select>
                <input style={{width:"100%",padding:"5px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,textAlign:"left",boxSizing:"border-box"}} placeholder="운송장 번호 입력" value={o.track} onChange={e=>setAdminOrders(os=>os.map(x=>x.id===o.id?{...x,track:e.target.value}:x))}/>
              </div>
              <button style={{width:"100%",padding:"7px 0",borderRadius:6,border:"1px solid #DDD",background:"#FAFAFA",fontSize:11,fontWeight:600,cursor:"pointer",color:"#555"}} onClick={()=>setDetailOrder(o)}>자세히 보기</button>
            </div>
          ))}
          {totalPages>1&&(
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,padding:"10px 0"}}>
              <button disabled={pg2===0} onClick={()=>setOrderPage(p=>p-1)} style={{background:"none",border:"1px solid #DDD",borderRadius:6,padding:"5px 10px",fontSize:11,cursor:pg2===0?"default":"pointer",color:pg2===0?"#CCC":"#333",fontWeight:600}}>← 이전</button>
              <span style={{fontSize:11,color:"#666"}}>{pg2+1} / {totalPages}</span>
              <button disabled={pg2>=totalPages-1} onClick={()=>setOrderPage(p=>p+1)} style={{background:"none",border:"1px solid #DDD",borderRadius:6,padding:"5px 10px",fontSize:11,cursor:pg2>=totalPages-1?"default":"pointer",color:pg2>=totalPages-1?"#CCC":"#333",fontWeight:600}}>다음 →</button>
            </div>
          )}
          </>)})()}
        </div>);
      })()}

      {/* USERS */}
      {adminTab==="users"&&(
        <div>
          <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 12px",textAlign:"left"}}>회원 목록 ({adminUsers.length})</p>
          {adminUsers.map((u,i)=>{const pr=profiles[u.email];return(
            <div key={i} style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:8,textAlign:"left"}}>
              <div style={{display:"flex",gap:10,marginBottom:8}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"#FFF3D0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                  {pr?.avatar?<img src={pr.avatar} style={{width:40,height:40,objectFit:"cover"}} alt=""/>:<span style={{fontSize:16,fontWeight:700,color:"#FFC94B"}}>{(u.name||"U").charAt(0).toUpperCase()}</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 2px"}}>{pr?.name||u.name}</p>
                  <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>{pr?.email||u.email}</p>
                  {pr?.addr&&<p style={{fontSize:10,color:"#666",margin:0}}>{pr.addr}{pr.city?" "+pr.city:""}</p>}
                </div>
                <button style={{background:"#FFE8E8",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",color:"#E53935",alignSelf:"flex-start",flexShrink:0}} onClick={()=>{setAdminUsers(us=>us.filter((_,j)=>j!==i));setUsers(us=>us.filter(x=>x.email!==u.email));setProfiles(p=>{const n={...p};delete n[u.email];return n;});}}>탈퇴</button>
              </div>
              <button style={{width:"100%",padding:"7px 0",borderRadius:6,border:"1px solid #DDD",background:"#FAFAFA",fontSize:11,fontWeight:600,cursor:"pointer",color:"#555"}} onClick={()=>setDetailUser(u)}>자세히 보기</button>
            </div>
          );})}
        </div>
      )}

      {/* CS */}
      {adminTab==="cs"&&(
        <div>
          <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 12px"}}>1:1 문의 ({inquiries.length})</p>
          {inquiries.map(q=>(
            <div key={q.id} style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:10,color:"#999"}}>{q.user}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:10,color:"#999"}}>{q.date}</span>
                  <button style={{background:"#FFE8E8",border:"none",borderRadius:6,padding:"3px 7px",fontSize:10,cursor:"pointer",color:"#E53935",fontWeight:700}} onClick={()=>setDelPopup({msg:"이 문의를 삭제하시겠습니까?",onOk:()=>setInquiries(qs=>qs.filter(x=>x.id!==q.id))})}>삭제</button>
                </div>
              </div>
              <p style={{fontSize:12,color:"#333",margin:"0 0 8px"}}>{q.msg}</p>
              {q.reply?(
                <div style={{background:"#FFF9E6",borderRadius:6,padding:"8px 10px"}}>
                  <p style={{fontSize:10,color:"#FFC94B",fontWeight:700,margin:"0 0 3px"}}>답변 완료</p>
                  <p style={{fontSize:11,color:"#333",margin:0}}>{q.reply}</p>
                </div>
              ):(
                <div style={{display:"flex",gap:6}}>
                  <input style={{flex:1,padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11}} placeholder="답변 입력..." value={replyText[q.id]||""} onChange={e=>setReplyText(r=>({...r,[q.id]:e.target.value}))}/>
                  <button style={{background:"#FFC94B",color:"#fff",border:"none",borderRadius:6,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>{setInquiries(qs=>qs.map(x=>x.id===q.id?{...x,reply:replyText[q.id]||""}:x));setReplyText(r=>({...r,[q.id]:""}));}}>전송</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* COUPONS */}
      {adminTab==="coupons"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:13,fontWeight:700,color:"#333",margin:0}}>쿠폰 목록</p>
            <button style={{background:"#FFC94B",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>{setShowCouponForm(v=>!v);setEditCouponIdx(null);setCpCode("");setCpDiscount("");setCpType("%");setCpUsed("");}}>+ 쿠폰 추가</button>
          </div>
          {showCouponForm&&(
            <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:12}}>
              <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box"}} placeholder="쿠폰 코드" value={cpCode} onChange={e=>setCpCode(e.target.value)}/>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input style={{flex:1,padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,boxSizing:"border-box"}} placeholder="할인값" value={cpDiscount} onChange={e=>setCpDiscount(e.target.value)}/>
                <select style={{padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12}} value={cpType} onChange={e=>setCpType(e.target.value)}>
                  <option value="%">%</option>
                  <option value="₩">₩</option>
                </select>
              </div>
              <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:8,boxSizing:"border-box"}} placeholder="사용 횟수" type="number" value={cpUsed} onChange={e=>setCpUsed(e.target.value)}/>
              {editCouponIdx!==null?
                <div style={{display:"flex",gap:8}}>
                  <button style={{flex:1,background:"#FFC94B",color:"#fff",border:"none",borderRadius:8,padding:10,fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{if(cpCode&&cpDiscount){setCoupons(cs=>cs.map((x,j)=>j===editCouponIdx?{...x,code:cpCode,discount:Number(cpDiscount),type:cpType,used:cpUsed!==""?Number(cpUsed):x.used}:x));setCpCode("");setCpDiscount("");setCpUsed("");setEditCouponIdx(null);setShowCouponForm(false);}}}>수정 완료</button>
                  <button style={{padding:"10px 14px",background:"#F5F5F5",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",color:"#888"}} onClick={()=>{setCpCode("");setCpDiscount("");setCpUsed("");setEditCouponIdx(null);setShowCouponForm(false);}}>취소</button>
                </div>
              :<button style={{width:"100%",background:"#FFC94B",color:"#fff",border:"none",borderRadius:8,padding:10,fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{if(cpCode&&cpDiscount){setCoupons(cs=>[...cs,{code:cpCode,discount:Number(cpDiscount),type:cpType,used:cpUsed?Number(cpUsed):0,active:true}]);setCpCode("");setCpDiscount("");setCpUsed("");setShowCouponForm(false);}}}>추가</button>}
            </div>
          )}
          {coupons.map((c,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <p style={{fontSize:13,fontWeight:700,color:"#FFC94B",margin:"0 0 2px"}}>{c.code}</p>
                <p style={{fontSize:10,color:"#999",margin:0}}>할인: {c.discount}{c.type} · 사용: {c.used}회</p>
              </div>
              <div style={{display:"flex",gap:5}}>
                <button style={{background:"#F5F5F5",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",color:"#333",fontWeight:600}} onClick={()=>{setCpCode(c.code);setCpDiscount(String(c.discount));setCpType(c.type);setCpUsed(String(c.used||0));setEditCouponIdx(i);setShowCouponForm(true);}}>수정</button>
                <button style={{background:c.active?"#E8F5E9":"#FFE8E8",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",color:c.active?"#388E3C":"#E53935",fontWeight:600}} onClick={()=>setCoupons(cs=>cs.map((x,j)=>j===i?{...x,active:!x.active}:x))}>{c.active?"활성":"비활성"}</button>
                <button style={{background:"#FFE8E8",border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",color:"#E53935"}} onClick={()=>setCoupons(cs=>cs.filter((_,j)=>j!==i))}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CASE TYPES */}
      {adminTab==="caseTypes"&&(
        <div>
          <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 12px",textAlign:"left"}}>케이스 유형 관리</p>
          {/* Category Management */}
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:700,color:"#555",margin:"0 0 8px",textAlign:"left"}}>카테고리 관리</p>
            <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
              {caseCats.map((cc,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,background:"#FFF8E1",border:"1px solid #FFD97A",borderRadius:6,padding:"4px 8px"}}>
                <span style={{fontSize:10,fontWeight:600,color:"#333"}}>{cc.ko}</span>
                <button style={{background:"none",border:"none",fontSize:10,color:"#E53935",cursor:"pointer",padding:0,lineHeight:1}} onClick={()=>{setCaseCats(cs=>cs.filter((_,j)=>j!==i));setCaseTypes(cts=>cts.map(ct=>ct.cat===cc.ko?{...ct,cat:""}:ct));}}>✕</button>
              </div>)}
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <input style={{flex:1,padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:10,boxSizing:"border-box"}} placeholder="카테고리명 입력" value={newCaseCat.ko} onChange={e=>setNewCaseCat(v=>({...v,ko:e.target.value}))} onBlur={async e=>{const v=e.target.value.trim();if(v&&!newCaseCat.en&&!newCaseCat.ja){const[en,ja]=await Promise.all([tr(v,"en"),tr(v,"ja")]);setNewCaseCat(p=>({...p,en:p.en||en,ja:p.ja||ja}));}}}/>
              <button style={{background:C.y,color:"#fff",border:"none",borderRadius:6,padding:"6px 10px",fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0}} onClick={()=>{if(newCaseCat.ko.trim()){setCaseCats(cs=>[...cs,{ko:newCaseCat.ko.trim(),en:newCaseCat.en.trim()||newCaseCat.ko.trim(),ja:newCaseCat.ja.trim()||newCaseCat.ko.trim()}]);setNewCaseCat({ko:"",en:"",ja:""});}}}>+</button>
            </div>
          </div>
          {/* Category Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
            <button style={{padding:"5px 10px",borderRadius:7,border:`1.5px solid ${C.y}`,background:adminCaseCat===""?C.y:"#fff",color:adminCaseCat===""?"#fff":C.y,fontSize:10,fontWeight:600,cursor:"pointer"}} onClick={()=>setAdminCaseCat("")}>전체</button>
            {caseCats.map((cc,i)=><button key={i} style={{padding:"5px 10px",borderRadius:7,border:`1.5px solid ${C.y}`,background:adminCaseCat===cc.ko?C.y:"#fff",color:adminCaseCat===cc.ko?"#fff":C.y,fontSize:10,fontWeight:600,cursor:"pointer"}} onClick={()=>setAdminCaseCat(cc.ko)}>{cc.ko}</button>)}
            <button style={{padding:"5px 10px",borderRadius:7,border:"1.5px solid #CCC",background:adminCaseCat==="__none"?"#EEE":"#fff",color:"#888",fontSize:10,fontWeight:600,cursor:"pointer"}} onClick={()=>setAdminCaseCat("__none")}>미분류</button>
          </div>
          {/* Add Case Type */}
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:12}}>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:6}}>
              <select style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box",background:"#fff"}} value={newCt.cat} onChange={e=>setNewCt(v=>({...v,cat:e.target.value}))}>
                <option value="">카테고리 선택</option>
                {caseCats.map((cc,i)=><option key={i} value={cc.ko}>{cc.ko}</option>)}
              </select>
              <input style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="🇰🇷 한국어" value={newCt.ko} onChange={e=>setNewCt(v=>({...v,ko:e.target.value}))} onBlur={async e=>{const v=e.target.value.trim();if(v&&!newCt.en&&!newCt.ja){const[en,ja]=await Promise.all([tr(v,"en"),tr(v,"ja")]);setNewCt(p=>({...p,en:p.en||en,ja:p.ja||ja}));}}}/>
              <input style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="🇺🇸 English" value={newCt.en} onChange={e=>setNewCt(v=>({...v,en:e.target.value}))}/>
              <input style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="🇯🇵 日本語" value={newCt.ja} onChange={e=>setNewCt(v=>({...v,ja:e.target.value}))}/>
              <input style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="추가 금액 (원) · 0이면 추가금 없음" type="number" value={newCt.price} onChange={e=>setNewCt(v=>({...v,price:e.target.value}))}/>
            </div>
            <div style={{marginBottom:6}}>
              {newCt.img?(<div style={{position:"relative",width:"100%",aspectRatio:"1/1",borderRadius:8,overflow:"hidden",border:"1px solid #DDD",background:"#FAFAFA",marginBottom:4}}>
                <img src={newCt.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                <button style={{position:"absolute",top:4,right:4,background:"rgba(229,57,53,0.95)",color:"#fff",border:"none",borderRadius:4,padding:"2px 6px",fontSize:9,fontWeight:700,cursor:"pointer"}} onClick={()=>setNewCt(v=>({...v,img:""}))}>✕</button>
              </div>):null}
              <label style={{display:"block",background:"#F5F5F5",border:"1px solid #DDD",borderRadius:6,padding:"6px 8px",fontSize:10,textAlign:"center",cursor:"pointer",color:"#666"}}>
                미리보기 이미지 선택
                <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files?.[0];if(!f)return;const ext=(f.name.split(".").pop()||"jpg");try{const r=await fetch("/api/upload?ext="+encodeURIComponent(ext),{method:"POST",headers:{"content-type":f.type||"application/octet-stream"},body:f});const j=await r.json();setNewCt(v=>({...v,img:j.url}));}catch{}e.target.value="";}}/>
              </label>
            </div>
            <button style={{width:"100%",background:C.y,color:"#fff",border:"none",borderRadius:8,padding:"8px 0",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>{if(newCt.ko.trim()){setCaseTypes(ct=>[...ct,{ko:newCt.ko.trim(),en:newCt.en.trim()||newCt.ko.trim(),ja:newCt.ja.trim()||newCt.ko.trim(),img:newCt.img,cat:newCt.cat,price:Number(newCt.price)||0}]);setNewCt({ko:"",en:"",ja:"",img:"",cat:"",price:""});}}}>추가</button>
          </div>
          {/* Case Type List */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {(adminCaseCat===""?caseTypes:adminCaseCat==="__none"?caseTypes.filter(ct=>!ct.cat):caseTypes.filter(ct=>ct.cat===adminCaseCat)).map((ct,i)=>{const name=typeof ct==="string"?ct:ct.ko;const realIdx=caseTypes.indexOf(ct);const isEditing=editCtIdx===realIdx;return(
            <div key={realIdx} style={{background:"#fff",borderRadius:10,padding:10,border:"1px solid #F5F5F5"}}>
              {isEditing?(
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <select style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:10,background:"#fff"}} value={editCt.cat} onChange={e=>setEditCt(v=>({...v,cat:e.target.value}))}>
                    <option value="">카테고리 선택</option>
                    {caseCats.map((cc,ci)=><option key={ci} value={cc.ko}>{cc.ko}</option>)}
                  </select>
                  <input style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="🇰🇷 한국어" value={editCt.ko} onChange={e=>setEditCt(v=>({...v,ko:e.target.value}))} onBlur={async e=>{const v=e.target.value.trim();if(v&&!editCt.en&&!editCt.ja){const[en,ja]=await Promise.all([tr(v,"en"),tr(v,"ja")]);setEditCt(p=>({...p,en:p.en||en,ja:p.ja||ja}));}}}/>
                  <input style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="🇺🇸 English" value={editCt.en} onChange={e=>setEditCt(v=>({...v,en:e.target.value}))}/>
                  <input style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="🇯🇵 日本語" value={editCt.ja} onChange={e=>setEditCt(v=>({...v,ja:e.target.value}))}/>
                  <input style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} placeholder="추가 금액 (원)" type="number" value={editCt.price} onChange={e=>setEditCt(v=>({...v,price:e.target.value}))}/>
                  <div style={{marginBottom:4}}>
                    {editCt.img?(<div style={{position:"relative",width:"100%",aspectRatio:"1/1",borderRadius:8,overflow:"hidden",border:"1px solid #DDD",background:"#FAFAFA",marginBottom:4}}>
                      <img src={editCt.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                      <button style={{position:"absolute",top:4,right:4,background:"rgba(229,57,53,0.95)",color:"#fff",border:"none",borderRadius:4,padding:"2px 6px",fontSize:9,fontWeight:700,cursor:"pointer"}} onClick={()=>setEditCt(v=>({...v,img:""}))}>✕</button>
                    </div>):null}
                    <label style={{display:"block",background:"#F5F5F5",border:"1px solid #DDD",borderRadius:6,padding:"5px 8px",fontSize:10,textAlign:"center",cursor:"pointer",color:"#666"}}>
                      이미지 변경
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files?.[0];if(!f)return;const ext=(f.name.split(".").pop()||"jpg");try{const r=await fetch("/api/upload?ext="+encodeURIComponent(ext),{method:"POST",headers:{"content-type":f.type||"application/octet-stream"},body:f});const j=await r.json();setEditCt(v=>({...v,img:j.url}));}catch{}e.target.value="";}}/>
                    </label>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <button style={{flex:1,background:C.y,color:"#fff",border:"none",borderRadius:6,padding:"7px 0",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>{setCaseTypes(cts=>cts.map((c,j)=>j===realIdx?{ko:editCt.ko.trim(),en:editCt.en.trim()||editCt.ko.trim(),ja:editCt.ja.trim()||editCt.ko.trim(),img:editCt.img,cat:editCt.cat,price:Number(editCt.price)||0}:c));setEditCtIdx(null);}}>저장</button>
                    <button style={{flex:1,background:"#F5F5F5",color:"#666",border:"none",borderRadius:6,padding:"7px 0",fontSize:11,fontWeight:600,cursor:"pointer"}} onClick={()=>setEditCtIdx(null)}>취소</button>
                  </div>
                </div>
              ):(
              <div>
                {ct.cat&&<span style={{fontSize:8,background:"#FFF3CD",color:"#856404",borderRadius:4,padding:"1px 5px",fontWeight:600,display:"inline-block",marginBottom:4}}>{ct.cat}</span>}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#333",margin:0,textAlign:"left"}}>{name}</p>
                  <span style={{fontSize:10,fontWeight:700,color:ct.price>0?"#388E3C":"#999",flexShrink:0}}>{ct.price>0?`+₩${ct.price.toLocaleString()}`:"₩0"}</span>
                </div>
                {(typeof ct==="object"&&ct.img)&&<img src={ct.img} alt="" style={{width:"100%",aspectRatio:"1/1",borderRadius:8,objectFit:"cover",display:"block",background:"#FAFAFA",marginBottom:6}}/>}
                <div style={{display:"flex",gap:4}}>
                  <button style={{flex:1,background:"#E3F2FD",border:"none",borderRadius:6,padding:"5px 0",fontSize:10,cursor:"pointer",color:"#1976D2",fontWeight:600}} onClick={()=>{setEditCtIdx(realIdx);setEditCt({ko:typeof ct==="string"?ct:ct.ko||"",en:typeof ct==="object"?ct.en||"":"",ja:typeof ct==="object"?ct.ja||"":"",img:typeof ct==="object"?ct.img||"":"",cat:typeof ct==="object"?ct.cat||"":"",price:typeof ct==="object"&&ct.price?String(ct.price):""});}}>수정</button>
                  <button style={{flex:1,background:"#FFE8E8",border:"none",borderRadius:6,padding:"5px 0",fontSize:10,cursor:"pointer",color:"#E53935",fontWeight:600}} onClick={()=>setCaseTypes(cts=>cts.filter((_,j)=>j!==realIdx))}>삭제</button>
                </div>
              </div>
              )}
            </div>
          );})}
          </div>
          {caseTypes.length===0&&<p style={{fontSize:12,color:"#999",textAlign:"center",padding:"20px 0"}}>등록된 케이스 유형이 없습니다.</p>}
        </div>
      )}

      {adminTab==="shipping"&&(
        <div>
          <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 4px",textAlign:"left"}}>무료배송 기준</p>
          <p style={{fontSize:8,color:"#999",margin:"0 0 12px",textAlign:"left"}}>기준 금액 이상 구매 시 배송비가 무료로 적용됩니다.</p>
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:16}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:600,color:"#333",flexShrink:0,width:90}}>무료배송 기준 (₩)</span>
              <input style={{flex:1,padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} type="number" value={freeShipMin} onChange={e=>setFreeShipMin(Number(e.target.value)||0)}/>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:600,color:"#333",flexShrink:0,width:90}}>기본 배송비 (₩)</span>
              <input style={{flex:1,padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} type="number" value={defaultShipFee} onChange={e=>setDefaultShipFee(Number(e.target.value)||0)}/>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:11,fontWeight:600,color:"#333",flexShrink:0,width:90}}>세금 비율 (%)</span>
              <input style={{flex:1,padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} type="number" value={taxRate} onChange={e=>setTaxRate(Number(e.target.value)||0)}/>
            </div>
          </div>
          <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 4px",textAlign:"left"}}>배송비 관리</p>
          <p style={{fontSize:8,color:"#999",margin:"0 0 12px",textAlign:"left"}}>고객에게는 무료배송으로 표시됩니다. 내부 관리용입니다.</p>
          <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:12}}>
            <div style={{display:"flex",gap:4,marginBottom:8}}>
              <input style={{flex:1,padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box",minWidth:0}} placeholder="국가명" value={newShipCountry} onChange={e=>setNewShipCountry(e.target.value)}/>
              <input style={{flex:1,padding:"7px 10px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box",minWidth:0}} placeholder="비용 (원)" type="number" value={newShipCost} onChange={e=>setNewShipCost(e.target.value)}/>
            </div>
            <button style={{width:"100%",background:"#FFC94B",color:"#fff",border:"none",borderRadius:6,padding:"8px 0",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:8}} onClick={()=>{if(newShipCountry.trim()&&newShipCost){setShippingCosts(sc=>[...sc,{country:newShipCountry.trim(),cost:Number(newShipCost)}]);setNewShipCountry("");setNewShipCost("");}}}>추가</button>
          </div>
          {shippingCosts.map((sc,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:10,padding:12,border:"1px solid #F5F5F5",marginBottom:8}}>
              {editShipIdx===i?(
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <input style={{flex:1,padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} value={editShipCountry} onChange={e=>setEditShipCountry(e.target.value)}/>
                  <input style={{width:80,padding:"6px 8px",borderRadius:6,border:"1px solid #DDD",fontSize:11,boxSizing:"border-box"}} type="number" value={editShipCost} onChange={e=>setEditShipCost(e.target.value)}/>
                  <button style={{background:"#FFC94B",color:"#fff",border:"none",borderRadius:6,padding:"6px 10px",fontSize:10,fontWeight:700,cursor:"pointer"}} onClick={()=>{setShippingCosts(scs=>scs.map((s,j)=>j===i?{country:editShipCountry.trim()||s.country,cost:Number(editShipCost)||s.cost}:s));setEditShipIdx(null);}}>저장</button>
                  <button style={{background:"#F5F5F5",color:"#666",border:"none",borderRadius:6,padding:"6px 10px",fontSize:10,fontWeight:600,cursor:"pointer"}} onClick={()=>setEditShipIdx(null)}>취소</button>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{flex:1,fontSize:12,fontWeight:600,color:"#333"}}>{sc.country}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#FFC94B"}}>₩{sc.cost.toLocaleString()}</span>
                  <button style={{background:"#E3F2FD",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:"#1976D2",fontWeight:600,flexShrink:0}} onClick={()=>{setEditShipIdx(i);setEditShipCountry(sc.country);setEditShipCost(String(sc.cost));}}>수정</button>
                  <button style={{background:"#FFE8E8",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:"#E53935",fontWeight:600,flexShrink:0}} onClick={()=>setShippingCosts(scs=>scs.filter((_,j)=>j!==i))}>삭제</button>
                </div>
              )}
            </div>
          ))}
          {shippingCosts.length===0&&<p style={{fontSize:12,color:"#999",textAlign:"center",padding:"20px 0"}}>등록된 배송비가 없습니다.</p>}
        </div>
      )}

      {/* NOTICES */}
      {adminTab==="notices"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:13,fontWeight:700,color:"#333",margin:0}}>공지사항</p>
            <button style={{background:"#FFC94B",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>setShowNoticeForm(v=>!v)}>+ 공지 추가</button>
          </div>
          {showNoticeForm&&(
            <div style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #F5F5F5",marginBottom:12}}>
              <p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 4px"}}>🖼 썸네일 이미지 (목록용)</p>
              <div style={{marginBottom:10}}>
                {ntBanner&&<img src={ntBanner} alt="" style={{width:"100%",height:80,objectFit:"cover",borderRadius:8,marginBottom:6,display:"block"}}/>}
                <label style={{display:"inline-block",background:"#F5F5F5",borderRadius:8,padding:"6px 12px",fontSize:11,cursor:"pointer",color:"#333"}}>
                  📷 업로드
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files[0];if(!f)return;const ext=f.name.split(".").pop();const r=await fetch("/api/upload?ext="+ext,{method:"POST",body:f});const j=await r.json();setNtBanner(j.url);}}/>
                </label>
                {ntBanner&&<button style={{background:"none",border:"none",fontSize:10,color:"#E53935",cursor:"pointer",marginLeft:6}} onClick={()=>setNtBanner("")}>삭제</button>}
              </div>
              <p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 4px"}}>📄 상세페이지 이미지</p>
              <div style={{marginBottom:10}}>
                {ntDetailImg&&<img src={ntDetailImg} alt="" style={{width:"100%",borderRadius:8,marginBottom:6,display:"block"}}/>}
                <label style={{display:"inline-block",background:"#F5F5F5",borderRadius:8,padding:"6px 12px",fontSize:11,cursor:"pointer",color:"#333"}}>
                  📷 업로드
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files[0];if(!f)return;const ext=f.name.split(".").pop();const r=await fetch("/api/upload?ext="+ext,{method:"POST",body:f});const j=await r.json();setNtDetailImg(j.url);}}/>
                </label>
                {ntDetailImg&&<button style={{background:"none",border:"none",fontSize:10,color:"#E53935",cursor:"pointer",marginLeft:6}} onClick={()=>setNtDetailImg("")}>삭제</button>}
              </div>
              <p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 4px"}}>🇰🇷 한국어</p>
              <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:4,boxSizing:"border-box"}} placeholder="제목" value={ntTitle.ko} onChange={e=>setNtTitle(t=>({...t,ko:e.target.value}))}/>
              <textarea style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,boxSizing:"border-box",minHeight:50,resize:"none",marginBottom:8}} placeholder="내용" value={ntContent.ko} onChange={e=>setNtContent(c=>({...c,ko:e.target.value}))}/>
              <button style={{width:"100%",background:ntTranslating?"#ccc":"#4CAF50",color:"#fff",border:"none",borderRadius:8,padding:8,fontSize:11,fontWeight:700,cursor:ntTranslating?"default":"pointer",marginBottom:10}} onClick={autoTranslateNotice} disabled={ntTranslating}>{ntTranslating?"번역 중...":"🌐 영어 / 일본어 자동 번역"}</button>
              {[["en","🇺🇸 English"],["ja","🇯🇵 日本語"]].map(([k,l])=>(
                <div key={k} style={{marginBottom:8}}>
                  <p style={{fontSize:10,fontWeight:700,color:"#999",margin:"0 0 4px"}}>{l}</p>
                  <input style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,marginBottom:4,boxSizing:"border-box"}} placeholder={k==="ja"?"タイトル":"Title"} value={ntTitle[k]} onChange={e=>setNtTitle(t=>({...t,[k]:e.target.value}))}/>
                  <textarea style={{display:"block",width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #DDD",fontSize:12,boxSizing:"border-box",minHeight:50,resize:"none"}} placeholder={k==="ja"?"内容":"Content"} value={ntContent[k]} onChange={e=>setNtContent(c=>({...c,[k]:e.target.value}))}/>
                </div>
              ))}
              <button style={{width:"100%",background:"#FFC94B",color:"#fff",border:"none",borderRadius:8,padding:10,fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{if(ntTitle.ko||ntTitle.en||ntTitle.ja){setNotices(ns=>[{id:Date.now(),title:{...ntTitle},date:new Date().toISOString().slice(0,10),content:{...ntContent},banner:ntBanner||"",detailImg:ntDetailImg||""},...ns]);setNtTitle({en:"",ko:"",ja:""});setNtContent({en:"",ko:"",ja:""});setNtBanner("");setNtDetailImg("");setShowNoticeForm(false);}}}>등록</button>
            </div>
          )}
          {notices.map(n=>{const tt=typeof n.title==="object"?n.title:{en:n.title,ko:n.title,ja:n.title};const cc=typeof n.content==="object"?n.content:{en:n.content,ko:n.content,ja:n.content};return(
            <div key={n.id} style={{background:"#fff",borderRadius:10,overflow:"hidden",border:"1px solid #F5F5F5",marginBottom:8}}>
              {n.banner&&<img src={n.banner} alt="" style={{width:"100%",height:80,objectFit:"cover",display:"block"}}/>}
              <div style={{padding:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#333",margin:0}}>{tt.ko||tt.en||tt.ja}</p>
                  <button style={{background:"#FFE8E8",border:"none",borderRadius:6,padding:"3px 7px",fontSize:10,cursor:"pointer",color:"#E53935"}} onClick={()=>setNotices(ns=>ns.filter(x=>x.id!==n.id))}>삭제</button>
                </div>
                <p style={{fontSize:10,color:"#999",margin:"0 0 4px"}}>{n.date}</p>
                <p style={{fontSize:11,color:"#555",margin:0}}>{cc.ko||cc.en||cc.ja}</p>
              </div>
            </div>
          );})}
        </div>
      )}

    </div>
    </div>
    {detailOrder&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDetailOrder(null)}>
        <div style={{background:"#fff",borderRadius:14,padding:"20px 18px",width:320,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 8px 30px rgba(0,0,0,0.2)",textAlign:"left"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:14,fontWeight:700,color:"#333",margin:0}}>주문 상세</p>
            <button style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#999"}} onClick={()=>setDetailOrder(null)}>✕</button>
          </div>
          <div style={{background:"#F8F8F8",borderRadius:8,padding:12,marginBottom:12}}>
            <p style={{fontSize:10,color:"#999",margin:"0 0 4px"}}>{detailOrder.id} · {detailOrder.date}</p>
            <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 4px"}}>{detailOrder.name}</p>
            <p style={{fontSize:11,color:"#666",margin:"0 0 4px"}}>{detailOrder.model}</p>
            {detailOrder.items&&detailOrder.items[0]&&detailOrder.items[0].caseType&&<p style={{fontSize:11,color:"#666",margin:"0 0 4px"}}>케이스 유형: {detailOrder.items[0].caseType}</p>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:700,color:"#FFC94B"}}>₩{detailOrder.price.toLocaleString()}</span>
              <span style={{fontSize:9,fontWeight:700,color:"#fff",borderRadius:18,padding:"2px 8px",background:detailOrder.status.en==="Delivered"?"#5A8A3A":detailOrder.status.en==="Cancelled"?"#E53935":detailOrder.status.en==="Shipped"?"#1976D2":"#FF9800"}}>{detailOrder.status.ko}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
              <span style={{fontSize:10,color:"#888"}}>배송 국가:</span>
              <select style={{padding:"3px 6px",borderRadius:6,border:"1px solid #DDD",fontSize:10,background:"#fff"}} value={detailOrder.shipCountry||""} onChange={e=>{const v=e.target.value;setAdminOrders(os=>os.map(x=>x.id===detailOrder.id?{...x,shipCountry:v}:x));setDetailOrder(d=>({...d,shipCountry:v}));}}>
                <option value="">미선택</option>
                {shippingCosts.map((sc,si)=><option key={si} value={sc.country}>{sc.country}</option>)}
              </select>
              {(()=>{const sc=shippingCosts.find(s=>s.country===detailOrder.shipCountry);return sc?<span style={{fontSize:10,fontWeight:700,color:"#E53935"}}>₩{sc.cost.toLocaleString()}</span>:null;})()}
            </div>
          </div>
          {detailOrder.items&&detailOrder.items.length>0&&(
            <div style={{marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 6px"}}>주문 상품</p>
              {detailOrder.items.map((it,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #F5F5F5"}}>
                  {it.thumb&&<img src={it.thumb} alt="" style={{width:40,height:40,borderRadius:6,objectFit:"cover",flexShrink:0,background:"#FAFAFA"}}/>}
                  <div style={{flex:1}}>
                    <p style={{fontSize:11,fontWeight:600,color:"#333",margin:0}}>{typeof it.name==="object"?it.name.ko:it.name}{(it.qty||1)>1?` ×${it.qty}`:""}</p>
                    <p style={{fontSize:10,color:"#999",margin:0}}>{it.brand} {it.model}{it.caseType?` · ${it.caseType}`:""} · ₩{(it.price*(it.qty||1)).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 6px"}}>고객 정보</p>
            <div style={{background:"#F8F8F8",borderRadius:8,padding:10}}>
              {(detailOrder.custName||detailOrder.addr?.split(" / ")[0])&&(
                <div style={{marginBottom:6}}>
                  <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>이름</p>
                  <p style={{fontSize:12,color:"#333",margin:0,fontWeight:600}}>{detailOrder.custName||detailOrder.addr?.split(" / ")[0]||""}</p>
                </div>
              )}
              {detailOrder.email&&(
                <div style={{marginBottom:6}}>
                  <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>이메일</p>
                  <p style={{fontSize:12,color:"#333",margin:0}}>{detailOrder.email}</p>
                </div>
              )}
              {detailOrder.phone&&(
                <div style={{marginBottom:6}}>
                  <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>연락처</p>
                  <p style={{fontSize:12,color:"#333",margin:0}}>{detailOrder.phone}</p>
                </div>
              )}
              {(detailOrder.custName?detailOrder.addr:detailOrder.addr?.split(" / ").slice(1).join(" / "))&&(
                <div style={{marginBottom:6}}>
                  <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>배송 주소</p>
                  <p style={{fontSize:12,color:"#333",margin:0}}>{detailOrder.custName?detailOrder.addr:detailOrder.addr?.split(" / ").slice(1).join(" / ")}</p>
                </div>
              )}
              {detailOrder.petName&&(
                <div>
                  <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>반려동물 이름</p>
                  <p style={{fontSize:12,color:"#333",margin:0}}>{detailOrder.petName}</p>
                </div>
              )}
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 6px"}}>SNS 링크</p>
            {detailOrder.snsLink?(
              <div style={{background:"#F8F8F8",borderRadius:8,padding:10}}>
                <a href={detailOrder.snsLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1976D2",wordBreak:"break-all"}}>{detailOrder.snsLink}</a>
              </div>
            ):<p style={{fontSize:11,color:"#999",margin:0}}>없음</p>}
          </div>
          {detailOrder.photos&&detailOrder.photos.length>0&&(
            <div style={{marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 6px"}}>고객 제출 이미지</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                {detailOrder.photos.map((src,i)=>(
                  <div key={i} style={{position:"relative"}}>
                    <img src={src} alt="" style={{width:"100%",aspectRatio:"1",borderRadius:8,objectFit:"cover",background:"#FAFAFA",display:"block"}}/>
                    <a href={src} download={"pet-photo-"+(i+1)+".jpg"} style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,0.6)",color:"#fff",borderRadius:4,padding:"2px 6px",fontSize:9,fontWeight:700,textDecoration:"none",cursor:"pointer"}}>저장</a>
                  </div>
                ))}
              </div>
              <button style={{width:"100%",marginTop:8,padding:"8px 0",borderRadius:6,border:"1px solid #DDD",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:"#333"}} onClick={()=>{detailOrder.photos.forEach((src,i)=>{const a=document.createElement("a");a.href=src;a.download="pet-photo-"+(i+1)+".jpg";document.body.appendChild(a);a.click();document.body.removeChild(a);});}}>전체 이미지 다운로드</button>
            </div>
          )}
          {detailOrder.coupon&&(
            <div style={{marginBottom:8}}>
              <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>사용 쿠폰</p>
              <p style={{fontSize:12,color:"#333",margin:0}}>{detailOrder.coupon}</p>
            </div>
          )}
          {detailOrder.track&&(
            <div>
              <p style={{fontSize:10,color:"#999",margin:"0 0 2px"}}>운송장 번호</p>
              <p style={{fontSize:12,color:"#333",margin:0}}>{detailOrder.track}</p>
            </div>
          )}
        </div>
      </div>
    )}
    {detailUser&&(()=>{const pr=profiles[detailUser.email]||{};const prEmail=pr.email||"";const userOrds=orders.filter(o=>o.userEmail===detailUser.email||o.email===detailUser.email||(prEmail&&(o.userEmail===prEmail||o.email===prEmail)));return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDetailUser(null)}>
        <div style={{background:"#fff",borderRadius:14,padding:"20px 18px",width:320,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 8px 30px rgba(0,0,0,0.2)",textAlign:"left"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{fontSize:14,fontWeight:700,color:"#333",margin:0}}>회원 상세</p>
            <button style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#999"}} onClick={()=>setDetailUser(null)}>✕</button>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"#FFF3D0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
              {pr.avatar?<img src={pr.avatar} style={{width:52,height:52,objectFit:"cover"}} alt=""/>:<span style={{fontSize:20,fontWeight:700,color:"#FFC94B"}}>{(pr.name||detailUser.name||"U").charAt(0).toUpperCase()}</span>}
            </div>
            <div>
              <p style={{fontSize:14,fontWeight:700,color:"#333",margin:"0 0 2px"}}>{pr.name||detailUser.name}</p>
              <p style={{fontSize:11,color:"#999",margin:0}}>{pr.email||detailUser.email}</p>
            </div>
          </div>
          <div style={{background:"#F8F8F8",borderRadius:8,padding:12,marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 8px"}}>기본 정보</p>
            {[["이름",pr.name||detailUser.name],["이메일",pr.email||detailUser.email],["주소",pr.addr],["지역",pr.city],["연락처",pr.phone],["가입일",detailUser.date],["총 주문",userOrds.length+"건"]].map(([label,val])=>val?(
              <div key={label} style={{display:"flex",marginBottom:4}}>
                <span style={{fontSize:10,color:"#999",width:50,flexShrink:0}}>{label}</span>
                <span style={{fontSize:11,color:"#333",wordBreak:"break-word"}}>{val}</span>
              </div>
            ):null)}
          </div>
          <div style={{marginBottom:8}}>
            <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 8px"}}>주문 내역 ({userOrds.length})</p>
            {userOrds.length===0?<p style={{fontSize:11,color:"#999",margin:0}}>주문 내역이 없습니다.</p>:userOrds.map(o=>(
              <div key={o.id} style={{background:"#F8F8F8",borderRadius:8,padding:10,marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:10,color:"#999"}}>{o.id}</span>
                  <span style={{fontSize:9,fontWeight:700,color:"#fff",borderRadius:18,padding:"2px 8px",background:o.status.en==="Delivered"?"#5A8A3A":o.status.en==="Cancelled"?"#E53935":o.status.en==="Shipped"?"#1976D2":"#FF9800"}}>{o.status.ko}</span>
                </div>
                <p style={{fontSize:12,fontWeight:600,color:"#333",margin:"0 0 2px"}}>{o.items&&o.items.length>0?(typeof o.items[0].name==="object"?o.items[0].name[lang]||o.items[0].name.ko||o.items[0].name.en:o.items[0].name):o.name}{o.items&&o.items.length>1&&<span style={{fontSize:10,fontWeight:600,color:"#FF9800",marginLeft:4}}>외 {o.items.length-1}건</span>}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#FFC94B"}}>₩{o.price.toLocaleString()}</span>
                  <span style={{fontSize:10,color:"#999"}}>{o.date}</span>
                </div>
                {o.coupon&&<p style={{fontSize:9,color:"#E6A800",margin:"2px 0 0"}}>🎟 {o.coupon}{o.couponDiscount>0&&" (-₩"+o.couponDiscount.toLocaleString()+")"}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );})()}
  </div>
)}
{/* WISHLIST */}
{pg==="wishlist"&&(
  <div style={{minHeight:"calc(100vh - 48px)",background:"#FFFFFF",paddingBottom:24}}>
    <div style={{padding:"16px 16px 0"}}>
      <h2 style={{fontSize:18,fontWeight:700,color:"#000000",margin:"0 0 12px"}}>{t.wishlist}</h2>
    </div>
    {prods.filter(p=>wishSnap.includes(p.id)).length===0?(
      <div style={{textAlign:"center",padding:"60px 0"}}>
        <div style={{fontSize:48,marginBottom:12,color:C.y}}>♥</div>
        <p style={{fontSize:14,color:"#333",margin:"0 0 18px"}}>{t.emptyWish}</p>
        <button style={{...ss.ctaBtn}} onClick={()=>setPg("shop")}>{lang==="ko"?"쇼핑 계속하기":lang==="ja"?"ショッピングを続ける":"Continue Shopping"}</button>
      </div>
    ):(
      <div style={ss.grid}>
        {prods.filter(p=>wishSnap.includes(p.id)).map(p=>(
          <div key={p.id} style={ss.card} onClick={()=>openDet(p)}>
            <div style={ss.cardImg}>
              {p.thumb?<img src={p.thumb} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"#E0E0E0"}}/>}
              {p.tag&&<span style={{position:"absolute",top:7,left:7,background:C.br,color:"#FFFFFF",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:18}}>{p.tag}</span>}
              <button style={{position:"absolute",top:6,right:7,background:"rgba(0,0,0,0.55)",border:"none",outline:"none",cursor:"pointer",fontSize:14,lineHeight:1,width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>{e.stopPropagation();setLiked(l=>({...l,[p.id]:!l[p.id]}));}}>
                <span style={{color:liked[p.id]?C.y:"#FFFFFF"}}>♥</span>
              </button>
            </div>
            <div style={{padding:"9px 10px 12px"}}>
              <p style={{fontSize:10,color:"#000000",margin:"0 0 7px",fontWeight:600,lineHeight:1.3,textAlign:"left"}}>{p.n[lang]}</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontWeight:700,color:C.ru}}>{fmtPrice(p.price)}</span>
                <span style={{fontSize:12,color:C.lb}}>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
{/* CART */}
{pg==="cart"&&(
  <div style={{minHeight:"calc(100vh - 48px)",paddingBottom:100,background:"#FFFFFF"}}>
    <div style={{padding:"16px 16px 0"}}>
      <h2 style={{fontSize:18,fontWeight:700,color:"#000000",margin:"0 0 16px"}}>
        {lang==="ko"?"장바구니":lang==="ja"?"カート":"Cart"}
      </h2>
      {cart.length===0?(
        <div style={{textAlign:"center",padding:"60px 0"}}>
          <p style={{fontSize:14,color:"#333"}}>{lang==="ko"?"장바구니가 비어있어요":lang==="ja"?"カートは空です":"Your cart is empty"}</p>
          <button style={{...ss.ctaBtn,marginTop:20}} onClick={()=>setPg("shop")}>{lang==="ko"?"쇼핑 계속하기":lang==="ja"?"ショッピングを続ける":"Continue Shopping"}</button>
        </div>
      ):(
        <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:"#333"}}>
              <input type="checkbox" checked={cart.length>0&&cart.every(it=>cartChecked.has(it.id))} onChange={e=>{if(e.target.checked)setCartChecked(new Set(cart.map(it=>it.id)));else setCartChecked(new Set());}} style={{width:16,height:16,accentColor:C.y}}/>
              {lang==="ko"?"전체 선택":lang==="ja"?"全て選択":"Select All"}
            </label>
            <span style={{fontSize:11,color:"#999"}}>{cartChecked.size}{lang==="ko"?"개 선택":lang==="ja"?"個選択":" selected"}</span>
          </div>
          {cart.map((item,i)=>{const prod=prods.find(p=>p.id===(item.prodId??item.prod?.id));if(!prod)return null;const checked=cartChecked.has(item.id);return(
            <div key={item.id} style={{background:checked?"rgba(255,201,75,0.06)":"#fff",borderRadius:12,padding:14,marginBottom:10,boxShadow:"0 2px 8px rgba(107,58,42,0.09)",border:checked?`1.5px solid ${C.y}`:"1.5px solid transparent"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input type="checkbox" checked={checked} onChange={()=>setCartChecked(s=>{const ns=new Set(s);if(ns.has(item.id))ns.delete(item.id);else ns.add(item.id);return ns;})} style={{width:18,height:18,accentColor:C.y,flexShrink:0,cursor:"pointer"}}/>
                <div style={{width:54,height:54,background:`linear-gradient(135deg,${C.y},${C.dy})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,overflow:"hidden"}}>{prod.thumb?<img src={prod.thumb} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:prod.e}</div>
                <div style={{flex:1,textAlign:"right"}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 3px"}}>{prod.n[lang]}</p>
                  <p style={{fontSize:10,color:"#888",margin:"0 0 6px"}}>{item.brand} · {item.model}</p>
                  <p style={{fontSize:13,fontWeight:700,color:C.ru}}>{fmtPrice(prod.price*item.qty)}</p>
                </div>
                <button style={{background:"none",border:"none",color:"#ccc",fontSize:18,cursor:"pointer"}} onClick={()=>{setCart(c=>c.filter((_,j)=>j!==i));setCartChecked(s=>{const ns=new Set(s);ns.delete(item.id);return ns;});}}>✕</button>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10,marginTop:10}}>
                <button style={{width:28,height:28,borderRadius:8,border:`1.5px solid ${C.lb}`,background:"none",fontSize:16,cursor:"pointer",color:"#000"}} onClick={()=>setCart(c=>c.map((it,j)=>j===i?{...it,qty:Math.max(1,it.qty-1)}:it))}>−</button>
                <span style={{fontSize:13,fontWeight:700,color:"#333"}}>{item.qty}</span>
                <button style={{width:28,height:28,borderRadius:8,border:`1.5px solid ${C.lb}`,background:"none",fontSize:16,cursor:"pointer",color:"#000"}} onClick={()=>setCart(c=>c.map((it,j)=>j===i?{...it,qty:it.qty+1}:it))}>+</button>
              </div>
            </div>
          );})}
          {(()=>{const sel2=cart.filter(it=>cartChecked.has(it.id));const selTotal=sel2.reduce((s,it)=>{const p=prods.find(x=>x.id===(it.prodId??it.prod?.id));return s+(p?p.price*it.qty:0);},0);const allTotal=cart.reduce((s,it)=>{const p=prods.find(x=>x.id===(it.prodId??it.prod?.id));return s+(p?p.price*it.qty:0);},0);const cartSubtotal=cartChecked.size>0?selTotal:allTotal;const cartShipFree=cartSubtotal>=freeShipMin;const cartShipCost=cartShipFree?0:defaultShipFee;const cartFinalTotal=cartSubtotal+cartShipCost;const cartRemain=freeShipMin-cartSubtotal;return(
          <div style={{background:"rgba(249,221,129,0.3)",borderRadius:12,padding:"14px 16px",marginTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,color:"#333"}}>{t.shippingFee}</span>
              <span style={{fontSize:12,fontWeight:600,color:cartShipFree?"#333":C.ru}}>{cartShipFree?t.free:fmtPrice(defaultShipFee)}</span>
            </div>
            {!cartShipFree&&cartSubtotal>0&&(
              <p style={{fontSize:11,color:C.ru,margin:"0 0 6px",textAlign:"right"}}>{lang==="ko"?`${fmtPrice(cartRemain)} 더 구매하면 무료배송!`:lang==="ja"?`${fmtPrice(cartRemain)}追加で送料無料！`:`${fmtPrice(cartRemain)} more for free shipping!`}</p>
            )}
            {cartChecked.size>0&&cartChecked.size<cart.length&&(
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#999"}}>{lang==="ko"?"선택 상품":lang==="ja"?"選択商品":"Selected"} ({cartChecked.size})</span>
                <span style={{fontSize:12,fontWeight:600,color:C.ru}}>{fmtPrice(selTotal)}</span>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:14,fontWeight:700,color:"#000"}}>{t.total}</span>
              <span style={{fontSize:14,fontWeight:700,color:C.ru}}>{fmtPrice(cartFinalTotal)}</span>
            </div>
          </div>);})()}
        </>
      )}
    </div>
    {cart.length>0&&(
      <div style={{position:"fixed",bottom:0,width:390,padding:"12px 16px 24px",background:"rgba(255,251,238,0.97)",backdropFilter:"blur(8px)",borderTop:`1px solid rgba(107,58,42,0.1)`}}>
        <button style={{...ss.ctaBtn,display:"block",width:"100%",textAlign:"center",borderRadius:14,padding:14,fontSize:14,color:"#FFFFFF",background:cartChecked.size>0?C.y:"#CCC"}} onClick={()=>{
          const items=cartChecked.size>0?cart.filter(it=>cartChecked.has(it.id)):cart;
          if(items.length===0)return;
          const mapped=items.map(it=>({...it,prod:prods.find(x=>x.id===(it.prodId??it.prod?.id))})).filter(it=>it.prod);
          if(mapped.length===0)return;
          setOrdItems(mapped);
          setSel(mapped[0].prod);setBrand(mapped[0].brand);setModel(mapped[0].model);
          openOrd();
        }}>
          {cartChecked.size>0?`${lang==="ko"?"선택 주문하기":lang==="ja"?"選択注文":"Checkout selected"} (${cartChecked.size})`:(lang==="ko"?"전체 주문하기":lang==="ja"?"全て注文する":"Checkout All")} →
        </button>
      </div>
    )}
  </div>
)}
        {/* DELETE CONFIRM */}
        {showDeleteConfirm&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
            <div style={{background:"#fff",borderRadius:16,padding:"28px 24px",textAlign:"center",maxWidth:280,width:"100%",boxShadow:"0 8px 30px rgba(0,0,0,0.2)"}}>
              <p style={{fontSize:15,fontWeight:700,color:"#000",margin:"0 0 8px"}}>{lang==="ko"?"회원탈퇴":lang==="ja"?"退会確認":"Delete Account"}</p>
              <p style={{fontSize:12,color:"#666",margin:"0 0 20px",lineHeight:1.6}}>{lang==="ko"?"정말 탈퇴하시겠습니까?\n탈퇴 후 복구가 불가합니다.":lang==="ja"?"本当に退会しますか？\n退会後の復元はできません。":"Are you sure you want to delete\nyour account? This cannot be undone."}</p>
              <div style={{display:"flex",gap:10}}>
                <button style={{flex:1,padding:"11px 0",borderRadius:10,border:"1.5px solid #DDD",background:"#fff",fontSize:13,fontWeight:600,color:"#333",cursor:"pointer"}} onClick={()=>setShowDeleteConfirm(false)}>No</button>
                <button style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:"#E53935",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"}} onClick={()=>{setAdminUsers(us=>us.filter(x=>x.email!==user.email));setUsers(us=>us.filter(x=>x.email!==user.email));setProfiles(p=>{const n={...p};delete n[user.email];return n;});setShowDeleteConfirm(false);setUser(null);setMenu(false);setPg("home");}}>Yes</button>
              </div>
            </div>
          </div>
        )}
        {delPopup&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDelPopup(null)}>
            <div style={{background:"#fff",borderRadius:14,padding:"28px 22px 20px",width:280,boxShadow:"0 8px 30px rgba(0,0,0,0.18)",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
              <p style={{fontSize:14,fontWeight:700,color:"#333",margin:"0 0 6px"}}>{delPopup.title||"삭제 확인"}</p>
              <p style={{fontSize:12,color:"#666",margin:"0 0 20px",lineHeight:1.5}}>{delPopup.msg}</p>
              <div style={{display:"flex",gap:8}}>
                <button style={{flex:1,padding:"10px 0",borderRadius:8,border:"1px solid #DDD",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:"#666"}} onClick={()=>setDelPopup(null)}>취소</button>
                <button style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",background:delPopup.btnColor||"#E53935",fontSize:12,fontWeight:700,cursor:"pointer",color:"#fff"}} onClick={()=>{delPopup.onOk();setDelPopup(null);}}>{delPopup.btnText||"삭제"}</button>
              </div>
            </div>
          </div>
        )}
        {/* TOAST */}
        {toast&&<div style={{position:"absolute",bottom:22,left:"50%",transform:"translateX(-50%)",background:C.y,color:"#FFFFFF",padding:"10px 18px",borderRadius:26,fontSize:11,fontWeight:600,boxShadow:"0 3px 16px rgba(0,0,0,0.15)",zIndex:700,whiteSpace:"nowrap",maxWidth:"80%",textAlign:"center"}}>{toast}</div>}

      </div>
    </div>
  );
}