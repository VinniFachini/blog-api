<template>
  <div class="content">
    <Head>
      <Title>Dashboard | Posts</Title>
    </Head>
    <div class="posts-header">
      <h1 class="text-4xl">Posts</h1>
      <NuxtLink to="/admin/posts/new">
        <ButtonInput
          class="custom-button bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 mt-4 transition-all duration-300 ease-in-out"
        >
          <!-- SVG for New Post Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
          <span>New Post</span>
        </ButtonInput>
      </NuxtLink>
    </div>
    <!-- Display the paginated posts using DashboardTable component -->
    <DashboardTable :data="posts" :fields="postsFields" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});
</script>

<script>
export default {
  data() {
    return {
      posts: [],
      postsFields: []
    }
  },
  async mounted() {
    const response = await this.$useFetch('posts')
    this.posts = response
    this.postsFields = Object.keys(response[0])
  }
};
</script>

<style lang="scss" scoped>
.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 !important;
}

.posts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    padding: 8px;
    margin: 0 4px;
    border: 1px solid #4a90e2;
    border-radius: 3px;
    cursor: pointer;
    min-height: 40px;
    max-height: 40px;
    line-height: 1 !important;
    transition: all 0.2s linear;
  }

  button:hover {
    background-color: #4a90e2;
    color: #fff;
  }

  .numbered-buttons {
    display: flex;

    button {
      padding: 8px;
      transition: all 0.2s linear;
      margin: 0 4px;
      border: 1px solid #4a90e2;
      border-radius: 3px; // Square border-radius
      cursor: pointer;
      aspect-ratio: 1/1 !important;
      width: 40px;
    }

    button:hover {
      background-color: #4a90e2;
      color: #fff;
    }

    .active {
      background-color: #4a90e2;
      color: #fff;
    }
  }
}
</style>
