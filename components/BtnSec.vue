<template>
  <div class="btn-wrapper">
    <div class="upload-btn-sec">
      <NuxtLink :to="link" class="break"><slot/></NuxtLink>
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
  flex-direction: row;
  align-items: center;
  background: var(--blue-r-grad);
  transition: all 0.2s ease-in-out;
  padding: 0 0 1.5px 0;
}

.break{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.upload-btn-sec {
  padding: 11px 25px;
  color: var(--c-white);
  background: var(--bg-color);
}
</style>
