<template>
  <div class="page-container">
    <Head>
      <Title>Dashboard | Post</Title>
    </Head>
    <h1 class="text-4xl">{{ post.title }}</h1>
    <div class="author-categories">
      <div class="author-time">
        <span
          class="authorName text-sm text-gray-400 hover:text-blue-500 hover:underline cursor-default"
        >
          {{ postAuthor }}
        </span>
        <span
          v-if="post.created_at != post.updated_at"
          class="postDates text-sm ml-2 text-gray-700"
        >
          {{ formatDates(post.created_at) }} |
          {{ formatDates(post.updated_at) }}
        </span>
        <span v-else class="postDates text-sm ml-2 text-gray-700">
          {{ formatDates(post.created_at) }}
        </span>
      </div>
      <div class="postCategories">
        <ul class="categories flex gap-1 text-sm">
          <li
            v-for="category in post.categories"
            :key="category"
            class="category text-gray-700 hover:underline hover:text-blue-500 cursor-pointer"
          >
            {{ category }}
          </li>
        </ul>
      </div>
    </div>
    <div class="postContent mt-4">
      <p
        v-for="(paragraph, index) in postContent"
        :key="index"
        class="my-2"
        :class="handleHeadings(paragraph, index)"
      >
        {{ paragraph }}
      </p>
    </div>
    <ModalComponent :data="item" ref="pageModal" @confirm="handleConfirm" />
  </div>
</template>
  
  <style lang="scss" scoped>
</style>
    
  
  <script>
import { useFetch } from "~/composables/api";
export default {
  setup() {
    definePageMeta({
      layout: "dashboard",
    });
  },
  data() {
    return {
      post: [],
      postAuthor: "",
      createdAt: this.formatDates(),
      updatedAt: "",
      postContent: [],
    };
  },
  methods: {
    async fetchPostInfo() {
      const response = await useFetch(
        "http://localhost:3001",
        `posts/${this.$route.params.id}`
      );
      this.post = await response;
    },
    async fetchPostAuthorName() {
      const response = await useFetch(
        "http://localhost:3001",
        `posts/${this.$route.params.id}/author`
      );
      this.postAuthor = await response.name;
    },
    formatDates(a) {
      const dateObject = new Date(a);
      return dateObject.toLocaleString("pt-BR");
    },
    formatContent() {
      let formatedPost = this.post.content
        .split("\n")
        .filter((item) => item != "");
      this.postContent = formatedPost;
    },
    removeTag(item, delimeter) {
      let size = delimeter.length;
      return item.slice(size);
    },
    async handleHeadings(item, index) {
      let paragraphElement = await this.$el.querySelector(".postContent");
      paragraphElement = await Array.from(paragraphElement.children)[index];

      if (paragraphElement.innerText.startsWith("#text-left")) {
        paragraphElement.classList.add("text-left", "indent-6");
        paragraphElement.innerText = paragraphElement.innerText.replace(
          "#text-left ",
          ""
        );
      } else if (paragraphElement.innerText.startsWith("#text-right")) {
        paragraphElement.classList.add("text-right", "indent-6");
        paragraphElement.innerText = paragraphElement.innerText.replace(
          "#text-right ",
          ""
        );
      } else if (paragraphElement.innerText.startsWith("#text-center")) {
        paragraphElement.classList.add("text-center", "indent-6");
        paragraphElement.innerText = paragraphElement.innerText.replace(
          "#text-center ",
          ""
        );
      } else if (paragraphElement.innerText.startsWith("#text-justify")) {
        paragraphElement.classList.add("text-justify", "indent-6");
        paragraphElement.innerText = paragraphElement.innerText.replace(
          "#text-justify ",
          ""
        );
      } else if (paragraphElement.innerText.startsWith("###")) {
        paragraphElement.classList.add("text-xl", "font-bold");
        paragraphElement.innerText = paragraphElement.innerText.replace(
          "###",
          ""
        );
      } else if (paragraphElement.innerText.startsWith("##")) {
        paragraphElement.classList.add("text-2xl", "font-bold");
        paragraphElement.innerText = paragraphElement.innerText.replace(
          "##",
          ""
        );
      } else if (paragraphElement.innerText.startsWith("#")) {
        paragraphElement.classList.add("text-3xl", "font-bold");
        paragraphElement.innerText = paragraphElement.innerText.replace(
          "#",
          ""
        );
      }
    },
  },
  async created() {
    await this.fetchPostInfo();
    await this.fetchPostAuthorName();
    this.formatContent();
  },
  mounted() {},
};
</script>