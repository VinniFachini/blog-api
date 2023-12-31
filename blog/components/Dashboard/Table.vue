<!-- components/DataTable.vue -->

<template>
  <div v-if="data && data.length > 0">
    <div class="mb-4 flex items-center space-x-2">
      <div
        v-if="
          selectedFilter === 'created_at' || selectedFilter === 'updated_at'
        "
        class="flex space-x-2"
      >
        <input
          v-model="startDateFilter"
          type="date"
          placeholder="Start Date"
          class="p-2 border rounded-md"
        />
        <input
          v-model="endDateFilter"
          type="date"
          placeholder="End Date"
          class="p-2 border rounded-md"
        />
      </div>

      <input
        v-else
        v-model="filterValue"
        type="text"
        placeholder="Filter value..."
        class="p-2 border rounded-md"
      />

      <!-- Updated select dropdown using v-for -->
      <select v-model="selectedFilter" class="p-2 border rounded-md">
        <option v-for="field in filterableFields" :key="field" :value="field">
          {{
            field
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }}
          <!-- Assuming you want to format the field name for display -->
        </option>
      </select>
    </div>

    <table class="w-full bg-white shadow-md rounded-md overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th v-for="field in formattedFields" :key="field" class="py-2 px-4">
            {{ field }}
          </th>
          <th class="py-2 px-4">{{ approvable ? "Approve" : 'Read' }}</th>
          <th class="py-2 px-4">{{ editAble ? "Edit" : "" }}</th>
          <th class="py-2 px-4">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in filteredData"
          :key="item.id"
          class="hover:bg-gray-50"
        >
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
              v-if="!approvable"
              @click="goTo(item)"
              class="text-green-500 hover:underline"
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
                  d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"
                ></path>
                <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path>
              </svg>
            </button>
            <button
              v-else-if="approvable"
              @click="approveComment(item.id)"
              class="text-green-500 hover:underline"
            >
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </td>
          <td class="py-2 px-4 text-center">
            <button
            v-if="editAble"
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
        <ModalComponent :data="item" ref="pageModal" @confirm="handleConfirm" />
      </tbody>
    </table>
  </div>
  <div class="text-xl" v-else>
    There are no Data to be displayed!
  </div>
</template>
  
  <script>
export default {
  props: {
    data: Array,
    fields: Array,
    editAble: Boolean,
    approvable: Boolean
  },
  data() {
    return {
      selectedFilter: "id",
      filterValue: "",
      startDateFilter: "", // Start date for time range filtering
      endDateFilter: "", // End date for time range filtering
      filterableFields: [],
    };
  },
  computed: {
    formattedFields() {
      return this.fields.map((field) => {
        if(field != 'user_image'){
          return field
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        }
      });
    },
    specialFields() {
      return ["categories"]; // Add your special fields here
    },
    filteredData() {
      const filterValue = this.filterValue.toLowerCase();
      const startDateFilter = this.startDateFilter; // Retrieve start date filter value
      const endDateFilter = this.endDateFilter; // Retrieve end date filter value
      this.filterableFields = this.fields
        .filter((item) => item != "categories")
        .filter((item) => item != "content")
        .filter((item) => item != "user_image")
      return this.data.filter((item) => {
        switch (this.selectedFilter) {
          case "id":
            return String(item.id).toLowerCase().includes(filterValue);
          case "post_id":
            return String(item.post_id).toLowerCase().includes(filterValue);
          case "parent_comment_id":
            return String(item.parent_comment_id)
              .toLowerCase()
              .includes(filterValue);
          case "title":
            return item.title.toLowerCase().includes(filterValue);
          case "name":
            return item.name.toLowerCase().includes(filterValue);
          case "username":
            return item.username.toLowerCase().includes(filterValue);
          case "email":
            return item.email.toLowerCase().includes(filterValue);
          case "role":
            return item.role.toLowerCase().includes(filterValue);
          case "created_at":
            const createdDate = new Date(item.created_at);
            return (
              createdDate >= new Date(startDateFilter) &&
              createdDate <= new Date(endDateFilter)
            );
          case "updated_at":
            const updatedDate = new Date(item.updated_at);
            return (
              updatedDate >= new Date(startDateFilter) &&
              updatedDate <= new Date(endDateFilter)
            );
          case "author_id":
            return String(item.author_id).toLowerCase().includes(filterValue);
          default:
            return true;
        }
      });
    },
  },
  methods: {
    async editItem(item) {
      const page =
        this.$route.name.split("-").length > 1
          ? this.$route.name.split("-")[1]
          : this.$route.name;
      this.$router.push(`/admin/${page}/edit/${item.id}`);
    },
    async approveComment(item) {
      const data = {
        title: `Approving Comment`,
        message: `Approving Comment ID: ${item}. Are you sure?`,
        isConfirm: true,
        type: "danger",
        data: item,
        method: 'PATCH'
      };
      await this.$refs.pageModal.openModal(data);
    },
    setInitialDateFilters() {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      // Set initial values for date filters
      this.startDateFilter = firstDayOfMonth.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      this.endDateFilter = lastDayOfMonth.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    },
    async goTo(item) {
      const page =
        this.$route.name.split("-").length > 1
          ? this.$route.name.split("-")[1]
          : this.$route.name;
      this.$router.push(`/admin/${page}/${item.id}`);
    },
    async deleteItem(itemId) {
      const data = {
        title: `Deleting: ${itemId}`,
        message: `Deleting item ${itemId}. Are you sure?`,
        isConfirm: true,
        type: "danger",
        data: itemId,
        method: 'DELETE'
      };
      await this.$refs.pageModal.openModal(data);
    },
    async handleConfirm(data) {
      const page =
        this.$route.name.split("-").length > 1
          ? this.$route.name.split("-")[1]
          : this.$route.name;

      if(data.method == 'DELETE') {
        await this.$useFetch(`${page}/${data.data}`, data.method);
      } else if (data.method == 'PATCH') {
        await this.$useFetch(`${page}/${data.data}/approve`, data.method);
      }

      this.$router.go();
    },
    truncateText(text) {
      const maxLength = 45;
      return text && text.length > maxLength
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
  mounted() {
    this.setInitialDateFilters();
    console.log(this.$props);
  },
};
</script>
  