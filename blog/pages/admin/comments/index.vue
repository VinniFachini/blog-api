<template>
  <div class="content">
    <Head>
      <Title>Dashboard | Comments</Title>
    </Head>
    <div class="comments-header">
      <h1 class="text-4xl">Comments</h1>
    </div>
    <!-- Display the paginated posts using DashboardTable component -->
    <DashboardTable
      :data="comments"
      :fields="commentsFields"
      :canRead="false"
    />
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
      comments: [],
      commentsFields: [],
    };
  },
  async mounted() {
    const response = await this.$useFetch("comments");
    this.comments = response;
    this.commentsFields = Object.keys(response[0]);
    console.log(this.commentsFields);
  },
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

.comments-header {
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
