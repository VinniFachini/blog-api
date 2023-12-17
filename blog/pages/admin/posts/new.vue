<template>
  <div class="page-wrapper">
    <Head>
      <Title>Dashboard | New Post</Title>
    </Head>
    <div class="post-title">
      <div class="text-4xl">New Post</div>
    </div>
    <form>
      <TextInput type="text" label="Post Title" required placeholder="Post Title" v-model="postTitle" class="textInput" inputFull/>
      <TextAreaComponent label="Post Content" required :value='postContent' v-model="postContent" placeholder="Type the post content here..." />
      <div class="categories">
        <div class="categories-buttons">
          <div class="button-group">
            <span>Available Categories: </span>
            <ButtonInput
              class="bg-green-500 hover:bg-green-700"
              type="button"
              rounded
              v-for="category in postCategoriesRemains"
              :key="category.id"
            >
              {{ category.name }}
              <svg
                @click.prevent="handleCategory(category, 'add')"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </ButtonInput>
          </div>
          <div class="button-group">
            <span>Selected Categories: </span>
            <ButtonInput
              class="bg-blue-500 hover:bg-blue-700 hover:fill-blue-700"
              type="button"
              rounded
              v-for="category in postCategories"
              :key="category.id"
            >
              {{ category.name }}
              <svg
                @click.prevent="handleCategory(category, 'remove')"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </ButtonInput>
          </div>
        </div>
      </div>
      <ButtonInput @click.prevent="createPost()" text="Create Post" class="bg-blue-500 hover:bg-blue-700" rounded type="submit" />
    </form>
    <ModalComponent ref="pageModal"/>
  </div>
</template>


<style lang="scss" scoped>

.text-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.categories {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-direction: column;
  .categories-buttons {
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
  .button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 40px;
    span {
      min-width: 150px;
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 8px 10px;
    }
  }
}
</style>
  

<script>
export default {
  setup() {
    definePageMeta({
      layout: "dashboard",
    });
  },
  data() {
    return {
      categories: [],
      postCategories: [],
      postCategoriesRemains: [],
      postTitle: "",
      postContent: "",
    };
  },
  methods: {
    handleCategory(item, action) {
      if (action === "add") {
        this.postCategories.push(item);
        this.postCategoriesRemains = this.postCategoriesRemains.filter(
          (i) => i != item
        );
      } else if (action === "remove") {
        this.postCategoriesRemains.push(item);
        this.postCategories = this.postCategories.filter((i) => i != item);
      } else {
        console.error("Action no specified!");
      }
    },
    async getCategories() {
      let categories = await useFetch("http://localhost:3001", `categories`);
      this.categories = categories;
      this.postCategoriesRemains = categories;
    },
    async createPost() {
      const postReady = await this.checkFields()
      const categoriesId = this.postCategories.map(i => i.id).sort()
      if(postReady) {
        const postData = {
          title: this.postTitle,
          content: this.postContent,
          categoryIds: categoriesId
        }
        await useFetch('http://localhost:3001', 'posts', 'POST', postData)
        console.log(postData)
      }
    },
    async checkFields() {
      if (this.postTitle.length <= 0) {
        const data = {
          title: 'Post Title',
          message: 'The post must have a title!',
          isConfirm: false
        }
        await this.$refs.pageModal.openModal(data);
        return false
      } else if (this.postContent.length <= 0) {
        const data = {
          title: 'Post Content',
          message: 'The post must have a content!',
          isConfirm: false
        }
        await this.$refs.pageModal.openModal(data);
        return false
      } else if (this.postCategories.length <= 0) {
        const data = {
          title: 'Post Categories',
          message: 'The post must have at least one category!',
          isConfirm: false
        }
        await this.$refs.pageModal.openModal(data);
        return false
      } else {
        const data = {
          title: 'Post Created successfully',
          message: 'The post was created successfully!',
          isConfirm: false
        }
        await this.$refs.pageModal.openModal(data);
        return true
      }
    }
  },
  created() {
    this.getCategories();
  },
};
</script>
