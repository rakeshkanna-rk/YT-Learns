<template>
  <div class="btn-wrapper">
    <div class="upload-btn">
      <NuxtLink :to="link"><slot/></NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  link: {
    type: String,
  },
});
</script>

<style scoped>
.btn-wrapper {
  display: flex;
  align-items: center;
  background: var(--blue-r-grad);
  padding: 1.5px;
  border-radius: 11.5px;
  transition: all 0.2s ease-in-out;
}

.btn-wrapper:hover {
 scale: 1.05;
}

.upload-btn {
  padding: 10px 20px;
  color: var(--c-white);
  background: var(--bg-color);
  border-radius: 10px;
}
</style>
