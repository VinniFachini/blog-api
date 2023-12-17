<template>
  <div class="page-container">
    <Head>
      <Title>Dashboard | Edit Post</Title>
    </Head>
    <h1 class="text-4xl mb-8">Currently editing post: {{ post.title }}</h1>
    <form>
      <div v-for="(value, field) in post" :key="value">
        <TextInput
          v-if="
            field !== 'categories' && field !== 'title' && field !== 'content'
          "
          :label="getFieldLabel(field)"
          :required="false"
          :placeholder="getFieldLabel(field)"
          :disabled="getDisabledFields(field)"
          :modelValue="setProperValue(field, value)"
          :type="getFieldType(field)"
          :inputFull="false"
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
          :inputFull="false"
        />
        <TextInput
          v-if="field == 'content'"
          :label="getFieldLabel(field)"
          :required="true"
          :placeholder="getFieldLabel(field)"
          :disabled="getDisabledFields(field)"
          :modelValue="setProperValue(field, value)"
          v-model="postContent"
          :type="getFieldType(field)"
          :inputFull="false"
        />
        <!-- <SelectComponent
          v-else
          :id="getFieldLabel(field)"
          :label="getFieldLabel(field)"
          :modelValue="value"
          :options="categories"
          @update:modelValue="updatePostField(field, $event)"
        /> -->
        <div v-else-if="field == 'categories'" class="categories">
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
          <div class="button-group"></div>
        </div>
      </div>
      <ButtonInput
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white mt-5"
        rounded
        text="Save Changes"
        @click.prevent="editPost"
      />
      <ButtonInput
        type="submit"
        class="bg-red-500 hover:bg-red-700 text-white mt-5 ml-3"
        rounded
        text="Delete Post"
        @click.prevent="excludePost"
      />
    </form>
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
    align-items: center;
    justify-content: center;
    gap: 10px;
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
    async editPost() {
      const categories = Array.from(this.postCategories).map((item) => item.id);
      const data = {
        title: this.postTitle != "" ? this.postTitle : this.post.title,
        content: this.postContent != "" ? this.postContent : this.post.content,
        categories: categories,
      };
      await useFetch(
        "http://localhost:3001",
        `posts/${this.$route.params.id}`,
        "PATCH",
        data
      );
      this.fetchPostInfo();
    },
    async excludePost() {
      await useFetch(
        "http://localhost:3001",
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
      console.log(item, action);
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
      const response = await useFetch(
        "http://localhost:3001",
        `posts/${this.$route.params.id}`
      );
      this.post = response;
      this.postCategories = response.categories;
      this.fields = Object.keys(response);
      let categories = await useFetch("http://localhost:3001", `categories`);
      this.categories = categories;

      const matchingCategory = Array.from(this.postCategories).map((item) => {
        return Array.from(this.categories).find((cat) => cat.name === item);
      });

      this.postCategories = matchingCategory;

      this.postCategoriesRemains = Array.from(this.categories).filter(
        (x) => !this.postCategories.includes(x)
      );
    },
  },
  async mounted() {
    this.fetchPostInfo();
  },
};
</script>