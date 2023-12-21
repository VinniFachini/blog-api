<template>
  <div :class="!disabled ? '' : 'opacity-50 pointer-events-none'">
    <label v-if="required && label" for="required-email">
      {{ label }}:
      <span class="text-red-500 required-dot"> * </span>
    </label>
    <label v-else-if="label" for="label-input"> {{ label }}: </label>
    <input
      @input="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
      :disabled="disabled"
      :type="type"
      :required="required"
      :id="required ? 'required-email' : 'label-input'"
      class="input-class rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      :name="label"
      :placeholder="placeholder"
      :class="getExtraClasses()"
    />
  </div>
</template>

<script>
export default {
  data() {},
  props: {
    type: String,
    noBorder: String,
    label: String,
    required: Boolean,
    placeholder: String,
    disabled: Boolean,
    modelValue: String,
    inputFull: Boolean,
  },
  methods: {
    getExtraClasses() {
      const classes = [];
      if (this.$props.noBorder) {
        classes.push("border-none");
      } else {
        classes.push("border");
      }
      if (this.$props.inputFull) {
        classes.push("w-full");
      } else {
        classes.push("w-fit");
      }
      return classes.join(" ");
    },
  },
};
</script>

