:root{
--accent:#7b1fa2;
--muted:#666;
--bg:#f7f7fb;
}
*{box-sizing:border-box}
body{margin:0;font-family:Inter, system-ui, Arial, sans-serif;background:var(--bg);color:#222}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;background:white;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.topbar h1{margin:0;font-size:1.1rem}
.controls{display:flex;gap:0.5rem;align-items:center}
.container{display:flex;gap:1rem;padding:1rem}
.sidebar{width:320px;background:white;padding:1rem;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.06)}
.map-area{flex:1;display:flex;flex-direction:column;gap:1rem}
.floor-panel select,input{width:100%;padding:.5rem;margin-top:.5rem}
.item-list{margin-top:1rem;}
#itemsContainer{display:flex;flex-direction:column;gap:.5rem;max-height:220px;overflow:auto}
.item-card{display:flex;justify-content:space-between;align-items:center;padding:.5rem;border-radius:8px;border:1px solid #eee}
.item-meta{font-size:.9rem;color:var(--muted)}
.cart{margin-top:1rem;padding-top:1rem;border-top:1px dashed #eee}
.cart-summary{display:flex;justify-content:space-between;align-items:center;margin-top:.5rem}
.map-top{display:flex;justify-content:space-between;align-items:center}
.mall-map{position:relative;background:linear-gradient(180deg,#fff,#fafafa);height:520px;border-radius:10px;padding:1rem;border:1px solid #eee}
.floor{position:absolute;inset:0}
.floor.hidden{display:none}
.node{position:absolute;background:rgba(255,255,255,0.9);border:1px solid #ddd;padding:.4rem .6rem;border-radius:6px;font-size:0.85rem;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.04)}
.facility{position:absolute;background:#fffbe6;border:1px solid #ffe58f;padding:.4rem .6rem;border-radius:6px;font-size:.8rem}
.shopper{position:absolute;width:22px;height:22px;background:var(--accent);border-radius:50%;box-shadow:0 6px 14px rgba(123,31,162,.25);transform:translate(-50%,-50%);transition:left 1.8s ease, top 1.8s ease}
.path-svg{position:absolute;inset:0;pointer-events:none}
.modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);align-items:center;justify-content:center}
.modal .modal-content{background:white;padding:1rem 1.2rem;border-radius:10px;max-width:400px;width:90%}
.modal.is-open{display:flex}
.hidden{display:none}
footer{padding:1rem;text-align:center;color:var(--muted)}
.shopkeeper-panel input, .shopkeeper-panel select{display:block;width:100%;padding:.4rem;margin:.35rem 0}
button{cursor:pointer}


@media (max-width:900px){
.container{flex-direction:column}
.sidebar{width:100%}
.map-area{order:2}
}
