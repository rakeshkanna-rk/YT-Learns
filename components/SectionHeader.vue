<template>
  <header>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
});
</script>

<style scoped>

header{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}

h1 {
  font-size: 2.2rem;
  color: var(--c-white);
  margin-bottom: 40px;
  font-weight: 700;
  line-height: 0.25;
}

p {
  font-size: 1.2rem;
  color: var(--c-grey);
  opacity: 0.8;
  text-align: center;}
</style>