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
            <td v-for="field in fields" :key="field" class="py-2 px-4">
              {{
                isSpecialField(field)
                  ? formatSpecialField(item[field])
                  : isDateField(field)
                  ? formatDateTime(item[field])
                  : truncateText(item[field])
              }}
            </td>
            <td class="py-2 px-4">
              <button
                @click="editItem(item)"
                class="text-blue-500 hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <!-- SVG path for edit button -->
                </svg>
              </button>
            </td>
            <td class="py-2 px-4">
              <button
                @click="deleteItem(item.id)"
                class="text-red-500 hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <!-- SVG path for delete button -->
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
        console.log("Edit item:", item);
      },
      deleteItem(itemId) {
        console.log("Delete item with ID:", itemId);
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
  