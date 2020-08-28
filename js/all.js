//本作業有參考範例程式碼

new Vue({
  //把Vue綁定在app
  el: "#app",
  data: {
    //放置ajax取得的產品資料
    products: [],
    //放置分頁資料
    pagination: {},
    //暫存資料
    tempProduct: {
      //先定義imageUrl且需為陣列，否則會出錯
      imageUrl: [],
    },
    //判斷接下來的行為是新增或編輯
    isNew: false,
    //切換上傳圖片時的小icon
    status: {
      fileUploading: false,
    },
    user: {
      token: "",
      uuid: "74a69e4c-7e9a-4208-b54e-6c6fc9bfbdd2",
    },
  },
  //生命週期Created，主要用來取得token，如果使用者沒有token會返回登入畫面，如果有則執行跳轉的動作
  created() {
    //取得token的cookies
    this.user.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (this.user.token === "") {
      //若無法取得token，返回Login頁面
      window.location = "Login.html";
    }
    //取得全部產品
    this.getProducts();
  },
  methods: {
    //用getProducts取得全部產品，page設定頁面，預設值為第一頁
    getProducts(page = 1) {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;
      //預設帶入token
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

      axios.get(api).then((response) => {
        //取得產品列表
        this.products = response.data.data;
        //取得分頁資訊
        this.pagination = response.data.meta.pagination;
      });
    },
    //開啟Modal視窗，isNew判斷是新增還是編輯，item用於傳入要編輯或刪除的產品資料
    openModal(isNew, item) {
      switch (isNew) {
        case "new":
          //新增前先清除原來有可能暫存的資料
          this.tempProduct = {
            imageUrl: [],
          };
          //isNew為true代表新增
          this.isNew = true;
          //開啟Modal
          $("#productModal").modal("show");
          break;
        case "edit":
          //因為描述欄位必須取得單一產品的方式，因此會執行ajax
          this.getProducts(item.id);
          //isNew為false代表編輯
          this.isNew = false;
          break;
        case "delete":
          //一層物件只需要用淺拷貝
          this.getProducts = Object.assign({}, item);
          //開啟Modal
          $("#delProductModal").modal("show");
          break;
        default:
          break;
      }
    },
    //取得單一產品詳細資料
    getProduct(id) {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
      axios
        .get(api)
        .then((res) => {
          //取得成功，回寫到tempProduct
          this.tempProduct = res.data.data;
          //打開Modal
          $("#productModal").modal("show");
        })
        .catch((error) => {
          //出現錯誤，顯示錯誤訊息
          console.log(error);
        });
    },
    //上傳產品資料
    updateProduct() {
      //新增商品
      let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
      let httpMethod = "post";
      //編輯商品api，因為屬於patch，所以要傳入id
      //透過this.isNew的true或false來決定是新增或編輯
      if (!this.isNew) {
        api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
        httpMethod = "patch";
      }
      //預設帶入token
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios[httpMethod](api, this.tempProduct)
        .then(() => {
          //關閉 Modal
          $("#productModal").modal("hide");
          //重新取得全部產品資料
          this.getProducts();
        })
        .catch((error) => {
          //錯誤則顯示錯誤訊息
          console.log(error);
        });
    },
    //上傳圖片
    uploadFile() {
      const uploadedFile = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append("file", uploadedFile);
      const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/storage`;
      this.status.fileUploading = true;
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.status.fileUploading = false;
          if (response.status === 200) {
            this.tempProduct.imageUrl.push(response.data.data.path);
          }
        })
        .catch(() => {
          console.log("上傳不可超過 2 MB");
          this.status.fileUploading = false;
        });
    },
    //刪除產品
    delProduct() {
      //透過openModal傳入的this.tempProduct，來撈取this.tempProduct.id，已達到刪除產品的目的
      const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
      //預設帶入token
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios.delete(url).then(() => {
        //關閉Modal
        $("#delProductModal").modal("hide");
        //重新取得全部資料
        this.getProducts();
      });
    },
  },
});
