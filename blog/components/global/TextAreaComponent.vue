<!-- components/MyTextArea.vue -->

<template>
  <div>
    <label v-if="required" :for="id" class="block text-gray-700 mb-2"
      >{{ label }}: <span class="text-red-500">*</span></label
    >
    <label v-else :for="id" class="block text-gray-700 mb-2">{{ label }}</label>
    <textarea
      :id="id"
      :rows="rows"
      :cols="cols"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      :value="value"
      :class="getExtraClasses()"
      class="resize-none w-full py-2 px-3 text-gray-700 leading-tight mb-4 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    ></textarea>
  </div>
</template>
  
  <script>
export default {
  props: {
    label: String,
    value: String,
    required: Boolean,
    modelValue: String,
    id: String,
    noBorder: Boolean,
    inputFull: Boolean,
    rows: {
      type: Number,
      default: 4,
    },
    cols: {
      type: Number,
      default: 30,
    },
    placeholder: String,
  },
  data() {
    return {
      modelValue: "",
    };
  },
  methods: {
    getExtraClasses() {
      const classes = [];
      if (this.$props.noBorder) {
        classes.push("border-none");
      } else {
        classes.push("border");
        classes.push("border ring-1");
      }
      if (this.$props.inputFull) {
        classes.push("w-full");
        classes.push("block");
      } else {
        classes.push("w-fit");
        classes.push("max-w-md");
      }
      return classes.join(" ");
    },
  },
};
</script>
  