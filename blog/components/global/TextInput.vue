<template>
    <div :class=" !disabled ? '' : 'opacity-50 pointer-events-none' ">
    <label v-if="required && label" for="required-email" class="text-white">
        {{label}}: 
        <span class="text-red-500 required-dot">
            *
        </span>
    </label>
    <label v-else-if="label" for="label-input" class="text-white">
        {{label}}:
    </label>
    <input @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" :disabled="disabled" :type="type" :required="required" :id="required ? 'required-email' : 'label-input'" class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" :name="label" :placeholder="placeholder" :class="inputFull ? 'w-100 w-full' : ''"/>
    </div>
</template>

<script>
export default {
    data() {},
    props: {
        type: String,
        label: String,
        required: Boolean,
        placeholder: String,
        disabled: Boolean,
        modelValue: String,
        inputFull: Boolean
    }
}
</script>

