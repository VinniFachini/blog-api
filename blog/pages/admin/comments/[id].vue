<template>
  <div class="page-container">
    <Head>
      <Title>Dashboard | Category</Title>
    </Head>
    <h1 class="text-4xl">{{ categoryInfo.name }}</h1>
    <section class="related-posts mt-5">
      <article
        v-for="post in relatedPosts"
        :key="post.id"
        class="p-5 bg-slate-600 rounded-md flex align-start justify-between gap-5 flex-col"
      >
        <div class="flex flex-col gap-4 align-between">
          <span class="post-info">
            <h2 class="text-xl text-white">{{ post.title }}</h2>
            <span class="flex align-center justify-start gap-1">
              <h3 class="text-sm text-white">
                {{ post.author }}
              </h3>
              <span class="post-info__date text-sm">
                <span
                  v-if="post.created_at != post.updated_at"
                  class="postDates text-sm text-white"
                >
                  {{ formatDates(post.updated_at) }} (edited)
                </span>
                <span v-else class="postDates text-sm text-white">
                  {{ formatDates(post.created_at) }}
                </span>
              </span>
            </span>
          </span>
          <div class="post-content text-gray-200">
            {{ treatPost(post.content) }}
          </div>
        </div>
        <div class="see-post">
          <ButtonInput
            @click="seePost(post.id)"
            text="See Post"
            rounded
            class="bg-blue-500 hover:bg-blue-600"
            type="button"
          />
        </div>
      </article>
    </section>
    <ModalComponent :data="item" ref="pageModal" @confirm="handleConfirm" />
  </div>
</template>
  
<style lang="scss" scoped>
.related-posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  .post {
    padding: 20px;
  }
}
</style>    
  
<script>
export default {
  setup() {
    definePageMeta({
      layout: "dashboard",
      name: "comments",
    });
  },
  data() {
    return {
      categoryInfo: [],
      relatedPosts: [],
    };
  },
  methods: {
    async fetchCategoryInfo() {
      const response = await this.$useFetch(
        `categories/${this.$route.params.id}`
      );
      this.categoryInfo = await response;
    },
    seePost(id) {
      this.$router.push(`/admin/posts/${id}`);
      console.log(id);
    },
    treatPost(post) {
      const maxChar = 250;
      let postComponents = post.split("\n");
      postComponents = postComponents.map((item) => {
        if (item.startsWith("#text-left")) {
          return item.replace("#text-left", "");
        } else if (item.startsWith("#text-right")) {
          return item.replace("#text-right", "");
        } else if (item.startsWith("#text-center")) {
          return item.replace("#text-center", "");
        } else if (item.startsWith("#text-justify")) {
          return item.replace("#text-justify", "");
        } else if (item.startsWith("###")) {
          return item.replace("###", "");
        } else if (item.startsWith("##")) {
          return item.replace("##", "");
        } else if (item.startsWith("#")) {
          return item.replace("#", "");
        } else {
          return item;
        }
      });
      postComponents = postComponents.filter((item) => item != "");
      postComponents = postComponents.join("\n");
      if (postComponents.length >= maxChar) {
        postComponents = postComponents.substring(0, maxChar) + "...";
      }
      return postComponents;
    },
    async fetchRelatedPosts() {
      const response = await this.$useFetch(
        `categories/${this.$route.params.id}/posts`
      );
      this.relatedPosts = response;
    },
    formatDates(itemDate) {
      let dateObject = new Date(itemDate);
      // dateObject = dateObject.toLocaleString("pt-BR");
      let dateNow = new Date();

      const timeDifference = dateNow - dateObject;
      const millisecondsPerSecond = 1000;
      const secondsPerMinute = 60;
      const minutesPerHour = 60;
      const hoursPerDay = 24;
      const daysPerMonth = 30; // Approximate value, can be adjusted based on requirements
      const monthsPerYear = 12;

      const seconds = timeDifference / millisecondsPerSecond;
      const minutes = seconds / secondsPerMinute;
      const hours = minutes / minutesPerHour;
      const days = hours / hoursPerDay;
      const months = days / daysPerMonth;
      const years = months / monthsPerYear;

      if (years >= 1) {
        return `${Math.floor(years)} years ago`;
      } else if (months >= 1) {
        return `${Math.floor(months)} months ago`;
      } else if (days >= 1) {
        return `${Math.floor(days)} days ago`;
      } else if (hours >= 1) {
        return `${Math.floor(hours)} hours ago`;
      } else if (minutes >= 1) {
        return `${Math.floor(minutes)} minutes ago`;
      } else {
        return `${Math.floor(seconds)} seconds ago`; // Return seconds if the duration is less than a minute
      }
    },
    getAuthorInfo(author_id) {
      return author_id;
    },
  },
  async created() {
    await this.fetchCategoryInfo();
    await this.fetchRelatedPosts();
  },
  mounted() {},
};
</script>