<script>
    function addProduct(target) {
        // this is just a product placeholder
        var productAdded = '<li class="cd-cart__product"><div class="cd-cart__image"><a href="#0"><img src="assets/img/product-preview.png" alt="placeholder"></a></div><div class="cd-cart__details"><h3 class="truncate"><a href="#0">Product Name</a></h3><span class="cd-cart__price">$25.99</span><div class="cd-cart__actions"><a href="#0" class="cd-cart__delete-item">Delete</a><div class="cd-cart__quantity"><label for="cd-product-'+ productId +'">Qty</label><span class="cd-cart__select"><select class="reset" id="cd-product-'+ productId +'" name="quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select><svg class="icon" viewBox="0 0 12 12"><polyline fill="none" stroke="currentColor" points="2,4 6,8 10,4 "/></svg></span></div></div></div></li>';
        cartList.insertAdjacentHTML('beforeend', productAdded);
    };
</script>

<div class="cd-cart cd-cart--empty js-cd-cart">
    <a href="#0" class="cd-cart__trigger text-replace">
      Cart
      <ul class="cd-cart__count"> <!-- cart items count -->
        <li>0</li>
        <li>0</li>
      </ul> <!-- .cd-cart__count -->
    </a>
  
    <div class="cd-cart__content">
      <div class="cd-cart__layout">
        <header class="cd-cart__header">
          <h2>Cart</h2>
          <span class="cd-cart__undo">Item removed. <a href="#0">Undo</a></span>
        </header>
        
        <div class="cd-cart__body">
            <ul>
                <li class="cd-cart__product">
                  <div class="cd-cart__image">
                    <a href="#0">
                      <img src="assets/img/product-preview.png" alt="placeholder">
                    </a>
                  </div>
            
                  <div class="cd-cart__details">
                    <h3 class="truncate"><a href="#0">Product Name</a></h3>
            
                    <span class="cd-cart__price">$25.99</span>
            
                    <div class="cd-cart__actions">
                      <a href="#0" class="cd-cart__delete-item">Delete</a>
            
                      <div class="cd-cart__quantity">
                        <label for="cd-product-productId">Qty</label>
            
                        <span class="cd-cart__select">
                          <select class="reset" id="cd-product-productId" name="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <!-- ... -->
                          </select>
            
                          <svg class="icon" viewBox="0 0 12 12"><polyline fill="none" stroke="currentColor" points="2,4 6,8 10,4 "/></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
            
                <!-- other products added to the cart -->
              </ul>
        </div>
  
        <footer class="cd-cart__footer">
          <a href="#0" class="cd-cart__checkout">
            <em>Checkout - $<span>0</span>
              <svg class="icon icon--sm" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><line stroke-width="2" stroke-linecap="round" stroke-linejoin="round" x1="3" y1="12" x2="21" y2="12"/><polyline stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="15,6 21,12 15,18 "/></g>
              </svg>
            </em>
          </a>
        </footer>
      </div>
    </div> <!-- .cd-cart__content -->
  </div> <!-- cd-cart -->



  <style lang="scss">
      .cd-cart__trigger,
.cd-cart__content {
  position: fixed;
  bottom: 20px;
  right: 5%;
  transition: transform .2s;
}

.cd-cart--empty .cd-cart__trigger,
.cd-cart--empty .cd-cart__content { // hide cart
  transform: translateY(150px);
}
.cd-cart__layout {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  overflow: hidden;
  height: 72px;
  width: 72px;
  border-radius: var(--radius);
  transition: height .4s .1s, width  .4s .1s, box-shadow .3s;
  transition-timing-function: cubic-bezier(.67,.17,.32,.95);
  background: var(--cd-color-3);
  box-shadow: 0 4px 30px rgba(#000, .17);
}

.cd-cart--open .cd-cart__layout {
  height: 100%;
  width: 100%;
  transition-delay: 0s;
}
.cd-cart__product--deleted { // this class is added to an item when it is removed form the cart
  position: absolute;
  left: 0;
  width: 100%; 
  opacity: 0;
  animation: cd-item-slide-out .3s forwards;
}

@keyframes cd-item-slide-out {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(80px);
    opacity: 0;
  }
}
  </style>