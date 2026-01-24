import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "client/ts",
  build: {
    outDir: "../static/js",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        pages: resolve(__dirname, "client/ts/pages.ts"),
        //mobile: resolve(__dirname, "client/ts/mobile.ts"),
        form: resolve(__dirname, "client/ts/form.ts"),
       footer: resolve(__dirname, "client/ts/footer.ts"),
        index: resolve(__dirname, "client/ts/index.ts"),
        products: resolve(__dirname, "client/ts/products.ts"),
        wishlist: resolve(__dirname, "client/ts/wishlist.ts"),
        wishlistGet: resolve(__dirname, "client/ts/wishlist-get.ts"),
        showcase: resolve(__dirname, "client/ts/showcase.ts"),
        bottommenu: resolve(__dirname, "client/ts/bottomMenu.ts"),
        search:resolve(__dirname, "client/ts/search.ts")
      },
    },
  },
});
