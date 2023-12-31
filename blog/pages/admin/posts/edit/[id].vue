<template>
  <div class="page-container">
    <Head>
      <Title>Dashboard | Edit Post</Title>
    </Head>
    <h1 class="text-4xl mb-8">Currently editing post: {{ post.title }}</h1>
    <form>
      <div class="input-group" :class="field" v-for="(value, field) in post" :key="value">
        <TextInput
          v-if="field == 'id' || field == 'author_id'"
          :label="getFieldLabel(field)"
          :required="false"
          :placeholder="getFieldLabel(field)"
          :disabled="getDisabledFields(field)"
          :modelValue="setProperValue(field, value)"
          :type="getFieldType(field)"
          :inputFull="false"
          :noBorder="true"
          class="idField"
        />
        <TextInput
          v-if="field == 'created_at' || field == 'updated_at'"
          :label="getFieldLabel(field)"
          :required="false"
          :placeholder="getFieldLabel(field)"
          :disabled="getDisabledFields(field)"
          :modelValue="setProperValue(field, value)"
          :type="getFieldType(field)"
          :inputFull="false"
          :noBorder="true"
          class="dateField"
        />
        <TextInput
        v-if="field == 'title'"
        :label="getFieldLabel(field)"
        :required="true"
        :placeholder="getFieldLabel(field)"
        :disabled="getDisabledFields(field)"
        :modelValue="setProperValue(field, value)"
        v-model="postTitle"
        :type="getFieldType(field)"
        :inputFull="true"
        :noBorder="false"
        class="titleField"
        />
        <TextAreaComponent
        v-if="field == 'content'"
        :label="getFieldLabel(field)"
        :required="true"
        :placeholder="getFieldLabel(field)"
        :modelValue="postContent"
        rows="8"
        :value="post.content"
        v-model="postContent"
        class="contentField"
        inputFull
        />
        
        
        <div v-else-if="field == 'categories'" class="categories">
          <div class="categories-buttons">
            <div class="button-group">
              <span>Available Categories: </span>
              <div class="buttons">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </ButtonInput>
              </div>
            </div>
            <div class="button-group">
              <span>Selected Categories: </span>
              <div class="buttons">
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
          <div class="button-group"></div>
        </div>
      </div>
      <div class="button-wrapper">
        <ButtonInput
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white"
          rounded
          text="Save Changes"
          @click.prevent="editPost"
        />
        <ButtonInput
          type="submit"
          class="bg-red-500 hover:bg-red-700 text-white"
          rounded
          text="Delete Post"
          @click.prevent="openConfirm()"
        />
      </div>
    </form>
    <ModalComponent :data="item" ref="pageModal" @confirm="handleConfirm" />
  </div>
</template>

<style lang="scss" scoped>
.categories {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;

  .categories-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  .button-group {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    .buttons {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
    }
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

form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  .input-group {
    .titleField, .contentField {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }
  .id {
    grid-area: 1/1/1/2;
  }
  .title {
    grid-area: 2/1/2/5;
  }
  .content {
    grid-area: 3/1/4/5;
  }
  .created_at {
    grid-area: 4/1/4/2;
  }
  .updated_at {
    grid-area: 4/2/4/2;
  }
  .categories {
    grid-area: 5/1/5/5;
    width: 100%;
  }
  .button-wrapper {
    grid-area: 7/1/7/1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
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
      post: [],
      formatedFields: [],
      categories: [],
      postCategories: [],
      postCategoriesRemains: [],
      postTitle: "",
      postContent: "",
    };
  },
  methods: {
    getFieldLabel(field) {
      return field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ");
    },
    getFieldType(givenField) {
      {
        if (givenField === "created_at" || givenField === "updated_at") {
          return "datetime-local";
        } else if (givenField === "categories") {
          return "hidden";
        } else {
          return "text";
        }
      }
    },
    async openConfirm() {
      const data = {
        title: `Are you sure you want to delete Post: ${this.post.id}`,
        message: `By deleting Post ${this.post.id} you are going to delete all of its comments. Are you sure?`,
        isConfirm: true,
        type: 'danger',
        data: this.post.id
      };
      await this.$refs.pageModal.openModal(data);
    },
    async handleConfirm({data}) {
      await this.$useFetch(`posts/${data}`, "DELETE");
      this.$router.push('/admin/posts');
    },
    async editPost() {
      const categories = Array.from(this.postCategories).map((item) => item.id);
      const data = {
        title: this.postTitle != "" ? this.postTitle : this.post.title,
        content: this.postContent != "" ? this.postContent : this.post.content,
        categories: categories,
      };
      await this.$useFetch(
        `posts/${this.$route.params.id}`,
        "PATCH",
        data
      );
      this.$router.back();
    },
    async excludePost() {
      await this.$useFetch(
        `posts/${this.$route.params.id}`,
        "DELETE"
      );
      this.$router.push("/admin/posts");
    },
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
    getDisabledFields(givenField) {
      return givenField == "created_at" ||
        givenField == "updated_at" ||
        givenField == "id" ||
        givenField == "author_id"
        ? true
        : false;
    },
    setProperValue(field, value) {
      if (field === "updated_at" || field === "created_at") {
        const newValue = new Date(value);
        newValue.setMinutes(
          newValue.getMinutes() - newValue.getTimezoneOffset()
        );
        return newValue.toISOString().slice(0, 16);
      } else {
        return value;
      }
    },
    async fetchPostInfo() {
      const response = await this.$useFetch(
        `posts/${this.$route.params.id}`
      );
      this.post = await response;
      this.postCategories = await response.categories;
      console.log(this.postCategories)
      this.fields = Object.keys(response);
      let categories = await this.$useFetch(`categories`);
      this.categories = categories;

      const matchingCategory = Array.from(this.postCategories).map((item) => {
        return Array.from(this.categories).find((cat) => cat.name === item.name);
      });

      this.postCategories = matchingCategory;

      this.postCategoriesRemains = Array.from(this.categories).filter(
        (x) => !this.postCategories.includes(x)
      );

      this.postContent = response.content

    },
  },
  async created() {
    this.fetchPostInfo();
    console.log(this.$data)
  },
};
</script>