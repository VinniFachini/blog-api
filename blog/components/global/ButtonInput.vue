<template>
    
    <button v-if="text" :type="type" class="py-2 px-4 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2" :class="rounded ? 'rounded' : '', buttonFull ? 'w-full' : ''">
        {{ text }}
    </button>
    <button v-else :type="type" class="py-2 px-4 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2" :class="rounded ? 'rounded' : '', buttonFull ? 'w-full' : ''">
        <slot></slot>
    </button>


</template>

<script>
export default {
    props: {
        text: String,
        type: String,
        rounded: Boolean,
        buttonFull: Boolean
    }
}
</script>