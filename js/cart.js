new Vue({
  el: '#app',
  data: {
    totalMoney: 0,
    productList: [],
    checkAllFlag: false,
    delFlag: false,
    curProduct: ''
  },
  filters: {
    formatMoney: function(value) {
      return "¥" + value.toFixed(2);
    }

  },
  mounted: function() {
    this.$nextTick(function() {
      this.cartView();
    })
  },
  methods: {
      cartView: function() {
        var _this = this;
        this.$http.get("data/cartData.json", {"id": 123}).then(function(res) {
          _this.productList = res.body.result.list;
          // _this.totalMoney =  res.body.result.totalMoney;
        });
      },
      changeMoney: function(product, way) {
        if (way > 0) {
          product.productQuantity++;
        }
        else {
          product.productQuantity--;
          if (product.productQuantity < 1) {
            product.productQuantity = 1;
          }
        }
        this.calcTotalPrice();

      },
      selectedProduct: function(item) {
        if (typeof item.checked == 'undefined') {
          // Vue.set(item, "checked", true);
          this.$set(item, "checked", true);
        }
        else {
          item.checked = !item.checked;
        }
        this.calcTotalPrice();
      },
      checkAll: function(flag) {
        this.checkAllFlag = flag;
        var _this = this;
        this.productList.forEach(function (item, index) {
          if (typeof item.checked == 'undefined', _this.checkAllFlag) {
            _this.$set(item, "checked", _this.checkAllFlag);
          }
          else {
            item.checked = _this.checkAllFlag;
          }
        });
        this.calcTotalPrice();
      },
      calcTotalPrice: function() {
        var _this = this;
        this.totalMoney = 0;
        this.productList.forEach(function(item, index) {
          if (item.checked) {
            _this.totalMoney += item.productPrice * item.productQuantity;
          }
        });
      },
      delConfirm: function(item) {
        this.delFlag = true;
        this.curProduct = item;
      },
      delProduct: function() {
        //这一句其实是无法取到对应的索引的，因为都是对象，
          // 之所以看起来成功了，是因为 index == -1，而数组中恰好只有两个元素
          /*
          <a href="javascript:;" class="item-edit-btn" @click="delFlag=true; pindex=index">删除</a>

          delProduct: function(){

                this.productList.splice(this.pindex,1);

                this.delFlag = false;
                }
           */
        var index = this.productList.indexOf(this.curProduct);
        this.productList.splice(index, 1);
        this.delFlag = false;
      }
    }
});
// 全局过滤器
Vue.filter('money', function(value, type) {
  return "¥" + value.toFixed(2) + type;
})
