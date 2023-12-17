<!-- components/DataTable.vue -->

<template>
  <div>
    <table class="w-full bg-white shadow-md rounded-md overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th v-for="field in formattedFields" :key="field" class="py-2 px-4">
            {{ field }}
          </th>
          <th class="py-2 px-4">Edit</th>
          <th class="py-2 px-4">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50">
          <td
            v-for="field in fields"
            :key="field"
            class="py-2 px-4"
            :class="
              field == 'content' || field == 'title'
                ? 'text-left'
                : 'text-center'
            "
          >
            {{
              isSpecialField(field)
                ? formatSpecialField(item[field])
                : isDateField(field)
                ? formatDateTime(item[field])
                : truncateText(item[field])
            }}
          </td>
          <td class="py-2 px-4 text-center">
            <button
              @click="editItem(item)"
              class="text-blue-500 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="none"
                class="w-6 h-6"
              >
                <path
                  d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"
                ></path>
                <path
                  d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"
                ></path>
              </svg>
            </button>
          </td>
          <td class="py-2 px-4 text-center">
            <button
              @click="deleteItem(item.id)"
              class="text-red-500 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="none"
                class="w-6 h-6"
              >
                <path
                  d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"
                ></path>
                <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
export default {
  props: {
    data: Array,
    fields: Array,
  },
  computed: {
    formattedFields() {
      return this.fields.map((field) => {
        return field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      });
    },
    specialFields() {
      return ["categories", "other_special_field"]; // Add your special fields here
    },
  },
  methods: {
    editItem(item) {
      const router = useRouter();
      router.push(`/admin/posts/${item.id}`);
    },
    async deleteItem(itemId) {
      await useFetch("http://localhost:3001", `posts/${itemId}`, "DELETE");
      this.$router.go();
    },
    truncateText(text) {
      const maxLength = 45;
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    },
    formatDateTime(dateTimeString) {
      const options = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateTimeString).toLocaleString(undefined, options);
    },
    isDateField(field) {
      return ["created_at", "updated_at"].includes(field);
    },
    isSpecialField(field) {
      return this.specialFields.includes(field);
    },
    formatSpecialField(value) {
      // Implement logic for formatting the special field
      // You might need to adjust this based on your actual data structure
      return Array.isArray(value) ? value.join(", ") : value;
    },
  },
};
</script>
  