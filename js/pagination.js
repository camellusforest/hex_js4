Vue.component("pagination", {
  //分頁模板
  template: `
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li
          class="page-item"
          :class="{'disabled': pages.current_page === 1}"
        >
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="emitPages(pages.current_page - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="(item, index) in pages.total_pages"
          :key="index"
          class="page-item"
          :class="{'active': item === pages.current_page}"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="emitPages(item)"
          >{{ item }}</a>
        </li>
        <li
          class="page-item"
          :class="{'disabled': pages.current_page === pages.total_pages}"
        >
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="emitPages(pages.current_page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>`,
  //元件本身的data(不會使用到）
  data() {
    return {};
  },
  //接受由外向內(Products->pagination)傳遞的分頁物件，是在 getProducts中取得的分頁物件
  props: {
    pages: {},
  },
  methods: {
    //item 點擊的分頁按鈕值
    emitPages(item) {
      //透過emit向外傳遞點選的分頁，觸發外層的getProducts
      this.$emit("emit-pages", item);
    },
  },
});
